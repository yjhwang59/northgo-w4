(function () {
  var form = document.getElementById("enquiry-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var button = form.querySelector("button[type='submit']");
  var label = button ? button.textContent : "";
  var sending = button ? button.getAttribute("data-sending") : "";

  function show(kind, text) {
    if (!status) return;
    status.textContent = text || "";
    status.className = "form-status" + (kind ? " " + kind : "");
  }

  function mark(names) {
    form.querySelectorAll("[name]").forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });
    (names || []).forEach(function (name) {
      form.querySelectorAll("[name='" + name + "']").forEach(function (input) {
        input.setAttribute("aria-invalid", "true");
      });
    });
  }

  if (status && new URLSearchParams(location.search).get("sent") === "1") {
    show("ok", status.getAttribute("data-success"));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var services = [];
    form.querySelectorAll("input[name='services']:checked").forEach(function (input) {
      services.push(input.value);
    });
    var payload = {
      locale: form.getAttribute("data-locale"),
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      company: data.get("company"),
      email: data.get("email"),
      phone: data.get("phone"),
      country: data.get("country"),
      services: services,
      message: data.get("message"),
      terms: data.get("terms") === "yes",
      company_website: data.get("company_website")
    };
    if (button) {
      button.disabled = true;
      button.textContent = sending || label;
    }
    show("", "");
    fetch("/api/enquiries", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json().then(function (body) {
        return { ok: response.ok, body: body };
      });
    }).then(function (result) {
      if (result.ok && result.body.ok) {
        form.reset();
        mark([]);
        show("ok", status.getAttribute("data-success"));
        return;
      }
      mark(result.body.fields || []);
      var invalid = status.getAttribute("data-invalid");
      show("bad", result.body.error === "rate" ? status.getAttribute("data-error") : (invalid || status.getAttribute("data-error")));
    }).catch(function () {
      show("bad", status.getAttribute("data-error"));
    }).then(function () {
      if (button) {
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
})();
