const PBKDF2_ITERATIONS = 100000;

function bytesToB64(bytes) {
  let text = "";
  for (let i = 0; i < bytes.length; i += 1) text += String.fromCharCode(bytes[i]);
  return btoa(text);
}

function b64ToBytes(text) {
  const raw = atob(text);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(function (byte) {
    return byte.toString(16).padStart(2, "0");
  }).join("");
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await derive(password, salt, PBKDF2_ITERATIONS);
  return "pbkdf2$" + PBKDF2_ITERATIONS + "$" + bytesToB64(salt) + "$" + bytesToB64(new Uint8Array(bits));
}

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-256" },
    key,
    256
  );
}

export async function verifyPassword(password, stored) {
  try {
    const parts = String(stored || "").split("$");
    if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
    const iterations = Number(parts[1]);
    if (!iterations || iterations < 10000) return false;
    const salt = b64ToBytes(parts[2]);
    const expected = b64ToBytes(parts[3]);
    const actual = new Uint8Array(await derive(password, salt, iterations));
    if (actual.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < actual.length; i += 1) diff |= actual[i] ^ expected[i];
    return diff === 0;
  } catch (err) {
    return false;
  }
}

export function sessionCookie(token, request, maxAge) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  const age = maxAge === 0 ? "Max-Age=0" : "Max-Age=" + maxAge;
  return "ng_session=" + token + "; HttpOnly; Path=/; SameSite=Lax; " + age + secure;
}

export function readCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  const parts = header.split(";");
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i].trim();
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) === name) return decodeURIComponent(part.slice(eq + 1));
  }
  return "";
}
