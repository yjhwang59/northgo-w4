import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(import.meta.url));
const site = require("./content/site.js");
const countries = require("./content/countries.json");
const cmsFields = require("./content/cms-fields.json");
const version = require("./package.json").version;
const dist = join(root, "dist");

const pageById = new Map(site.pages.map(function (page) {
  return [page.id, page];
}));

function pathname(locale, pagePath) {
  if (pagePath === "/") return locale.prefix || "/";
  return locale.prefix + pagePath;
}

function absolute(locale, pagePath) {
  const path = pathname(locale, pagePath);
  return path === "/" ? site.origin + "/" : site.origin + path;
}

function cssHref(locale, pagePath) {
  const path = pathname(locale, pagePath);
  const depth = path === "/" ? 0 : path.split("/").filter(Boolean).length;
  return "../".repeat(depth) + "assets/site.css";
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char];
  });
}

function accent(text, word) {
  const safe = esc(text);
  if (!word || text.indexOf(word) === -1) return safe;
  return safe.replace(esc(word), "<span class=\"accent\">" + esc(word) + "</span>");
}

function telHref(tel) {
  return "tel:" + tel.replace(/[^\d+]/g, "");
}

function mapsHref(query) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
}

function list(items) {
  if (!items || !items.length) return "";
  return "<ul class=\"plain\">" + items.map(function (item) {
    return "<li>" + esc(item) + "</li>";
  }).join("") + "</ul>";
}

function groups(items) {
  if (!items || !items.length) return "";
  return "<div class=\"groups\">" + items.map(function (group) {
    return "<div class=\"group\"><h4>" + esc(group.title) + "</h4>" +
      (group.text ? "<p>" + esc(group.text) + "</p>" : "") +
      list(group.items) + "</div>";
  }).join("") + "</div>";
}

function topic(block) {
  return "<article class=\"topic\" id=\"" + esc(block.id) + "\"><h3>" + esc(block.title) + "</h3>" +
    (block.text ? "<p>" + esc(block.text) + "</p>" : "") +
    list(block.points) + groups(block.groups) + "</article>";
}

function subnav(ui, blocks) {
  const links = [];
  (blocks || []).forEach(function (block) {
    if (block.id && block.title) links.push(block);
    (block.topics || []).forEach(function (item) {
      if (item.id) links.push(item);
    });
    (block.lists || []).forEach(function (item) {
      if (item.id) links.push(item);
    });
  });
  if (!links.length) return "";
  return "<nav class=\"subnav\" aria-label=\"" + esc(ui.onThisPage) + "\">" +
    links.map(function (item) {
      return "<a href=\"#" + esc(item.id) + "\">" + esc(item.title) + "</a>";
    }).join("") + "</nav>";
}

function servicePage(ui, page, pageId) {
  const blocks = [{ topics: page.topics, lists: page.lists }];
  return "<header class=\"hero\"><div class=\"wrap\"><h1 data-cms=\"" + esc(pageId) + ".h1\">" + esc(page.h1) +
    "</h1><p class=\"lede\" data-cms=\"" + esc(pageId) + ".lede\">" +
    esc(page.lede) + "</p>" + subnav(ui, blocks) + "</div></header>" +
    "<section class=\"section\"><div class=\"wrap\"><h2>" + esc(page.introTitle) + "</h2><p class=\"intro\">" +
    esc(page.intro) + "</p><div class=\"topics\">" +
    (page.topics || []).map(topic).join("") + "</div></div></section>" +
    (page.lists || []).map(function (block) {
      return "<section class=\"section\" id=\"" + esc(block.id) + "\"><div class=\"wrap\"><h2>" +
        esc(block.title) + "</h2>" + list(block.items) + groups(block.groups) + "</div></section>";
    }).join("") +
    (page.closeTitle ? "<section class=\"section\"><div class=\"wrap\"><h2>" + esc(page.closeTitle) +
      "</h2><p class=\"intro\">" + esc(page.closeText) + "</p></div></section>" : "");
}

