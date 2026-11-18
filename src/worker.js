import { hashPassword, readCookie, sessionCookie, sha256, verifyPassword } from "./auth.mjs";
import { validateEnquiry } from "./validate-enquiry.mjs";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 8;
const MEDIA_MAX_BYTES = 2 * 1024 * 1024;
const STATUSES = new Set(["new", "read", "archived"]);
const LOCALES = ["en", "zh-tw", "ja", "vi"];
const ROLES = new Set(["admin", "editor"]);
const PAGE_STATUSES = new Set(["draft", "published"]);
const MEDIA_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};
const LOCALE_PREFIX = { en: "", "zh-tw": "/zh-tw", ja: "/ja", vi: "/vi" };
const LOCALE_HTML = { en: "en", "zh-tw": "zh-Hant", ja: "ja", vi: "vi" };

let fieldCatalog = null;
let countrySet = null;

function json(data, status, extraHeaders) {
  const headers = new Headers(extraHeaders || {});
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("x-content-type-options", "nosniff");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { status: status || 200, headers: headers });
}

function html(body, status, extraHeaders) {
  const headers = new Headers(extraHeaders || {});
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "same-origin");
  headers.set("cache-control", "no-store");
  return new Response(body, { status: status || 200, headers: headers });
}

function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

async function readBody(request) {
  const text = await request.text();
  if (text.length > 20000) return { error: "too-large" };
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    try {
      return { value: JSON.parse(text || "{}") };
    } catch (err) {
      return { error: "json" };
    }
  }
  const params = new URLSearchParams(text);
  const value = {};
  params.forEach(function (item, key) {
    if (key === "services") {
      if (!value.services) value.services = [];
      value.services.push(item);
      return;
    }
    value[key] = item;
  });
  return { value: value };
}

function wantsJson(request) {
  return (request.headers.get("accept") || "").includes("application/json") ||
    (request.headers.get("content-type") || "").includes("application/json");
}

async function assetJson(request, env, path) {
  const response = await env.ASSETS.fetch(new Request(new URL(path, request.url)));
  if (!response.ok) throw new Error("Missing " + path);
  return response.json();
}

async function countries(request, env) {
  if (!countrySet) {
    const list = await assetJson(request, env, "/assets/countries.json");
    countrySet = new Set(list);
  }
  return countrySet;
}

async function catalog(request, env) {
  if (!fieldCatalog) fieldCatalog = await assetJson(request, env, "/assets/cms-fields.json");
  return fieldCatalog;
}

function allowedKeys(catalogData) {
  const keys = new Set();
  catalogData.groups.forEach(function (group) {
    group.fields.forEach(function (field) { keys.add(field.key); });
  });
  return keys;
}

async function defaultsFor(request, env, locale) {
  const all = await assetJson(request, env, "/assets/cms-defaults.json");
  return all[locale] || {};
}

function avatarUrl(key) {
  return key ? "/media/" + encodeURIComponent(key) : "";
}

function mapUser(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name || "",
    role: row.role || "editor",
    avatarKey: row.avatar_key || "",
    avatarUrl: avatarUrl(row.avatar_key || ""),
    lastLoginAt: row.last_login_at || null,
    createdAt: row.created_at
  };
}

async function currentAdmin(request, env) {
  const token = readCookie(request, "ng_session");
  if (!token) return null;
  const hash = await sha256(token);
  return env.DB.prepare(
    "SELECT admins.id AS id, admins.username AS username, admins.role AS role, admins.display_name AS display_name, admins.avatar_key AS avatar_key, admins.last_login_at AS last_login_at, admins.created_at AS created_at FROM sessions JOIN admins ON admins.id = sessions.admin_id WHERE sessions.token_hash = ? AND sessions.expires_at > ?"
  ).bind(hash, Date.now()).first();
}

async function ensureAdmin(env) {
  const username = String(env.ADMIN_USERNAME || "").trim();
  const password = String(env.ADMIN_PASSWORD || "");
  if (!username || password.length < 8) return;
  const passwordHash = await hashPassword(password);
  const existing = await env.DB.prepare("SELECT id FROM admins WHERE username = ?").bind(username).first();
  if (existing) {
    // Keep the bootstrap account password aligned with Worker secrets.
    await env.DB.prepare("UPDATE admins SET password_hash = ?, role = 'admin' WHERE id = ?")
      .bind(passwordHash, existing.id).run();
    return;
  }
  const anyAdmin = await env.DB.prepare("SELECT id FROM admins LIMIT 1").first();
  if (anyAdmin) return;
  await env.DB.prepare("INSERT INTO admins (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)")
    .bind(username, passwordHash, Date.now()).run();
}

async function startSession(request, env, adminId) {
  const token = bytesToB64(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash = await sha256(token);
  await env.DB.prepare("INSERT INTO sessions (token_hash, admin_id, expires_at) VALUES (?, ?, ?)")
    .bind(tokenHash, adminId, Date.now() + SESSION_MS).run();
  return sessionCookie(token, request, SESSION_MS / 1000);
}

function bytesToB64(bytes) {
  let text = "";
  for (let i = 0; i < bytes.length; i += 1) text += String.fromCharCode(bytes[i]);
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function ipHash(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || "local";
  return sha256(ip + "|" + (env.IP_HASH_SALT || "northgo-demo"));
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char];
  });
}

function cleanText(value, max) {
  return String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max || 4000);
}

