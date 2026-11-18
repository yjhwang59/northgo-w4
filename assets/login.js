(function () {
  var form = document.getElementById("login-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ username: data.get("username"), password: data.get("password") })
    }).then(function (response) {
      if (response.ok) {
        location.href = "/admin";
        return;
      }
      if (status) status.textContent = "登入失敗";
    }).catch(function () {
      if (status) status.textContent = "登入失敗";
    });
  });
})();