function homePage(locale, ui, page) {
  const services = page.services.map(function (item) {
    const target = pageById.get(item.page);
    return "<article class=\"card\"><h3><a href=\"" + esc(pathname(locale, target.path)) + "\"><span data-cms=\"home.service." +
      esc(item.page) + ".title\">" + esc(item.title) + "</span></a></h3><p data-cms=\"home.service." +
      esc(item.page) + ".text\">" + esc(item.text) + "</p></article>";
  }).join("");
  return "<header class=\"hero\"><div class=\"wrap hero-grid\"><div><h1>" + accent(page.h1, page.accent) +
    "</h1><p class=\"lede\" data-cms=\"home.lede\">" + esc(page.lede) + "</p><div class=\"button-row\"><a class=\"button\" href=\"" +
    esc(pathname(locale, "/contact") + "#enquiry") + "\">" + esc(ui.enquire) + "</a></div></div>" +
    "<ul class=\"panel\" aria-label=\"" + esc(page.modesLabel) + "\">" +
    page.modes.map(function (mode) {
      return "<li>" + esc(mode) + "</li>";
    }).join("") + "</ul></div></header>" +
    "<section class=\"section\" id=\"our-services\"><div class=\"wrap\"><h2 data-cms=\"home.servicesTitle\">" + esc(page.servicesTitle) +
    "</h2><p class=\"intro\" data-cms=\"home.servicesIntro\">" + esc(page.servicesIntro) + "</p><div class=\"cards services\">" +
    services + "</div></div></section>" +
    "<section class=\"section\" id=\"why-northgo\"><div class=\"wrap\"><h2 data-cms=\"home.whyTitle\">" + esc(page.whyTitle) +
    "</h2><p class=\"intro\" data-cms=\"home.whyBody\">" + esc(page.whyBody) + "</p><div class=\"points\">" +
    page.whyPoints.map(function (item) {
      return "<article class=\"point\"><h3>" + esc(item.title) + "</h3><p>" + esc(item.text) + "</p></article>";
    }).join("") + "</div><ul class=\"stats\">" + page.stats.map(function (item) {
      return "<li><strong>" + esc(item.value) + "</strong>" + esc(item.text) + "</li>";
    }).join("") + "</ul></div></section>" +
    "<section class=\"section\"><div class=\"wrap\"><h2 data-cms=\"home.teamTitle\">" + esc(page.teamTitle) + "</h2><p class=\"intro\" data-cms=\"home.teamBody\">" +
    esc(page.teamBody) + "</p><div class=\"points\">" + page.teamPoints.map(function (item) {
      return "<article class=\"point\"><h3>" + esc(item.title) + "</h3><p>" + esc(item.text) + "</p></article>";
    }).join("") + "</div><p class=\"note\">" + esc(page.certs) + "</p></div></section>" +
    "<section class=\"section\"><div class=\"wrap\"><div class=\"cta\"><h2 data-cms=\"home.ctaTitle\">" + esc(page.ctaTitle) +
    "</h2><p data-cms=\"home.ctaText\">" + esc(page.ctaText) + "</p><div class=\"button-row\"><a class=\"button\" href=\"" +
    esc(pathname(locale, "/contact") + "#enquiry") + "\">" + esc(page.ctaLabel) + "</a></div></div></div></section>";
}

function aboutPage(page) {
  return "<header class=\"hero\"><div class=\"wrap\"><h1 data-cms=\"about.h1\">" + esc(page.h1) + "</h1><p class=\"lede\" data-cms=\"about.lede\">" +
    esc(page.lede) + "</p></div></header>" +
    "<section class=\"section\"><div class=\"wrap\"><h2 data-cms=\"about.visionTitle\">" + esc(page.visionTitle) + "</h2><p class=\"intro\"><strong data-cms=\"about.vision\">" +
    esc(page.vision) + "</strong> <span data-cms=\"about.visionBody\">" + esc(page.visionBody) + "</span></p></div></section>" +
    "<section class=\"section\"><div class=\"wrap\"><h2 data-cms=\"about.missionTitle\">" + esc(page.missionTitle) + "</h2><p class=\"intro\"><strong data-cms=\"about.mission\">" +
    esc(page.mission) + "</strong> <span data-cms=\"about.missionBody\">" + esc(page.missionBody) + "</span></p></div></section>" +
    "<section class=\"section\"><div class=\"wrap\"><h2 data-cms=\"about.valuesTitle\">" + esc(page.valuesTitle) + "</h2><p class=\"intro\" data-cms=\"about.valuesIntro\">" +
    esc(page.valuesIntro) + "</p><div class=\"points\">" + page.values.map(function (item) {
      return "<article class=\"point\"><h3>" + esc(item.title) + "</h3><p>" + esc(item.text) + "</p></article>";
    }).join("") + "</div></div></section>" +
    "<section class=\"section\"><div class=\"wrap\"><h2>" + esc(page.storyTitle) + "</h2>" +
    page.story.map(function (paragraph) {
      return "<p class=\"intro\">" + esc(paragraph) + "</p>";
    }).join("") +
    "<div class=\"points\"><article class=\"point\"><h3>" + esc(page.changedTitle) + "</h3><p>" +
    esc(page.changed) + "</p></article><article class=\"point\"><h3>" + esc(page.sameTitle) +
    "</h3><p>" + esc(page.same) + "</p></article></div></div></section>";
}