function normalizeSlug(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function publicPagePath(locale, slug) {
  const prefix = LOCALE_PREFIX[locale] || "";
  return prefix + "/pages/" + encodeURIComponent(slug);
}

function parsePublicPagePath(path) {
  let match = path.match(/^\/pages\/([a-z0-9-]+)$/);
  if (match) return { locale: "en", slug: match[1] };
  match = path.match(/^\/(zh-tw|ja|vi)\/pages\/([a-z0-9-]+)$/);
  if (match) return { locale: match[1], slug: match[2] };
  return null;
}

function resultPage(ok, back) {
  const title = ok ? "Enquiry received" : "Enquiry not sent";
  const message = ok
    ? "Thank you! Your submission has been received!"
    : "Oops! Something went wrong while submitting the form.";
  return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>" +
    esc(title) + "</title></head><body style=\"font-family:Segoe UI,sans-serif;background:#f3f6fa;color:#0a1b33;padding:2rem\"><main style=\"max-width:36rem;margin:auto;background:#fff;padding:1.5rem;border-radius:14px\"><h1>" +
    esc(message) + "</h1><p><a href=\"" + esc(back) + "\">Back</a></p></main></body></html>";
}

function backLink(request) {
  const referer = request.headers.get("referer");
  if (!referer) return "/contact";
  try {
    const url = new URL(referer);
    if (url.origin !== new URL(request.url).origin) return "/contact";
    return url.pathname + url.search;
  } catch (err) {
    return "/contact";
  }
}

async function insertEnquiry(env, row, ipHashValue) {
  const result = await env.DB.prepare(
    "INSERT INTO enquiries (locale, first_name, last_name, company, email, phone, country, services, message, terms_accepted, status, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    row.locale, row.firstName, row.lastName, row.company, row.email, row.phone,
    row.country, JSON.stringify(row.services), row.message, row.terms,
    row.status || "new", ipHashValue || "", Date.now()
  ).run();
  return result;
}

async function updateEnquiry(env, id, row) {
  const existing = await env.DB.prepare("SELECT id FROM enquiries WHERE id = ?").bind(id).first();
  if (!existing) return null;
  await env.DB.prepare(
    "UPDATE enquiries SET locale = ?, first_name = ?, last_name = ?, company = ?, email = ?, phone = ?, country = ?, services = ?, message = ?, status = ? WHERE id = ?"
  ).bind(
    row.locale, row.firstName, row.lastName, row.company, row.email, row.phone,
    row.country, JSON.stringify(row.services), row.message, row.status, id
  ).run();
  return existing;
}

async function createAdminEnquiry(request, env) {
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false, error: parsed.error }, 400);
  const checked = validateEnquiry(parsed.value, await countries(request, env), { admin: true });
  if (!checked.ok) return json({ ok: false, error: "validation", fields: checked.fields }, 400);
  await insertEnquiry(env, checked.enquiry, "");
  return json({ ok: true }, 201);
}

async function putAdminEnquiry(request, env, id) {
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false, error: parsed.error }, 400);
  const checked = validateEnquiry(parsed.value, await countries(request, env), { admin: true });
  if (!checked.ok) return json({ ok: false, error: "validation", fields: checked.fields }, 400);
  const updated = await updateEnquiry(env, id, checked.enquiry);
  if (!updated) return json({ ok: false, error: "not-found" }, 404);
  return json({ ok: true });
}

async function postEnquiry(request, env) {
  if (!sameOrigin(request)) return json({ ok: false, error: "origin" }, 403);
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false, error: parsed.error }, 400);
  const checked = validateEnquiry(parsed.value, await countries(request, env));
  const jsonResponse = wantsJson(request);
  if (!checked.ok) {
    if (jsonResponse) return json({ ok: false, error: "validation", fields: checked.fields }, 400);
    return html(resultPage(false, backLink(request)), 400);
  }
  if (checked.drop) {
    if (jsonResponse) return json({ ok: true });
    return html(resultPage(true, backLink(request)));
  }
  const hash = await ipHash(request, env);
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM enquiries WHERE ip_hash = ? AND created_at > ?"
  ).bind(hash, Date.now() - RATE_WINDOW_MS).first();
  if (recent && recent.n >= RATE_LIMIT) {
    if (jsonResponse) return json({ ok: false, error: "rate" }, 429);
    return html(resultPage(false, backLink(request)), 429);
  }
  const row = checked.enquiry;
  row.status = "new";
  await insertEnquiry(env, row, hash);
  if (jsonResponse) return json({ ok: true }, 201);
  return html(resultPage(true, backLink(request)), 201);
}

async function postLogin(request, env) {
  if (!sameOrigin(request)) return json({ ok: false }, 403);
  await ensureAdmin(env);
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false }, 400);
  const username = String(parsed.value.username || "").trim();
  const password = String(parsed.value.password || "");
  const admin = await env.DB.prepare("SELECT id, password_hash FROM admins WHERE username = ?").bind(username).first();
  const stored = admin ? admin.password_hash : "pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  const match = admin ? await verifyPassword(password, stored) : false;
  if (!admin) await verifyPassword(password, stored);
  if (!match) {
    if (wantsJson(request)) return json({ ok: false }, 401);
    return html(loginPage("登入失敗"), 401);
  }
  await env.DB.prepare("UPDATE admins SET last_login_at = ? WHERE id = ?").bind(Date.now(), admin.id).run();
  const cookie = await startSession(request, env, admin.id);
  if (wantsJson(request)) return json({ ok: true }, 200, { "set-cookie": cookie });
  return new Response(null, { status: 303, headers: { location: "/admin", "set-cookie": cookie } });
}

async function postLogout(request, env) {
  if (!sameOrigin(request)) return json({ ok: false }, 403);
  const token = readCookie(request, "ng_session");
  if (token) {
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  }
  const cookie = sessionCookie("", request, 0);
  if (wantsJson(request)) return json({ ok: true }, 200, { "set-cookie": cookie });
  return new Response(null, { status: 303, headers: { location: "/admin/login", "set-cookie": cookie } });
}

async function requireAdmin(request, env) {
  const admin = await currentAdmin(request, env);
  if (!admin) return { error: json({ ok: false }, 401) };
  return { admin: admin };
}

function requireRole(admin, role) {
  if (admin.role !== role) return { error: json({ ok: false, error: "forbidden" }, 403) };
  return { ok: true };
}

