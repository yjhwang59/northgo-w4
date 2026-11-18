const LOCALES = new Set(["en", "zh-tw", "ja", "vi"]);
const SERVICE_IDS = new Set(["freight", "project", "warehouse", "agency", "other"]);
const STATUSES = new Set(["new", "read", "archived"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max) {
  const text = String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (text.length > max) return null;
  return text;
}

function pick(body, snake, camel) {
  if (body[snake] != null && body[snake] !== "") return body[snake];
  if (body[camel] != null) return body[camel];
  return body[snake];
}

export function validateEnquiry(body, countries, options) {
  const opts = options || {};
  const admin = !!opts.admin;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, fields: ["form"] };
  }
  if (!admin && clean(body.company_website, 200)) return { ok: true, drop: true };

  const fields = [];
  const firstName = clean(pick(body, "first_name", "firstName"), 80);
  const lastName = clean(pick(body, "last_name", "lastName"), 80);
  const company = clean(body.company, 160);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const country = clean(body.country, 80);
  const message = clean(body.message, 4000);
  const localeRaw = body.locale;
  const locale = LOCALES.has(localeRaw) ? localeRaw : (admin ? null : "en");

  if (!firstName) fields.push("first_name");
  if (!lastName) fields.push("last_name");
  if (!company) fields.push("company");
  if (!email || !EMAIL.test(email)) fields.push("email");
  if (!phone || phone.replace(/\D/g, "").length < 6) fields.push("phone");
  if (country === null) fields.push("country");
  else if (!admin && country && countries && !countries.has(country)) fields.push("country");
  if (message === null) fields.push("message");
  if (admin && !locale) fields.push("locale");

  const rawServices = Array.isArray(body.services) ? body.services : [];
  const services = [];
  rawServices.forEach(function (item) {
    const id = clean(item, 40);
    if (id && SERVICE_IDS.has(id) && services.indexOf(id) === -1) services.push(id);
  });
  if (rawServices.length && services.length !== rawServices.filter(Boolean).length) fields.push("services");

  let status = "new";
  if (admin) {
    const rawStatus = clean(body.status, 20) || "new";
    if (!STATUSES.has(rawStatus)) fields.push("status");
    else status = rawStatus;
  }

  if (!admin) {
    const terms = body.terms === true || body.terms === "yes" || body.terms === "on";
    if (!terms) fields.push("terms");
  }

  if (fields.length) return { ok: false, fields: fields };
  return {
    ok: true,
    enquiry: {
      locale: locale || "en",
      firstName: firstName,
      lastName: lastName,
      company: company,
      email: email,
      phone: phone,
      country: country || "",
      services: services,
      message: message || "",
      terms: 1,
      status: status
    }
  };
}