function field(label, control, span) {
  return "<label class=\"field" + (span ? " span-2" : "") + "\"><span>" + esc(label) +
    " *</span>" + control + "</label>";
}

function enquiryForm(locale, ui, page) {
  const form = page.form;
  const options = countries.map(function (name) {
    return "<option value=\"" + esc(name) + "\">" + esc(name) + "</option>";
  }).join("");
  const services = ui.pages.home.services.map(function (item) {
    return "<label class=\"check\"><input type=\"checkbox\" name=\"services\" value=\"" + esc(item.page) +
      "\">" + esc(item.title) + "</label>";
  }).join("") + "<label class=\"check\"><input type=\"checkbox\" name=\"services\" value=\"other\">" +
    esc(form.other) + "</label>";
  return "<form id=\"enquiry-form\" class=\"enquiry-form\" method=\"post\" action=\"/api/enquiries\" data-locale=\"" +
    esc(locale.code) + "\"><p class=\"required-note\">" + esc(form.requiredNote) +
    "</p><div class=\"form-grid\">" +
    field(form.firstName, "<input name=\"first_name\" required maxlength=\"80\" autocomplete=\"given-name\">") +
    field(form.lastName, "<input name=\"last_name\" required maxlength=\"80\" autocomplete=\"family-name\">") +
    field(form.company, "<input name=\"company\" required maxlength=\"160\" autocomplete=\"organization\">", true) +
    field(form.email, "<input name=\"email\" type=\"email\" required maxlength=\"160\" autocomplete=\"email\">") +
    field(form.phone, "<input name=\"phone\" type=\"tel\" required maxlength=\"40\" autocomplete=\"tel\">") +
    "<label class=\"field span-2\"><span>" + esc(form.country) + "</span><select name=\"country\"><option value=\"\">" +
    esc(form.countryEmpty) + "</option>" + options + "</select></label>" +
    "<fieldset class=\"field span-2\"><legend>" + esc(form.services) + "</legend><div class=\"checks\">" +
    services + "</div></fieldset>" +
    "<label class=\"field span-2\"><span>" + esc(form.message) + "</span><textarea name=\"message\" maxlength=\"4000\"></textarea></label>" +
    "<label class=\"check span-2\"><input type=\"checkbox\" name=\"terms\" value=\"yes\" required><span>" +
    esc(form.terms) + " *</span></label>" +
    "<p class=\"hp\" aria-hidden=\"true\"><label>Website<input name=\"company_website\" tabindex=\"-1\" autocomplete=\"off\"></label></p>" +
    "<div class=\"button-row span-2\"><button class=\"button\" type=\"submit\" data-sending=\"" + esc(form.sending) +
    "\">" + esc(form.submit) + "</button></div>" +
    "<p class=\"form-status span-2\" role=\"status\" data-success=\"" + esc(form.success) + "\" data-error=\"" +
    esc(form.error) + "\" data-invalid=\"" + esc(form.invalid) + "\"></p></div>" +
    "<p class=\"form-mail\"><a href=\"mailto:info.tpe@northgo.com\">" + esc(page.enquiryLabel) + "</a></p></form>";
}