async function countAdmins(env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM admins WHERE role = 'admin'").first();
  return row ? Number(row.n) : 0;
}

async function listEnquiries(env, status) {
  const sql = status
    ? "SELECT id, locale, first_name, last_name, company, email, phone, country, services, message, status, created_at FROM enquiries WHERE status = ? ORDER BY id DESC LIMIT 200"
    : "SELECT id, locale, first_name, last_name, company, email, phone, country, services, message, status, created_at FROM enquiries ORDER BY id DESC LIMIT 200";
  const statement = status ? env.DB.prepare(sql).bind(status) : env.DB.prepare(sql);
  const result = await statement.all();
  return (result.results || []).map(function (row) {
    let services = [];
    try { services = JSON.parse(row.services || "[]"); } catch (err) { services = []; }
    return {
      id: row.id,
      locale: row.locale,
      firstName: row.first_name,
      lastName: row.last_name,
      company: row.company,
      email: row.email,
      phone: row.phone,
      country: row.country,
      services: services,
      message: row.message,
      status: row.status,
      createdAt: row.created_at
    };
  });
}

async function publicContent(request, env, locale) {
  if (LOCALES.indexOf(locale) === -1) return json({ ok: false }, 400);
  const rows = await env.DB.prepare(
    "SELECT field_key, value FROM content_overrides WHERE locale = ?"
  ).bind(locale).all();
  const out = {};
  (rows.results || []).forEach(function (row) { out[row.field_key] = row.value; });
  return json(out, 200, { "cache-control": "no-store" });
}

async function adminContent(request, env, locale) {
  if (LOCALES.indexOf(locale) === -1) return json({ ok: false }, 400);
  const catalogData = await catalog(request, env);
  const defaults = await defaultsFor(request, env, locale);
  const rows = await env.DB.prepare(
    "SELECT field_key, value FROM content_overrides WHERE locale = ?"
  ).bind(locale).all();
  const custom = {};
  (rows.results || []).forEach(function (row) { custom[row.field_key] = row.value; });
  return json({
    locale: locale,
    groups: catalogData.groups.map(function (group) {
      return {
        id: group.id,
        label: group.label,
        fields: group.fields.map(function (field) {
          const hasCustom = Object.prototype.hasOwnProperty.call(custom, field.key);
          return {
            key: field.key,
            label: field.label,
            value: hasCustom ? custom[field.key] : (defaults[field.key] || ""),
            base: defaults[field.key] || "",
            custom: hasCustom
          };
        })
      };
    })
  });
}

async function saveContent(request, env) {
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false }, 400);
  const locale = parsed.value.locale;
  const fields = parsed.value.fields;
  if (LOCALES.indexOf(locale) === -1 || !fields || typeof fields !== "object") return json({ ok: false }, 400);
  const catalogData = await catalog(request, env);
  const keys = allowedKeys(catalogData);
  const defaults = await defaultsFor(request, env, locale);
  const statements = [];
  const names = Object.keys(fields);
  for (let i = 0; i < names.length; i += 1) {
    const key = names[i];
    if (!keys.has(key)) return json({ ok: false, error: "field" }, 400);
    const value = cleanText(fields[key], 4000);
    if (value.length > 4000) return json({ ok: false, error: "length" }, 400);
    if (!value || value === (defaults[key] || "")) {
      statements.push(env.DB.prepare("DELETE FROM content_overrides WHERE locale = ? AND field_key = ?").bind(locale, key));
    } else {
      statements.push(env.DB.prepare(
        "INSERT INTO content_overrides (locale, field_key, value, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(locale, field_key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
      ).bind(locale, key, value, Date.now()));
    }
  }
  if (statements.length) await env.DB.batch(statements);
  return json({ ok: true });
}

async function listUsers(env) {
  const result = await env.DB.prepare(
    "SELECT id, username, role, display_name, avatar_key, last_login_at, created_at FROM admins ORDER BY id ASC"
  ).all();
  return (result.results || []).map(mapUser);
}

async function createUser(request, env) {
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false }, 400);
  const username = cleanText(parsed.value.username, 64);
  const displayName = cleanText(parsed.value.displayName, 80);
  const password = String(parsed.value.password || "");
  const role = String(parsed.value.role || "editor");
  if (!username || username.length < 2) return json({ ok: false, error: "username" }, 400);
  if (password.length < 8) return json({ ok: false, error: "password" }, 400);
  if (!ROLES.has(role)) return json({ ok: false, error: "role" }, 400);
  const existing = await env.DB.prepare("SELECT id FROM admins WHERE username = ?").bind(username).first();
  if (existing) return json({ ok: false, error: "exists" }, 409);
  const passwordHash = await hashPassword(password);
  const result = await env.DB.prepare(
    "INSERT INTO admins (username, password_hash, role, display_name, created_at) VALUES (?, ?, ?, ?, ?)"
  ).bind(username, passwordHash, role, displayName, Date.now()).run();
  const id = result.meta && result.meta.last_row_id;
  return json({
    ok: true,
    user: mapUser({
      id: id,
      username: username,
      role: role,
      display_name: displayName,
      avatar_key: "",
      last_login_at: null,
      created_at: Date.now()
    })
  }, 201);
}

