import { validateEnquiry } from "../src/validate-enquiry.mjs";

const countries = new Set(["Taiwan", "Japan"]);
const valid = {
  first_name: "Ada",
  last_name: "Lin",
  company: "Northgo",
  email: "ada@example.com",
  phone: "+886-2-2531-8677",
  country: "Taiwan",
  services: ["freight", "other"],
  message: "Need a schedule.",
  terms: true,
  locale: "zh-tw"
};

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const ok = validateEnquiry(valid, countries);
assert(ok.ok && ok.enquiry.services.length === 2, "valid enquiry");
assert(validateEnquiry(Object.assign({}, valid, { email: "bad" }), countries).ok === false, "bad email");
assert(validateEnquiry(Object.assign({}, valid, { terms: false }), countries).fields.indexOf("terms") !== -1, "terms");
assert(validateEnquiry(Object.assign({}, valid, { country: "Mars" }), countries).fields.indexOf("country") !== -1, "country");
assert(validateEnquiry(Object.assign({}, valid, { company_website: "http://spam" }), countries).drop === true, "honeypot");
assert(validateEnquiry(Object.assign({}, valid, { services: ["nope"] }), countries).fields.indexOf("services") !== -1, "service");

const adminOk = validateEnquiry({
  firstName: "Ada",
  lastName: "Lin",
  company: "Northgo",
  email: "ada@example.com",
  phone: "+886-2-2531-8677",
  country: "Anywhere",
  services: ["freight"],
  message: "Admin create",
  locale: "zh-tw",
  status: "read"
}, countries, { admin: true });
assert(adminOk.ok && adminOk.enquiry.status === "read" && adminOk.enquiry.country === "Anywhere", "admin camelCase");
assert(
  validateEnquiry(Object.assign({}, valid, { terms: false }), countries, { admin: true }).ok === true,
  "admin skips terms"
);
assert(
  validateEnquiry(Object.assign({}, valid, { status: "nope" }), countries, { admin: true }).fields.indexOf("status") !== -1,
  "admin status"
);
console.log("ok");