function contactPage(locale, ui, page) {
  const cards = site.offices.map(function (office) {
    const badge = office.head ? "<span class=\"badge\">" + esc(ui.headOffice) + "</span>" : "";
    const fax = office.fax
      ? "<div><dt>" + esc(ui.fax) + "</dt><dd>" + esc(office.fax) + "</dd></div>"
      : "";
    return "<article class=\"office\"><h3>" + esc(office.name[locale.code]) + badge + "</h3><p>" +
      esc(office.address[locale.code]) + "</p><dl class=\"facts\"><div><dt>" + esc(ui.tel) +
      "</dt><dd><a href=\"" + esc(telHref(office.tel)) + "\">" + esc(office.tel) +
      "</a></dd></div>" + fax + "<div><dt>" + esc(ui.email) + "</dt><dd><a href=\"mailto:" +
      esc(office.email) + "\">" + esc(office.email) + "</a></dd></div></dl><div class=\"button-row\"><a href=\"" +
      esc(mapsHref(office.maps)) + "\">" + esc(ui.viewMaps) + "</a></div></article>";
  }).join("");
  return "<header class=\"hero\"><div class=\"wrap\"><h1 data-cms=\"contact.h1\">" + esc(page.h1) + "</h1><p class=\"lede\" data-cms=\"contact.lede\">" +
    esc(page.lede) + "</p></div></header>" +
    "<section class=\"section\" id=\"enquiry\"><div class=\"wrap\"><article class=\"enquiry\"><h2 data-cms=\"contact.enquiryTitle\">" +
    esc(page.enquiryTitle) + "</h2><p data-cms=\"contact.enquiryText\">" + esc(page.enquiryText) + "</p>" +
    enquiryForm(locale, ui, page) + "</article></div></section>" +
    "<section class=\"section\" id=\"locations\"><div class=\"wrap\"><h2 data-cms=\"contact.locationsTitle\">" + esc(page.locationsTitle) +
    "</h2><p class=\"intro\" data-cms=\"contact.locationsIntro\">" + esc(page.locationsIntro) + "</p><div class=\"button-row\"><a class=\"button\" href=\"/locations?lang=" +
    esc(locale.code) + "\">" + esc(page.mapLabel) + "</a></div><div class=\"offices\">" + cards +
    "</div></div></section>";
}

function body(locale, ui, pageId) {
  const page = ui.pages[pageId];
  if (pageId === "home") return homePage(locale, ui, page);
  if (pageId === "about") return aboutPage(page);
  if (pageId === "contact") return contactPage(locale, ui, page);
  return servicePage(ui, page, pageId);
}