async function updateUser(request, env, admin, userId) {
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false }, 400);
  const target = await env.DB.prepare(
    "SELECT id, username, role, display_name, avatar_key, last_login_at, created_at FROM admins WHERE id = ?"
  ).bind(userId).first();
  if (!target) return json({ ok: false }, 404);

  const nextUsername = parsed.value.username != null ? cleanText(parsed.value.username, 64) : target.username;
  const nextRole = parsed.value.role != null ? String(parsed.value.role) : target.role;
  const nextDisplayName = parsed.value.displayName != null
    ? cleanText(parsed.value.displayName, 80)
    : (target.display_name || "");
  const password = parsed.value.password != null ? String(parsed.value.password) : "";
  let nextAvatarKey = target.avatar_key || "";
  if (parsed.value.avatarKey != null) {
    nextAvatarKey = cleanText(parsed.value.avatarKey, 120);
  }
  if (parsed.value.clearAvatar) nextAvatarKey = "";

  if (!nextUsername || nextUsername.length < 2) return json({ ok: false, error: "username" }, 400);
  if (!ROLES.has(nextRole)) return json({ ok: false, error: "role" }, 400);
  if (password && password.length < 8) return json({ ok: false, error: "password" }, 400);

  if (target.role === "admin" && nextRole !== "admin") {
    const admins = await countAdmins(env);
    if (admins <= 1) return json({ ok: false, error: "last-admin" }, 400);
  }

  const clash = await env.DB.prepare(
    "SELECT id FROM admins WHERE username = ? AND id != ?"
  ).bind(nextUsername, userId).first();
  if (clash) return json({ ok: false, error: "exists" }, 409);

  if (password) {
    const passwordHash = await hashPassword(password);
    await env.DB.prepare(
      "UPDATE admins SET username = ?, role = ?, display_name = ?, avatar_key = ?, password_hash = ? WHERE id = ?"
    ).bind(nextUsername, nextRole, nextDisplayName, nextAvatarKey, passwordHash, userId).run();
  } else {
    await env.DB.prepare(
      "UPDATE admins SET username = ?, role = ?, display_name = ?, avatar_key = ? WHERE id = ?"
    ).bind(nextUsername, nextRole, nextDisplayName, nextAvatarKey, userId).run();
  }
  return json({
    ok: true,
    user: mapUser({
      id: userId,
      username: nextUsername,
      role: nextRole,
      display_name: nextDisplayName,
      avatar_key: nextAvatarKey,
      last_login_at: target.last_login_at,
      created_at: target.created_at
    })
  });
}

async function updateMe(request, env, admin) {
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false }, 400);
  const target = await env.DB.prepare(
    "SELECT id, username, role, display_name, avatar_key, last_login_at, created_at FROM admins WHERE id = ?"
  ).bind(admin.id).first();
  if (!target) return json({ ok: false }, 404);

  const nextDisplayName = parsed.value.displayName != null
    ? cleanText(parsed.value.displayName, 80)
    : (target.display_name || "");
  const password = parsed.value.password != null ? String(parsed.value.password) : "";
  let nextAvatarKey = target.avatar_key || "";
  if (parsed.value.avatarKey != null) {
    nextAvatarKey = cleanText(parsed.value.avatarKey, 120);
  }
  if (parsed.value.clearAvatar) nextAvatarKey = "";

  if (password && password.length < 8) return json({ ok: false, error: "password" }, 400);

  if (password) {
    const passwordHash = await hashPassword(password);
    await env.DB.prepare(
      "UPDATE admins SET display_name = ?, avatar_key = ?, password_hash = ? WHERE id = ?"
    ).bind(nextDisplayName, nextAvatarKey, passwordHash, admin.id).run();
  } else {
    await env.DB.prepare(
      "UPDATE admins SET display_name = ?, avatar_key = ? WHERE id = ?"
    ).bind(nextDisplayName, nextAvatarKey, admin.id).run();
  }

  return json({
    ok: true,
    user: mapUser({
      id: target.id,
      username: target.username,
      role: target.role,
      display_name: nextDisplayName,
      avatar_key: nextAvatarKey,
      last_login_at: target.last_login_at,
      created_at: target.created_at
    })
  });
}

async function storeUploadedImage(env, admin, file) {
  if (!env.MEDIA) return { error: json({ ok: false, error: "media" }, 503) };
  if (!file || typeof file === "string" || !file.size) return { error: json({ ok: false, error: "file" }, 400) };
  if (file.size > MEDIA_MAX_BYTES) return { error: json({ ok: false, error: "size" }, 400) };
  const contentType = String(file.type || "");
  const ext = MEDIA_TYPES[contentType];
  if (!ext) return { error: json({ ok: false, error: "type" }, 400) };
  const key = bytesToB64(crypto.getRandomValues(new Uint8Array(16))) + "." + ext;
  const filename = cleanText(file.name || ("upload." + ext), 180) || ("upload." + ext);
  await env.MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: contentType }
  });
  const result = await env.DB.prepare(
    "INSERT INTO media_assets (key, filename, content_type, size, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(key, filename, contentType, file.size, admin.id, Date.now()).run();
  return {
    media: {
      id: result.meta && result.meta.last_row_id,
      key: key,
      filename: filename,
      contentType: contentType,
      size: file.size,
      url: "/media/" + encodeURIComponent(key),
      uploadedBy: admin.id,
      createdAt: Date.now()
    }
  };
}

async function uploadAvatar(request, env, admin) {
  if (!env.MEDIA) return json({ ok: false, error: "media" }, 503);
  const type = request.headers.get("content-type") || "";
  if (!type.includes("multipart/form-data")) return json({ ok: false, error: "form" }, 400);
  const form = await request.formData();
  const file = form.get("file");
  const requestedId = form.get("userId");
  let targetId = admin.id;
  if (requestedId != null && String(requestedId) !== "") {
    targetId = Number(requestedId);
    if (!Number.isFinite(targetId)) return json({ ok: false, error: "user" }, 400);
    if (targetId !== Number(admin.id) && admin.role !== "admin") {
      return json({ ok: false, error: "forbidden" }, 403);
    }
  }
  const target = await env.DB.prepare(
    "SELECT id, username, role, display_name, avatar_key, last_login_at, created_at FROM admins WHERE id = ?"
  ).bind(targetId).first();
  if (!target) return json({ ok: false }, 404);

  const stored = await storeUploadedImage(env, admin, file);
  if (stored.error) return stored.error;

  await env.DB.prepare("UPDATE admins SET avatar_key = ? WHERE id = ?")
    .bind(stored.media.key, targetId).run();

  return json({
    ok: true,
    media: stored.media,
    user: mapUser({
      id: target.id,
      username: target.username,
      role: target.role,
      display_name: target.display_name,
      avatar_key: stored.media.key,
      last_login_at: target.last_login_at,
      created_at: target.created_at
    })
  }, 201);
}

