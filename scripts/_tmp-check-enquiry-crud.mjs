import { readFileSync } from "node:fs";

const vars = Object.fromEntries(
  readFileSync(".dev.vars", "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map(function (line) {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    })
);

const base = process.argv[2] || "http://127.0.0.1:8788";

async function req(path, opts) {
  opts = opts || {};
  const headers = Object.assign(
    { accept: "application/json", origin: base },
    opts.headers || {}
  );
  if (opts.cookie) headers.cookie = opts.cookie;
  const res = await fetch(base + path, Object.assign({}, opts, { headers: headers }));
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    data = text;
  }
  return {
    status: res.status,
    data: data,
    setCookie: typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : []
  };
}

const publicRes = await req("/api/enquiries", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    first_name: "Test",
    last_name: "User",
    company: "Demo Co",
    email: "public.crud@example.com",
    phone: "0911222333",
    country: "Taiwan",
    services: ["freight"],
    message: "CRUD verify public",
    terms: true,
    locale: "zh-tw"
  })
});
console.log("public create", publicRes.status, publicRes.data);

const login = await req("/api/login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    username: vars.ADMIN_USERNAME,
    password: vars.ADMIN_PASSWORD
  })
});
const cookie = (login.setCookie.find(function (c) {
  return c.startsWith("ng_session=");
}) || "").split(";")[0];
console.log("login", login.status, !!cookie);
if (!cookie) process.exit(1);

const create = await req("/api/admin/enquiries", {
  method: "POST",
  cookie: cookie,
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    firstName: "Admin",
    lastName: "Made",
    company: "Northgo",
    email: "admin.made@example.com",
    phone: "0987654321",
    country: "Japan",
    services: ["project", "other"],
    message: "from admin",
    locale: "zh-tw",
    status: "new"
  })
});
console.log("admin create", create.status, create.data);
if (create.status !== 201) process.exit(1);

const list = await req("/api/admin/enquiries?status=new", { cookie: cookie });
const rows = list.data.enquiries || [];
const adminRow = rows.find(function (r) { return r.email === "admin.made@example.com"; });
const publicRow = rows.find(function (r) { return r.email === "public.crud@example.com"; });
console.log("found admin", !!adminRow, "found public", !!publicRow);
if (!adminRow || !publicRow) process.exit(1);

const put = await req("/api/admin/enquiries/" + adminRow.id, {
  method: "PUT",
  cookie: cookie,
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    firstName: "Admin",
    lastName: "Made",
    company: "Northgo",
    email: adminRow.email,
    phone: "0987654321",
    country: "Japan",
    services: ["project"],
    message: "from admin [edited]",
    locale: "zh-tw",
    status: "read"
  })
});
console.log("admin put", put.status, put.data);
if (put.status !== 200) process.exit(1);

const listRead = await req("/api/admin/enquiries?status=read", { cookie: cookie });
const after = (listRead.data.enquiries || []).find(function (r) { return r.id === adminRow.id; });
console.log("after edit", after && after.status, after && after.message);
if (!after || after.status !== "read" || after.message !== "from admin [edited]") process.exit(1);

const del = await req("/api/admin/enquiries/" + adminRow.id, {
  method: "DELETE",
  cookie: cookie
});
console.log("admin delete", del.status, del.data);

const adminHtml = await fetch(base + "/admin", { headers: { cookie: cookie } });
const html = await adminHtml.text();
console.log("has enquiry-create", html.includes('id="enquiry-create"'));

const js = await (await fetch(base + "/assets/admin.js")).text();
console.log("has enquiry-create mode", js.includes("enquiry-create"), "has enquiryPayload", js.includes("enquiryPayload"));

if (!html.includes('id="enquiry-create"') || !js.includes("enquiryPayload")) process.exit(1);
console.log("ok");
