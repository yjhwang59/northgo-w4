(function () {
  var map = { en: "en", "zh-Hant": "zh-tw", ja: "ja", vi: "vi" };
  var locale = map[document.documentElement.lang];
  if (!locale || !document.querySelector("[data-cms]")) return;
  fetch("/api/content?locale=" + encodeURIComponent(locale), { headers: { accept: "application/json" } })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (data) {
      if (!data) return;
      document.querySelectorAll("[data-cms]").forEach(function (node) {
        var key = node.getAttribute("data-cms");
        if (typeof data[key] === "string") node.textContent = data[key];
      });
    })
    .catch(function () {});
})();