async function deleteUser(env, admin, userId) {
  if (Number(userId) === Number(admin.id)) return json({ ok: false, error: "self" }, 400);
  const target = await env.DB.prepare("SELECT id, role FROM admins WHERE id = ?").bind(userId).first();
  if (!target) return json({ ok: false }, 404);
  if (target.role === "admin") {
    const admins = await countAdmins(env);
    if (admins <= 1) return json({ ok: false, error: "last-admin" }, 400);
  }
  await env.DB.prepare("DELETE FROM sessions WHERE admin_id = ?").bind(userId).run();
  await env.DB.prepare("DELETE FROM admins WHERE id = ?").bind(userId).run();
  return json({ ok: true });
}

function mapMedia(row) {
  return {
    id: row.id,
    key: row.key,
    filename: row.filename,
    contentType: row.content_type,
    size: row.size,
    url: "/media/" + encodeURIComponent(row.key),
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at
  };
}

async function listMedia(env) {
  const result = await env.DB.prepare(
    "SELECT id, key, filename, content_type, size, uploaded_by, created_at FROM media_assets ORDER BY id DESC LIMIT 200"
  ).all();
  return (result.results || []).map(mapMedia);
}

async function uploadMedia(request, env, admin) {
  const type = request.headers.get("content-type") || "";
  if (!type.includes("multipart/form-data")) return json({ ok: false, error: "form" }, 400);
  const form = await request.formData();
  const stored = await storeUploadedImage(env, admin, form.get("file"));
  if (stored.error) return stored.error;
  return json({ ok: true, media: stored.media }, 201);
}

async function deleteMedia(env, mediaId) {
  if (!env.MEDIA) return json({ ok: false, error: "media" }, 503);
  const row = await env.DB.prepare("SELECT id, key FROM media_assets WHERE id = ?").bind(mediaId).first();
  if (!row) return json({ ok: false }, 404);
  await env.MEDIA.delete(row.key);
  await env.DB.prepare("DELETE FROM media_assets WHERE id = ?").bind(mediaId).run();
  return json({ ok: true });
}

async function serveMedia(env, key) {
  if (!env.MEDIA) return json({ ok: false, error: "media" }, 503);
  const safeKey = decodeURIComponent(key || "");
  if (!/^[A-Za-z0-9_-]+\.(jpg|png|webp|gif)$/.test(safeKey)) return json({ ok: false }, 404);
  const object = await env.MEDIA.get(safeKey);
  if (!object) return json({ ok: false }, 404);
  const headers = new Headers();
  headers.set("content-type", object.httpMetadata && object.httpMetadata.contentType || "application/octet-stream");
  headers.set("cache-control", "public, max-age=86400");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { status: 200, headers: headers });
}

function mapPage(row) {
  return {
    id: row.id,
    locale: row.locale,
    slug: row.slug,
    title: row.title,
    body: row.body,
    coverKey: row.cover_key || "",
    status: row.status,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    path: publicPagePath(row.locale, row.slug)
  };
}

async function listPages(env) {
  const result = await env.DB.prepare(
    "SELECT id, locale, slug, title, body, cover_key, status, updated_at, created_by FROM cms_pages ORDER BY updated_at DESC LIMIT 200"
  ).all();
  return (result.results || []).map(mapPage);
}

async function getPage(env, pageId) {
  const row = await env.DB.prepare(
    "SELECT id, locale, slug, title, body, cover_key, status, updated_at, created_by FROM cms_pages WHERE id = ?"
  ).bind(pageId).first();
  return row ? mapPage(row) : null;
}

async function createPage(request, env, admin) {
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false }, 400);
  const locale = String(parsed.value.locale || "");
  const slug = normalizeSlug(parsed.value.slug);
  const title = cleanText(parsed.value.title, 200);
  const body = cleanText(parsed.value.body, 8000);
  const coverKey = cleanText(parsed.value.coverKey || "", 120);
  const status = String(parsed.value.status || "draft");
  if (LOCALES.indexOf(locale) === -1) return json({ ok: false, error: "locale" }, 400);
  if (!slug) return json({ ok: false, error: "slug" }, 400);
  if (!title) return json({ ok: false, error: "title" }, 400);
  if (!PAGE_STATUSES.has(status)) return json({ ok: false, error: "status" }, 400);
  if (coverKey) {
    const media = await env.DB.prepare("SELECT id FROM media_assets WHERE key = ?").bind(coverKey).first();
    if (!media) return json({ ok: false, error: "cover" }, 400);
  }
  try {
    const result = await env.DB.prepare(
      "INSERT INTO cms_pages (locale, slug, title, body, cover_key, status, updated_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(locale, slug, title, body, coverKey, status, Date.now(), admin.id).run();
    const page = await getPage(env, result.meta && result.meta.last_row_id);
    return json({ ok: true, page: page }, 201);
  } catch (err) {
    return json({ ok: false, error: "exists" }, 409);
  }
}