function chrome(locale, ui, current) {
  const links = [
    { label: ui.why, href: pathname(locale, "/") + "#why-northgo", id: "home", hash: true },
    { label: ui.services, href: pathname(locale, "/") + "#our-services", id: "services", hash: true },
    { label: ui.about, href: pathname(locale, "/about"), id: "about" },
    { label: ui.contact, href: pathname(locale, "/contact"), id: "contact" }
  ];
  const locales = site.locales.map(function (item) {
    const currentAttr = item.code === locale.code ? " aria-current=\"true\"" : "";
    return "<a href=\"" + esc(pathname(item, current.path)) + "\" hreflang=\"" + esc(item.hreflang) +
      "\" lang=\"" + esc(item.htmlLang) + "\"" + currentAttr + ">" + esc(item.name) + "</a>";
  }).join("");
  const serviceIds = ["freight", "project", "warehouse", "agency"];
  const nav = links.map(function (item) {
    const onServices = item.id === "services" && serviceIds.indexOf(current.id) !== -1;
    const currentAttr = onServices || (!item.hash && item.id === current.id) ? " aria-current=\"page\"" : "";
    return "<a href=\"" + esc(item.href) + "\"" + currentAttr + ">" + esc(item.label) + "</a>";
  }).join("");
  return "<a class=\"skip\" href=\"#content\">" + esc(ui.skip) + "</a><header class=\"site-header\"><div class=\"wrap bar\">" +
    "<a class=\"brand\" href=\"" + esc(pathname(locale, "/")) + "\">North<span>go</span></a>" +
    "<a class=\"enquire\" href=\"" + esc(pathname(locale, "/contact") + "#enquiry") + "\">" +
    esc(ui.enquire) + "</a>" +
    "<details class=\"menu\" id=\"site-menu\"><summary>" + esc(ui.menu) + "</summary><div class=\"menu-panel\">" +
    "<nav class=\"nav\" aria-label=\"" + esc(ui.navLabel) + "\">" + nav + "</nav>" +
    "<nav class=\"locales\" aria-label=\"" + esc(ui.localeLabel) + "\">" + locales + "</nav></div></details>" +
    "</div></header><main id=\"content\">" + body(locale, ui, current.id) +
    "</main><footer class=\"site-footer\"><div class=\"wrap footer-grid\"><div><a class=\"brand\" href=\"" +
    esc(pathname(locale, "/")) + "\">North<span>go</span></a><p>" + esc(ui.member) + "</p></div><nav aria-label=\"" +
    esc(ui.footerNav) + "\"><p class=\"footer-label\">" + esc(ui.footerNav) + "</p><ul><li><a href=\"" +
    esc(pathname(locale, "/")) + "\">" + esc(ui.home) + "</a></li><li><a href=\"" +
    esc(pathname(locale, "/") + "#why-northgo") + "\">" + esc(ui.why) + "</a></li><li><a href=\"" +
    esc(pathname(locale, "/about")) + "\">" + esc(ui.about) + "</a></li><li><a href=\"" +
    esc(pathname(locale, "/contact")) + "\">" + esc(ui.contact) + "</a></li><li><a href=\"/locations?lang=" +
    esc(locale.code) + "\">" + esc(ui.map) + "</a></li></ul></nav><nav aria-label=\"" + esc(ui.footerServices) +
    "\"><p class=\"footer-label\">" + esc(ui.footerServices) + "</p><ul>" +
    ["freight", "project", "warehouse", "agency"].map(function (id) {
      const target = pageById.get(id);
      const label = ui.pages.home.services.find(function (item) { return item.page === id; }).title;
      return "<li><a href=\"" + esc(pathname(locale, target.path)) + "\">" + esc(label) + "</a></li>";
    }).join("") + "</ul></nav></div><p class=\"rights\">" + esc(ui.rights) + "</p>" +
    (current.id === "home" ? "<p class=\"version\">v" + esc(version) + "</p>" : "") + "</div></footer>";
}

function jsonLd(locale, description) {
  if (locale.code !== "en" && locale.code !== "zh-tw" && locale.code !== "ja" && locale.code !== "vi") return "";
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Northgo",
    url: site.origin + "/",
    foundingDate: "1988",
    email: "info.tpe@northgo.com",
    description: description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "7F., No. 10, Sec. 3, Minsheng E. Rd.",
      addressLocality: "Taipei",
      postalCode: "104511",
      addressCountry: "TW"
    }
  };
  return "<script type=\"application/ld+json\">" + JSON.stringify(data).replace(/</g, "\\u003c") + "</script>";
}

function render(locale, page) {
  const ui = site.copy[locale.code];
  const content = ui.pages[page.id];
  const alternates = site.locales.map(function (item) {
    return "<link rel=\"alternate\" hreflang=\"" + esc(item.hreflang) + "\" href=\"" +
      esc(absolute(item, page.path)) + "\">";
  }).join("");
  const canonical = absolute(locale, page.path);
  const ld = page.id === "home" ? jsonLd(locale, content.description) : "";
  return "<!DOCTYPE html>\n<html lang=\"" + esc(locale.htmlLang) + "\">\n<head>\n<meta charset=\"utf-8\">\n" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>" + esc(content.title) +
    "</title>\n<meta name=\"description\" content=\"" + esc(content.description) + "\">\n<link rel=\"canonical\" href=\"" +
    esc(canonical) + "\">\n<link rel=\"alternate\" hreflang=\"x-default\" href=\"" + esc(absolute(site.locales[0], page.path)) +
    "\">\n" + alternates + "\n<meta property=\"og:title\" content=\"" + esc(content.title) +
    "\">\n<meta property=\"og:description\" content=\"" + esc(content.description) + "\">\n<meta property=\"og:url\" content=\"" +
    esc(canonical) + "\">\n<meta property=\"og:type\" content=\"website\">\n<meta name=\"theme-color\" content=\"#0a1b33\">\n" +
    ld + "<link rel=\"stylesheet\" href=\"" + esc(cssHref(locale, page.path)) + "\">\n</head>\n<body>\n" +
    chrome(locale, ui, page) +
    "<script>(function(){var menu=document.getElementById(\"site-menu\");if(!menu)return;var wide=window.matchMedia(\"(min-width: 900px)\");function sync(){if(wide.matches)menu.open=true;}sync();wide.addEventListener(\"change\",sync);})();</script>\n" +
    (page.id === "contact" ? "<script src=\"/assets/enquiry.js\" defer></script>\n" : "") +
    "<script src=\"/assets/cms-live.js\" defer></script>\n</body>\n</html>\n";
}

