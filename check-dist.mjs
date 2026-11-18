import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else if (name === "index.html") acc.push(path);
  }
  return acc;
}

const pages = walk("dist");
const bad = [];
if (pages.length !== 28) bad.push("page count " + pages.length);
for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title) bad.push(file + " title");
  if (!html.includes("name=\"description\"")) bad.push(file + " description");
  if (!html.includes("rel=\"canonical\"")) bad.push(file + " canonical");
  if ((html.match(/hreflang=/g) || []).length < 5) bad.push(file + " hreflang");
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) bad.push(file + " h1");
  if (html.includes("placeholder") || html.includes("href=\"#\"") || html.includes("/news")) bad.push(file + " junk");
}
const loc = readFileSync("dist/locations.html", "utf8");
if (loc.includes("www.northgo.com")) bad.push("locations live url");
if (!loc.includes("/locations?lang=ja")) bad.push("locations lang");
const locs = (readFileSync("dist/sitemap.xml", "utf8").match(/<loc>/g) || []).length;
if (locs !== 29) bad.push("sitemap " + locs);
if (!readFileSync("dist/robots.txt", "utf8").includes("https://www.northgo.com/sitemap.xml")) bad.push("robots");
const contact = readFileSync("dist/zh-tw/contact/index.html", "utf8");
if (!contact.includes("id=\"enquiry\"") || !contact.includes("id=\"locations\"")) bad.push("contact ids");
if ((contact.match(/class="office"/g) || []).length !== 7) bad.push("offices");
if (!contact.includes("mailto:info.tpe@northgo.com")) bad.push("mailto");
if (!contact.includes("id=\"enquiry-form\"")) bad.push("enquiry form");
if (!contact.includes("action=\"/api/enquiries\"")) bad.push("enquiry action");
if (!contact.includes("data-cms=\"contact.h1\"")) bad.push("cms contact");
if (bad.length) {
  console.log(bad.join("\n"));
  process.exit(1);
}
console.log("ok");