async function updatePage(request, env, pageId) {
  const parsed = await readBody(request);
  if (parsed.error) return json({ ok: false }, 400);
  const existing = await getPage(env, pageId);
  if (!existing) return json({ ok: false }, 404);
  const locale = parsed.value.locale != null ? String(parsed.value.locale) : existing.locale;
  const slug = parsed.value.slug != null ? normalizeSlug(parsed.value.slug) : existing.slug;
  const title = parsed.value.title != null ? cleanText(parsed.value.title, 200) : existing.title;
  const body = parsed.value.body != null ? cleanText(parsed.value.body, 8000) : existing.body;
  const coverKey = parsed.value.coverKey != null ? cleanText(parsed.value.coverKey, 120) : existing.coverKey;
  const status = parsed.value.status != null ? String(parsed.value.status) : existing.status;
  if (LOCALES.indexOf(locale) === -1) return json({ ok: false, error: "locale" }, 400);
  if (!slug) return json({ ok: false, error: "slug" }, 400);
  if (!title) return json({ ok: false, error: "title" }, 400);
  if (!PAGE_STATUSES.has(status)) return json({ ok: false, error: "status" }, 400);
  if (coverKey) {
    const media = await env.DB.prepare("SELECT id FROM media_assets WHERE key = ?").bind(coverKey).first();
    if (!media) return json({ ok: false, error: "cover" }, 400);
  }
  try {
    await env.DB.prepare(
      "UPDATE cms_pages SET locale = ?, slug = ?, title = ?, body = ?, cover_key = ?, status = ?, updated_at = ? WHERE id = ?"
    ).bind(locale, slug, title, body, coverKey, status, Date.now(), pageId).run();
  } catch (err) {
    return json({ ok: false, error: "exists" }, 409);
  }
  return json({ ok: true, page: await getPage(env, pageId) });
}

async function deletePage(env, pageId) {
  const existing = await getPage(env, pageId);
  if (!existing) return json({ ok: false }, 404);
  await env.DB.prepare("DELETE FROM cms_pages WHERE id = ?").bind(pageId).run();
  return json({ ok: true });
}

function renderPublicPage(page) {
  const lang = LOCALE_HTML[page.locale] || "en";
  const home = LOCALE_PREFIX[page.locale] || "/";
  const cover = page.coverKey
    ? "<p class=\"cover\"><img src=\"/media/" + esc(page.coverKey) + "\" alt=\"\"></p>"
    : "";
  const paragraphs = String(page.body || "").split(/\n+/).filter(Boolean).map(function (line) {
    return "<p>" + esc(line) + "</p>";
  }).join("");
  return "<!DOCTYPE html><html lang=\"" + esc(lang) + "\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta name=\"robots\" content=\"noindex\"><title>" +
    esc(page.title) + "｜Northgo</title><style>" +
    ":root{--navy:#0a1b33;--cyan:#6ed4d0;--bg:#f3f6fa;--ink:#0a1b33;--muted:#3e5168}" +
    "body{margin:0;font-family:Segoe UI,PingFang TC,Microsoft JhengHei,sans-serif;background:var(--bg);color:var(--ink);line-height:1.6}" +
    "header{background:var(--navy);color:#fff;padding:1rem 1.25rem}header a{color:#fff;text-decoration:none;font-weight:700}" +
    "header span{color:var(--cyan)}main{width:min(760px,calc(100% - 2rem));margin:1.5rem auto 2.5rem}" +
    "h1{font-size:clamp(1.6rem,3vw,2.2rem);margin:0 0 .75rem}.cover img{display:block;width:100%;max-height:360px;object-fit:cover;border-radius:14px}" +
    "p{color:var(--muted)}</style></head><body><header><a href=\"" + esc(home || "/") + "\">North<span>go</span></a></header><main><h1>" +
    esc(page.title) + "</h1>" + cover + paragraphs + "</main></body></html>";
}

async function publicCmsPage(env, locale, slug) {
  const row = await env.DB.prepare(
    "SELECT id, locale, slug, title, body, cover_key, status, updated_at, created_by FROM cms_pages WHERE locale = ? AND slug = ? AND status = 'published'"
  ).bind(locale, slug).first();
  if (!row) return html("<!DOCTYPE html><html lang=\"zh-Hant\"><head><meta charset=\"utf-8\"><title>找不到頁面</title></head><body><h1>找不到頁面</h1></body></html>", 404);
  return html(renderPublicPage(mapPage(row)));
}

function loginPage(message) {
  const note = message ? "<p class=\"bad\" role=\"alert\">" + esc(message) + "</p>" : "";
  return "<!DOCTYPE html><html lang=\"zh-Hant\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta name=\"robots\" content=\"noindex\"><title>登入｜Northgo</title><link rel=\"stylesheet\" href=\"/assets/admin.css\"></head><body class=\"login-body\"><main class=\"login-card\"><p class=\"brand\">North<span>go</span></p><h1>後台登入</h1><p class=\"muted\">管理文案、媒體、動態頁面、詢問與帳號。</p>" +
    note + "<form id=\"login-form\" method=\"post\" action=\"/api/login\"><label>帳號<input name=\"username\" autocomplete=\"username\" required></label><label>密碼<input name=\"password\" type=\"password\" autocomplete=\"current-password\" required></label><button class=\"button\" type=\"submit\">登入</button><p class=\"form-status\" role=\"status\"></p></form></main><script src=\"/assets/login.js\" defer></script></body></html>";
}