function writePage(locale, page) {
  const path = pathname(locale, page.path);
  const file = path === "/" ? join(dist, "index.html") : join(dist, path.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  const html = render(locale, page);
  if (!html.includes("<title>") || html.includes("<title></title>")) {
    throw new Error("Missing title for " + locale.code + " " + page.id);
  }
  if (!html.includes("name=\"description\"")) throw new Error("Missing description");
  writeFileSync(file, html);
}

function sitemapXml() {
  const urls = [];
  site.locales.forEach(function (locale) {
    site.pages.forEach(function (page) {
      const loc = absolute(locale, page.path);
      const links = site.locales.map(function (item) {
        return "    <xhtml:link rel=\"alternate\" hreflang=\"" + item.hreflang + "\" href=\"" +
          absolute(item, page.path) + "\"/>";
      }).join("\n");
      urls.push("  <url>\n    <loc>" + loc + "</loc>\n" + links +
        "\n    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"" +
        absolute(site.locales[0], page.path) + "\"/>\n  </url>");
    });
  });
  urls.push("  <url>\n    <loc>" + site.origin + "/locations</loc>\n  </url>");
  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n" +
    urls.join("\n") + "\n</urlset>\n";
}

function locationsPage() {
  let html = readFileSync(join(root, "locations.html"), "utf8").replace(/\r\n/g, "\n");
  html = html.replace(
    "var CONTACT = {\n        en: \"https://www.northgo.com/contact#locations\",\n        \"zh-tw\": \"https://www.northgo.com/zh-tw/contact#locations\",\n        ja: \"https://www.northgo.com/ja/contact#locations\",\n        vi: \"https://www.northgo.com/vi/contact#locations\"\n      };",
    "var CONTACT = {\n        en: \"/contact#locations\",\n        \"zh-tw\": \"/zh-tw/contact#locations\",\n        ja: \"/ja/contact#locations\",\n        vi: \"/vi/contact#locations\"\n      };\n      var HOME = {\n        en: \"/\",\n        \"zh-tw\": \"/zh-tw\",\n        ja: \"/ja\",\n        vi: \"/vi\"\n      };"
  );
  html = html.replace(
    ".locales button[aria-pressed=\"true\"] {",
    ".locales a[aria-pressed=\"true\"],\n    .locales button[aria-pressed=\"true\"] {"
  );
  html = html.replace(
    ".locales button,\n    .regions button,",
    ".locales a,\n    .locales button,\n    .regions button,"
  );
  html = html.replace(
    ".locales button,\n    .links a {",
    ".locales button,\n    .locales a,\n    .links a {"
  );
  html = html.replace(
    "a.brand { color: inherit; }",
    "a.brand { color: #fff; text-decoration: none; }"
  );
  if (html.indexOf("a.brand { color: #fff;") === -1) {
    html = html.replace("</style>", "    a.brand { color: #fff; text-decoration: none; }\n  </style>");
  }
  html = html.replace(
    "<p class=\"brand\">North<span>go</span></p>",
    "<a class=\"brand\" id=\"home-link\" href=\"/\">North<span>go</span></a>"
  );
  html = html.replace(
    /<button type="button" data-locale="([^"]+)" aria-pressed="(?:true|false)">([^<]+)<\/button>/g,
    function (_, code, label) {
      const locale = site.locales.find(function (item) { return item.code === code; });
      return "<a data-locale=\"" + code + "\" href=\"/locations?lang=" + code + "\" hreflang=\"" +
        locale.hreflang + "\" lang=\"" + locale.htmlLang + "\" aria-pressed=\"false\">" + label + "</a>";
    }
  );
  html = html.replace(
    "<a id=\"contact-link\" href=\"https://www.northgo.com/zh-tw/contact#locations\" target=\"_blank\" rel=\"noopener noreferrer\"",
    "<a id=\"contact-link\" href=\"/zh-tw/contact#locations\""
  );
  html = html.replace(
    "document.getElementById(\"contact-link\").href = CONTACT[state.locale];",
    "document.getElementById(\"contact-link\").href = CONTACT[state.locale];\n        var homeLink = document.getElementById(\"home-link\");\n        if (homeLink) homeLink.href = HOME[state.locale];"
  );
  html = html.replace(
    "var saved = \"zh-tw\";\n      try {\n        var stored = sessionStorage.getItem(\"northgo-sitemap-locale\");\n        if (stored && COPY[stored]) saved = stored;\n      } catch (err) {}",
    "var saved = \"zh-tw\";\n      try {\n        var fromQuery = new URLSearchParams(window.location.search).get(\"lang\");\n        if (fromQuery && COPY[fromQuery]) saved = fromQuery;\n      } catch (err) {}"
  );
  if (html.indexOf("var HOME =") === -1) throw new Error("locations contact paths were not rewritten");
  if (html.indexOf("/locations?lang=") === -1) throw new Error("locations locale links were not rewritten");
  if (html.indexOf("www.northgo.com") !== -1) throw new Error("locations still points at the live site");
  writeFileSync(join(dist, "locations.html"), html);
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });
cpSync(join(root, "content", "countries.json"), join(dist, "assets", "countries.json"));
cpSync(join(root, "content", "cms-fields.json"), join(dist, "assets", "cms-fields.json"));
cpSync(join(root, "sitemap.html"), join(dist, "sitemap.html"));
cpSync(join(root, "sitemap-tree.html"), join(dist, "sitemap-tree.html"));
cpSync(join(root, "sitemap-i18n.js"), join(dist, "sitemap-i18n.js"));