function adminPage() {
  return "<!DOCTYPE html><html lang=\"zh-Hant\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta name=\"robots\" content=\"noindex\"><title>後台｜Northgo</title><link rel=\"stylesheet\" href=\"/assets/admin.css\"></head><body>" +
    "<header class=\"admin-bar\"><a class=\"brand\" href=\"/\">North<span>go</span></a><strong>後台管理</strong>" +
    "<div id=\"whoami\" class=\"whoami\" aria-live=\"polite\"></div>" +
    "<button type=\"button\" id=\"profile-edit\" class=\"ghost\">我的帳號</button>" +
    "<button type=\"button\" id=\"logout\" class=\"ghost\">登出</button></header>" +
    "<main class=\"admin-main\"><div class=\"tabs\" role=\"tablist\">" +
    "<button type=\"button\" class=\"tab on\" data-tab=\"enquiries\">客戶詢問</button>" +
    "<button type=\"button\" class=\"tab\" data-tab=\"content\">網站內容</button>" +
    "<button type=\"button\" class=\"tab\" data-tab=\"media\">媒體</button>" +
    "<button type=\"button\" class=\"tab\" data-tab=\"pages\">動態頁面</button>" +
    "<button type=\"button\" class=\"tab\" data-tab=\"users\" data-admin-only hidden>使用者</button>" +
    "</div>" +
    "<section id=\"enquiries\" class=\"panel on\"><div class=\"toolbar\">" +
    "<label>搜尋<input id=\"enquiry-search\" type=\"search\" placeholder=\"姓名、公司、Email\"></label>" +
    "<label>狀態<select id=\"status-filter\"><option value=\"\">全部</option><option value=\"new\" selected>新進</option><option value=\"read\">已讀</option><option value=\"archived\">已封存</option></select></label>" +
    "<label>每頁<select id=\"enquiry-page-size\"><option value=\"10\">10</option><option value=\"20\" selected>20</option><option value=\"50\">50</option><option value=\"100\">100</option></select></label>" +
    "<div class=\"toolbar-actions\">" +
    "<div class=\"col-settings\" id=\"enquiry-col-settings\">" +
    "<button type=\"button\" id=\"enquiry-columns\" class=\"ghost\" aria-expanded=\"false\" aria-controls=\"enquiry-col-panel\">設定</button>" +
    "<div id=\"enquiry-col-panel\" class=\"col-settings-panel\" hidden></div>" +
    "</div>" +
    "<button type=\"button\" id=\"enquiry-reload\" class=\"ghost\">重新載入</button>" +
    "<button type=\"button\" id=\"enquiry-create\" class=\"button\">新增詢問</button>" +
    "</div>" +
    "</div><div id=\"enquiry-list\"></div><div id=\"enquiry-pager\" class=\"pager\"></div></section>" +
    "<section id=\"content\" class=\"panel\"><div class=\"toolbar\">" +
    "<label>語系<select id=\"locale\"><option value=\"zh-tw\">繁體中文</option><option value=\"en\">English</option><option value=\"ja\">日本語</option><option value=\"vi\">Tiếng Việt</option></select></label>" +
    "<label>頁面<select id=\"page\"></select></label>" +
    "<label>搜尋欄位<input id=\"content-search\" type=\"search\" placeholder=\"標籤或欄位 key\"></label>" +
    "<button type=\"button\" id=\"preview-content\" class=\"ghost\">前台預覽</button>" +
    "<button type=\"button\" id=\"save-content\" class=\"button\">儲存文案</button>" +
    "</div><div id=\"fields\"></div><p id=\"content-status\" class=\"form-status\" role=\"status\"></p></section>" +
    "<section id=\"media\" class=\"panel\"><div class=\"toolbar\">" +
    "<label class=\"file-label\">上傳圖片<input id=\"media-file\" type=\"file\" accept=\"image/jpeg,image/png,image/webp,image/gif\"></label>" +
    "<button type=\"button\" id=\"media-upload\" class=\"button\">開始上傳</button>" +
    "<p id=\"media-status\" class=\"form-status\" role=\"status\"></p></div><div id=\"media-list\" class=\"media-grid\"></div></section>" +
    "<section id=\"pages\" class=\"panel\"><div class=\"toolbar\">" +
    "<label>搜尋<input id=\"page-search\" type=\"search\" placeholder=\"標題或 slug\"></label>" +
    "<label>狀態<select id=\"page-status-filter\"><option value=\"\">全部</option><option value=\"draft\">草稿</option><option value=\"published\">已發布</option></select></label>" +
    "<button type=\"button\" id=\"page-create\" class=\"button\">新增頁面</button>" +
    "</div><div id=\"page-list\"></div></section>" +
    "<section id=\"users\" class=\"panel\" data-admin-only hidden>" +
    "<div class=\"users-hero\">" +
    "<div><h1>團隊帳號</h1><p class=\"muted\">多人共同管理後台。管理者可新增、編輯、刪除帳號與角色。</p></div>" +
    "<div class=\"users-hero-art\" aria-hidden=\"true\">" +
    "<svg viewBox=\"0 0 120 72\" width=\"120\" height=\"72\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
    "<rect x=\"8\" y=\"18\" width=\"40\" height=\"40\" rx=\"20\" fill=\"#6ed4d0\"/>" +
    "<rect x=\"40\" y=\"18\" width=\"40\" height=\"40\" rx=\"20\" fill=\"#0a1b33\"/>" +
    "<rect x=\"72\" y=\"18\" width=\"40\" height=\"40\" rx=\"20\" fill=\"#9ec5d8\"/>" +
    "<circle cx=\"28\" cy=\"34\" r=\"7\" fill=\"#0a1b33\" opacity=\".35\"/>" +
    "<circle cx=\"60\" cy=\"34\" r=\"7\" fill=\"#6ed4d0\" opacity=\".85\"/>" +
    "<circle cx=\"92\" cy=\"34\" r=\"7\" fill=\"#0a1b33\" opacity=\".35\"/>" +
    "</svg></div></div>" +
    "<div class=\"toolbar\">" +
    "<label>搜尋<input id=\"user-search\" type=\"search\" placeholder=\"帳號或顯示名稱\"></label>" +
    "<div class=\"toolbar-actions\">" +
    "<button type=\"button\" id=\"user-create\" class=\"button\">新增使用者</button>" +
    "</div></div><div id=\"user-list\"></div></section>" +
    "</main>" +
    "<div id=\"modal\" class=\"modal\" hidden><div class=\"modal-card\" role=\"dialog\" aria-modal=\"true\"><div class=\"modal-head\"><h2 id=\"modal-title\">編輯</h2><button type=\"button\" id=\"modal-close\" class=\"ghost\">關閉</button></div><div id=\"modal-body\"></div><div class=\"modal-actions\"><button type=\"button\" id=\"modal-cancel\" class=\"ghost\">取消</button><button type=\"button\" id=\"modal-save\" class=\"button\">儲存</button></div><p id=\"modal-status\" class=\"form-status\" role=\"status\"></p></div></div>" +
    "<script src=\"/assets/admin.js\" defer></script></body></html>";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (!env.DB) return json({ ok: false, error: "database" }, 503);
      if (request.method === "POST" && path === "/api/enquiries") return postEnquiry(request, env);
      if (request.method === "GET" && path === "/api/content") return publicContent(request, env, url.searchParams.get("locale") || "");
      if (request.method === "POST" && path === "/api/login") return postLogin(request, env);
      if (request.method === "POST" && path === "/api/logout") return postLogout(request, env);

      if (request.method === "GET" && path.startsWith("/media/")) {
        return serveMedia(env, path.slice("/media/".length));
      }

      const publicPage = parsePublicPagePath(path);
      if (request.method === "GET" && publicPage) {
        return publicCmsPage(env, publicPage.locale, publicPage.slug);
      }

      if (path === "/admin/login" && request.method === "GET") {
        const admin = await currentAdmin(request, env);
        if (admin) return Response.redirect(new URL("/admin", request.url), 303);
        return html(loginPage(""));
      }
      if (path === "/admin" && request.method === "GET") {
        const admin = await currentAdmin(request, env);
        if (!admin) return Response.redirect(new URL("/admin/login", request.url), 303);
        return html(adminPage());
      }

      if (path.startsWith("/api/admin/")) {
        if (!sameOrigin(request) && request.method !== "GET") return json({ ok: false }, 403);
        const auth = await requireAdmin(request, env);
        if (auth.error) return auth.error;
        const admin = auth.admin;

        if (request.method === "GET" && path === "/api/admin/me") {
          return json(mapUser(admin));
        }
        if (request.method === "PATCH" && path === "/api/admin/me") {
          return updateMe(request, env, admin);
        }
        if (request.method === "POST" && path === "/api/admin/avatar") {
          return uploadAvatar(request, env, admin);
        }

        if (request.method === "GET" && path === "/api/admin/enquiries") {
          const status = url.searchParams.get("status") || "";
          if (status && !STATUSES.has(status)) return json({ ok: false }, 400);
          return json({ enquiries: await listEnquiries(env, status) });
        }
        if (request.method === "POST" && path === "/api/admin/enquiries") {
          return createAdminEnquiry(request, env);
        }
        const enquiryMatch = path.match(/^\/api\/admin\/enquiries\/(\d+)$/);
        if (enquiryMatch && request.method === "PUT") {
          return putAdminEnquiry(request, env, Number(enquiryMatch[1]));
        }
        if (enquiryMatch && request.method === "PATCH") {
          const parsed = await readBody(request);
          const status = parsed.value && parsed.value.status;
          if (!STATUSES.has(status)) return json({ ok: false }, 400);
          const existing = await env.DB.prepare("SELECT id FROM enquiries WHERE id = ?").bind(Number(enquiryMatch[1])).first();
          if (!existing) return json({ ok: false, error: "not-found" }, 404);
          await env.DB.prepare("UPDATE enquiries SET status = ? WHERE id = ?").bind(status, Number(enquiryMatch[1])).run();
          return json({ ok: true });
        }
        if (enquiryMatch && request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM enquiries WHERE id = ?").bind(Number(enquiryMatch[1])).run();
          return json({ ok: true });
        }

        if (request.method === "GET" && path === "/api/admin/content") {
          return adminContent(request, env, url.searchParams.get("locale") || "zh-tw");
        }
        if (request.method === "PUT" && path === "/api/admin/content") return saveContent(request, env);

        if (request.method === "GET" && path === "/api/admin/media") {
          return json({ media: await listMedia(env) });
        }
        if (request.method === "POST" && path === "/api/admin/media") {
          return uploadMedia(request, env, admin);
        }
        const mediaMatch = path.match(/^\/api\/admin\/media\/(\d+)$/);
        if (mediaMatch && request.method === "DELETE") {
          return deleteMedia(env, Number(mediaMatch[1]));
        }

        if (request.method === "GET" && path === "/api/admin/pages") {
          return json({ pages: await listPages(env) });
        }
        if (request.method === "POST" && path === "/api/admin/pages") {
          return createPage(request, env, admin);
        }
        const pageMatch = path.match(/^\/api\/admin\/pages\/(\d+)$/);
        if (pageMatch && request.method === "GET") {
          const page = await getPage(env, Number(pageMatch[1]));
          if (!page) return json({ ok: false }, 404);
          return json({ page: page });
        }
        if (pageMatch && request.method === "PUT") {
          return updatePage(request, env, Number(pageMatch[1]));
        }
        if (pageMatch && request.method === "DELETE") {
          return deletePage(env, Number(pageMatch[1]));
        }

        if (path.startsWith("/api/admin/users")) {
          const roleGate = requireRole(admin, "admin");
          if (roleGate.error) return roleGate.error;
          if (request.method === "GET" && path === "/api/admin/users") {
            return json({ users: await listUsers(env) });
          }
          if (request.method === "POST" && path === "/api/admin/users") {
            return createUser(request, env);
          }
          const userMatch = path.match(/^\/api\/admin\/users\/(\d+)$/);
          if (userMatch && request.method === "PATCH") {
            return updateUser(request, env, admin, Number(userMatch[1]));
          }
          if (userMatch && request.method === "DELETE") {
            return deleteUser(env, admin, Number(userMatch[1]));
          }
        }

        return json({ ok: false }, 404);
      }

      return env.ASSETS.fetch(request);
    } catch (err) {
      return json({ ok: false, error: "server" }, 500);
    }
  }
};