let count = 0;
site.locales.forEach(function (locale) {
  site.pages.forEach(function (page) {
    writePage(locale, page);
    count += 1;
  });
});
locationsPage();
const defaults = {};
site.locales.forEach(function (locale) {
  const ui = site.copy[locale.code];
  const home = ui.pages.home;
  const about = ui.pages.about;
  const contact = ui.pages.contact;
  const values = {
    "home.lede": home.lede,
    "home.servicesTitle": home.servicesTitle,
    "home.servicesIntro": home.servicesIntro,
    "home.whyTitle": home.whyTitle,
    "home.whyBody": home.whyBody,
    "home.teamTitle": home.teamTitle,
    "home.teamBody": home.teamBody,
    "home.ctaTitle": home.ctaTitle,
    "home.ctaText": home.ctaText,
    "about.h1": about.h1,
    "about.lede": about.lede,
    "about.visionTitle": about.visionTitle,
    "about.vision": about.vision,
    "about.visionBody": about.visionBody,
    "about.missionTitle": about.missionTitle,
    "about.mission": about.mission,
    "about.missionBody": about.missionBody,
    "about.valuesTitle": about.valuesTitle,
    "about.valuesIntro": about.valuesIntro,
    "contact.h1": contact.h1,
    "contact.lede": contact.lede,
    "contact.enquiryTitle": contact.enquiryTitle,
    "contact.enquiryText": contact.enquiryText,
    "contact.locationsTitle": contact.locationsTitle,
    "contact.locationsIntro": contact.locationsIntro
  };
  home.services.forEach(function (item) {
    values["home.service." + item.page + ".title"] = item.title;
    values["home.service." + item.page + ".text"] = item.text;
  });
  ["freight", "project", "warehouse", "agency"].forEach(function (id) {
    values[id + ".h1"] = ui.pages[id].h1;
    values[id + ".lede"] = ui.pages[id].lede;
  });
  cmsFields.groups.forEach(function (group) {
    group.fields.forEach(function (field) {
      if (typeof values[field.key] !== "string") throw new Error("Missing CMS default " + locale.code + " " + field.key);
    });
  });
  defaults[locale.code] = values;
});
writeFileSync(join(dist, "assets", "cms-defaults.json"), JSON.stringify(defaults));
writeFileSync(join(dist, "sitemap.xml"), sitemapXml());
writeFileSync(join(dist, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: https://www.northgo.com/sitemap.xml\n");
console.log("Wrote " + count + " pages to dist/");
