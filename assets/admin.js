(function () {
  var statusLabel = { new: "新進", read: "已讀", archived: "已封存" };
  var roleLabel = { admin: "管理者", editor: "編輯者" };
  var pageStatusLabel = { draft: "草稿", published: "已發布" };
  var serviceLabel = {
    freight: "貨運物流",
    project: "專案物流",
    warehouse: "倉儲物流",
    agency: "船務代理",
    other: "其他"
  };
  var previewPaths = {
    home: "/",
    about: "/about",
    contact: "/contact",
    freight: "/services/freight-logistics",
    project: "/services/project-logistics",
    warehouse: "/services/warehouse-logistics",
    agency: "/services/shipping-agency"
  };
  var localePrefix = { en: "", "zh-tw": "/zh-tw", ja: "/ja", vi: "/vi" };

  var ICON_EDIT = "<svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M11.7 1.3a1.5 1.5 0 0 1 2.1 2.1L5.6 11.6 2 12.8l1.2-3.6L11.7 1.3zm-1 1.4L3.9 9.5l-.5 1.5 1.5-.5 6.8-6.8-.9-.9z\"/></svg>";
  var ICON_DELETE = "<svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M6 2h4l.5 1H14v1.5H2V3h3.5L6 2zm1 4v6H5.5V6H7zm3.5 0v6H9V6h1.5zM3.5 4.5h9l-.7 9.2A1.5 1.5 0 0 1 10.3 15H5.7a1.5 1.5 0 0 1-1.5-1.3L3.5 4.5z\"/></svg>";
  var ICON_OPEN = "<svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M9 2h5v5h-1.5V4.56L7.53 9.53 6.47 8.47 11.44 3.5H9V2zM3 4.5h4V6H4.5v5.5h5.5V10H11v3H3v-8.5z\"/></svg>";

  var ENQUIRY_COLUMNS = [
    { key: "createdAt", label: "時間", defaultVisible: true, sortable: true, sortType: "date" },
    { key: "name", label: "姓名", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "company", label: "公司", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "email", label: "電子郵件", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "status", label: "狀態", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "phone", label: "電話", defaultVisible: false, sortable: true, sortType: "string" },
    { key: "country", label: "國家", defaultVisible: false, sortable: true, sortType: "string" },
    { key: "services", label: "服務", defaultVisible: false, sortable: true, sortType: "string" },
    { key: "locale", label: "語系", defaultVisible: false, sortable: true, sortType: "string" }
  ];
  var ENQUIRY_COLUMNS_KEY = "admin-enquiries-visible-columns";

  var PAGE_COLUMNS = [
    { key: "title", label: "標題", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "locale", label: "語系", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "slug", label: "Slug", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "status", label: "狀態", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "updatedAt", label: "更新時間", defaultVisible: true, sortable: true, sortType: "date" }
  ];
  var PAGE_COLUMNS_KEY = "admin-pages-visible-columns";

  var USER_COLUMNS = [
    { key: "username", label: "帳號", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "displayName", label: "顯示名稱", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "role", label: "角色", defaultVisible: true, sortable: true, sortType: "string" },
    { key: "lastLoginAt", label: "最後登入", defaultVisible: true, sortable: true, sortType: "date" },
    { key: "createdAt", label: "建立時間", defaultVisible: false, sortable: true, sortType: "date" }
  ];
  var USER_COLUMNS_KEY = "admin-users-visible-columns";

  var me = { username: "", role: "editor", displayName: "", avatarUrl: "" };
  var groups = [];
  var enquiries = [];
  var mediaItems = [];
  var pages = [];
  var users = [];
  var AVATAR_COLORS = ["#0a1b33", "#1f4b6e", "#0b5f66", "#3e5168", "#245b7a", "#167a74"];
  var enquiryPage = 1;
  var enquirySortBy = "createdAt";
  var enquirySortDir = "desc";
  var enquiryVisibleKeys = defaultVisibleKeys(ENQUIRY_COLUMNS);
  var pagePage = 1;
  var pageSortBy = "updatedAt";
  var pageSortDir = "desc";
  var pageVisibleKeys = defaultVisibleKeys(PAGE_COLUMNS);
  var userPage = 1;
  var userSortBy = "username";
  var userSortDir = "asc";
  var userVisibleKeys = defaultVisibleKeys(USER_COLUMNS);
  var contentDirty = false;
  var searchTimers = {};
  var modalMode = null;
  var modalTarget = null;

  var listEl = document.getElementById("enquiry-list");
  var enquiryPager = document.getElementById("enquiry-pager");
  var filter = document.getElementById("status-filter");
  var enquirySearch = document.getElementById("enquiry-search");
  var enquiryPageSize = document.getElementById("enquiry-page-size");
  var enquiryColPanel = document.getElementById("enquiry-col-panel");
  var enquiryColumnsBtn = document.getElementById("enquiry-columns");
  var enquiryReloadBtn = document.getElementById("enquiry-reload");
  var localeSelect = document.getElementById("locale");
  var pageSelect = document.getElementById("page");
  var contentSearch = document.getElementById("content-search");
  var fieldsEl = document.getElementById("fields");
  var contentStatus = document.getElementById("content-status");
  var mediaList = document.getElementById("media-list");
  var mediaStatus = document.getElementById("media-status");
  var mediaSearch = document.getElementById("media-search");
  var mediaReloadBtn = document.getElementById("media-reload");
  var pageList = document.getElementById("page-list");
  var pagePager = document.getElementById("page-pager");
  var pageSearch = document.getElementById("page-search");
  var pageStatusFilter = document.getElementById("page-status-filter");
  var pagePageSize = document.getElementById("page-page-size");
  var pageColPanel = document.getElementById("page-col-panel");
  var pageColumnsBtn = document.getElementById("page-columns");
  var pageReloadBtn = document.getElementById("page-reload");
  var userList = document.getElementById("user-list");
  var userPager = document.getElementById("user-pager");
  var userSearch = document.getElementById("user-search");
  var userRoleFilter = document.getElementById("user-role-filter");
  var userPageSize = document.getElementById("user-page-size");
  var userColPanel = document.getElementById("user-col-panel");
  var userColumnsBtn = document.getElementById("user-columns");
  var userReloadBtn = document.getElementById("user-reload");
  var whoami = document.getElementById("whoami");
  var profileEditBtn = document.getElementById("profile-edit");
  var modal = document.getElementById("modal");
  var modalTitle = document.getElementById("modal-title");
  var modalBody = document.getElementById("modal-body");
  var modalStatus = document.getElementById("modal-status");

  function defaultVisibleKeys(columns) {
    return columns.filter(function (col) {
      return col.defaultVisible;
    }).map(function (col) { return col.key; });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function api(path, options) {
    var opts = options || {};
    opts.headers = Object.assign({ accept: "application/json" }, opts.headers || {});
    return fetch(path, opts).then(function (response) {
      if (response.status === 401) {
        location.href = "/admin/login";
        throw new Error("auth");
      }
      return response.json().then(function (data) {
        if (!response.ok) {
          var err = new Error((data && data.error) || "request");
          err.code = data && data.error;
          err.status = response.status;
          throw err;
        }
        return data;
      });
    });
  }

  function debounce(key, fn, wait) {
    clearTimeout(searchTimers[key]);
    searchTimers[key] = setTimeout(fn, wait || 350);
  }

  function setDirty(next) {
    contentDirty = !!next;
    if (contentDirty) contentStatus.textContent = "有尚未儲存的修改。";
  }

  function openModal(title, bodyNode, mode, target) {
    modalMode = mode;
    modalTarget = target || null;
    modalTitle.textContent = title;
    modalStatus.textContent = "";
    modalBody.textContent = "";
    modalBody.appendChild(bodyNode);
    modal.hidden = false;
  }

  function closeModal() {
    modal.hidden = true;
    modalMode = null;
    modalTarget = null;
    modalBody.textContent = "";
    modalStatus.textContent = "";
  }

  function fieldValue(form, name) {
    var node = form.querySelector("[name=\"" + name + "\"]");
    return node ? node.value : "";
  }

  function displayNameOf(user) {
    return (user && user.displayName) || (user && user.username) || "";
  }

  function initialsOf(user) {
    var name = displayNameOf(user).trim();
    if (!name) return "?";
    var parts = name.split(/\s+/);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  function avatarTone(seed) {
    var text = String(seed || "");
    var hash = 0;
    for (var i = 0; i < text.length; i += 1) hash = ((hash << 5) - hash) + text.charCodeAt(i);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  function avatarNode(user, sizeClass) {
    var wrap = el("span", "avatar" + (sizeClass ? " " + sizeClass : ""));
    if (user && user.avatarUrl) {
      var img = el("img");
      img.src = user.avatarUrl;
      img.alt = "";
      wrap.appendChild(img);
    } else {
      wrap.style.background = avatarTone(displayNameOf(user) || (user && user.id) || "");
      wrap.textContent = initialsOf(user);
    }
    return wrap;
  }

  function roleBadge(role) {
    var badge = el("span", "role-badge role-" + (role || "editor"));
    badge.innerHTML = role === "admin"
      ? "<svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M8 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12.3 3.8 14.5l.8-4.7L1.2 6.5l4.7-.7L8 1.5z\"/></svg>"
      : "<svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M8 1.8A3.2 3.2 0 1 1 8 8.2 3.2 3.2 0 0 1 8 1.8zm0 7.3c2.7 0 5 1.4 5 3.1v1H3v-1c0-1.7 2.3-3.1 5-3.1z\"/></svg>";
    badge.appendChild(document.createTextNode(roleLabel[role] || role || ""));
    return badge;
  }

  function statusPill(kind, label) {
    var pill = el("span", "status-pill status-" + (kind || "default"));
    pill.textContent = label || "";
    return pill;
  }

  function formatDateTime(value) {
    if (!value) return "尚未登入";
    return new Date(value).toLocaleString("zh-Hant", { hour12: false });
  }

  function formatWhen(value) {
    if (!value) return "—";
    return new Date(value).toLocaleString("zh-Hant", { timeZone: "Asia/Taipei", hour12: false });
  }

  function userErrorMessage(code) {
    if (code === "last-admin") return "不能刪除或降級最後一個管理者。";
    if (code === "exists") return "這個帳號已經存在。";
    if (code === "password") return "密碼至少需要 8 碼。";
    if (code === "self") return "不能刪除目前登入的帳號。";
    if (code === "size") return "圖片太大，請選 2MB 以內的檔案。";
    if (code === "type") return "只接受 JPEG、PNG、WebP 或 GIF。";
    if (code === "media") return "媒體儲存尚未就緒。";
    if (code === "file") return "請先選擇圖片。";
    return "操作失敗，請稍後再試。";
  }

  function applyRoleUi() {
    var isAdmin = me.role === "admin";
    document.querySelectorAll("[data-admin-only]").forEach(function (node) {
      node.hidden = !isAdmin;
    });
    whoami.textContent = "";
    whoami.appendChild(avatarNode(me, "avatar-sm"));
    var meta = el("span", "whoami-meta");
    meta.appendChild(el("strong", "", displayNameOf(me)));
    meta.appendChild(el("span", "whoami-user", "@" + me.username));
    whoami.appendChild(meta);
    whoami.appendChild(roleBadge(me.role));
  }

  function loadVisibleColumns(storageKey, columns, currentKeys) {
    try {
      var raw = localStorage.getItem(storageKey);
      if (!raw) return currentKeys;
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return currentKeys;
      var allowed = {};
      columns.forEach(function (col) { allowed[col.key] = true; });
      var next = parsed.filter(function (key) { return allowed[key]; });
      return next.length ? next : currentKeys;
    } catch (err) {
      return currentKeys;
    }
  }

  function saveVisibleColumns(storageKey, keys) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(keys));
    } catch (err) { /* ignore quota */ }
  }

  function visibleColumnsOf(columns, visibleKeys) {
    return columns.filter(function (col) {
      return visibleKeys.indexOf(col.key) !== -1;
    });
  }

  function renderColumnPanel(panelEl, columns, getKeys, setKeys, storageKey, onChange) {
    if (!panelEl) return;
    panelEl.textContent = "";
    columns.forEach(function (col) {
      var label = el("label", "col-settings-item");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = getKeys().indexOf(col.key) !== -1;
      input.addEventListener("change", function () {
        var keys = getKeys().slice();
        if (input.checked) {
          if (keys.indexOf(col.key) === -1) keys.push(col.key);
        } else {
          if (keys.length <= 1) {
            input.checked = true;
            return;
          }
          keys = keys.filter(function (key) { return key !== col.key; });
        }
        setKeys(keys);
        saveVisibleColumns(storageKey, keys);
        onChange();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(col.label));
      panelEl.appendChild(label);
    });
  }

  function setColPanelOpen(panelEl, buttonEl, open) {
    if (!panelEl || !buttonEl) return;
    panelEl.hidden = !open;
    buttonEl.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function bindColSettingsToggle(buttonEl, panelEl) {
    if (!buttonEl || !panelEl) return;
    buttonEl.addEventListener("click", function (event) {
      event.stopPropagation();
      setColPanelOpen(panelEl, buttonEl, panelEl.hidden);
    });
    document.addEventListener("click", function (event) {
      if (!panelEl.hidden && !panelEl.contains(event.target) && event.target !== buttonEl) {
        setColPanelOpen(panelEl, buttonEl, false);
      }
    });
  }

  function compareSortValues(av, bv, sortType, dir) {
    if (sortType === "date" || sortType === "number") {
      return (Number(av) - Number(bv)) * dir;
    }
    av = String(av == null ? "" : av).toLowerCase();
    bv = String(bv == null ? "" : bv).toLowerCase();
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  }

  function bindSortableTh(th, sortBy, sortDir, colKey, onSort) {
    th.setAttribute("role", "button");
    th.tabIndex = 0;
    if (sortBy === colKey) {
      th.classList.add(sortDir === "asc" ? "sort-asc" : "sort-desc");
      th.setAttribute("aria-sort", sortDir === "asc" ? "ascending" : "descending");
    }
    th.addEventListener("click", onSort);
    th.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSort();
      }
    });
  }

  function renderPager(pagerEl, total, page, pageSize, onPage) {
    if (!pagerEl) return page;
    pagerEl.textContent = "";
    var pagesCount = Math.max(1, Math.ceil(total / pageSize));
    var current = page;
    if (current > pagesCount) current = pagesCount;
    var info = el("span", "muted", "共 " + total + " 筆，第 " + current + " / " + pagesCount + " 頁");
    pagerEl.appendChild(info);
    var prev = el("button", "ghost", "上一頁");
    prev.type = "button";
    prev.disabled = current <= 1;
    prev.addEventListener("click", function () { onPage(current - 1); });
    var next = el("button", "ghost", "下一頁");
    next.type = "button";
    next.disabled = current >= pagesCount;
    next.addEventListener("click", function () { onPage(current + 1); });
    pagerEl.appendChild(prev);
    pagerEl.appendChild(next);
    return current;
  }

  function appendActionButtons(parent, opts) {
    if (opts.onEdit) {
      var edit = el("button", "btn-icon edit");
      edit.type = "button";
      edit.title = "編輯";
      edit.setAttribute("aria-label", "編輯");
      edit.innerHTML = ICON_EDIT;
      edit.addEventListener("click", opts.onEdit);
      parent.appendChild(edit);
    }
    if (opts.openHref) {
      var open = el("a", "btn-icon open");
      open.href = opts.openHref;
      open.target = "_blank";
      open.rel = "noopener";
      open.title = "開啟";
      open.setAttribute("aria-label", "開啟");
      open.innerHTML = ICON_OPEN;
      parent.appendChild(open);
    }
    if (opts.onDelete) {
      var remove = el("button", "btn-icon delete");
      remove.type = "button";
      remove.title = opts.deleteTitle || "刪除";
      remove.setAttribute("aria-label", "刪除");
      remove.disabled = !!opts.deleteDisabled;
      remove.addEventListener("click", opts.onDelete);
      remove.innerHTML = ICON_DELETE;
      parent.appendChild(remove);
    }
    return parent;
  }

  function bindAvatarPreview(form) {
    var fileInput = form.querySelector("[name=avatarFile]");
    var preview = form.querySelector("[data-avatar-preview]");
    var clearBtn = form.querySelector("[data-clear-avatar]");
    var clearInput = form.querySelector("[name=clearAvatar]");
    if (!fileInput || !preview) return;
    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (clearInput) clearInput.value = "";
      var url = URL.createObjectURL(file);
      preview.textContent = "";
      preview.style.background = "";
      var img = el("img");
      img.src = url;
      img.alt = "";
      preview.appendChild(img);
    });
    if (clearBtn && clearInput) {
      clearBtn.addEventListener("click", function () {
        clearInput.value = "1";
        fileInput.value = "";
        preview.textContent = "";
        preview.style.background = avatarTone(displayNameOf(me));
        preview.textContent = initialsOf({
          displayName: fieldValue(form, "displayName") || displayNameOf(modalTarget || me),
          username: fieldValue(form, "username") || (modalTarget && modalTarget.username) || me.username
        });
      });
    }
  }

  function avatarFieldHtml(user) {
    return "<div class=\"avatar-field\">" +
      "<span class=\"avatar avatar-lg\" data-avatar-preview></span>" +
      "<div class=\"avatar-field-actions\">" +
      "<label class=\"file-label\">上傳頭像<input name=\"avatarFile\" type=\"file\" accept=\"image/jpeg,image/png,image/webp,image/gif\"></label>" +
      "<button type=\"button\" class=\"ghost\" data-clear-avatar>移除頭像</button>" +
      "<input type=\"hidden\" name=\"clearAvatar\" value=\"\">" +
      "<p class=\"muted tiny\">可選 JPEG／PNG／WebP／GIF，最大 2MB。" + (user && user.avatarUrl ? "" : "未上傳時會顯示縮寫頭像。") + "</p>" +
      "</div></div>";
  }

  function fillAvatarPreview(form, user) {
    var preview = form.querySelector("[data-avatar-preview]");
    if (!preview) return;
    if (user && user.avatarUrl) {
      var img = el("img");
      img.src = user.avatarUrl;
      img.alt = "";
      preview.appendChild(img);
    } else {
      preview.style.background = avatarTone(displayNameOf(user || me));
      preview.textContent = initialsOf(user || me);
    }
  }

  function enquiryName(row) {
    return ((row.lastName || "") + " " + (row.firstName || "")).trim();
  }

  function enquiryServicesText(row) {
    return (row.services || []).map(function (id) { return serviceLabel[id] || id; }).join("、");
  }

  function enquirySortValue(row, key) {
    if (key === "name") return enquiryName(row);
    if (key === "services") return enquiryServicesText(row);
    if (key === "status") return statusLabel[row.status] || row.status || "";
    if (key === "createdAt") return Number(row.createdAt) || 0;
    return row[key] == null ? "" : row[key];
  }

  function filteredEnquiries() {
    var q = (enquirySearch.value || "").trim().toLowerCase();
    var rows = enquiries.filter(function (row) {
      if (!q) return true;
      var blob = [
        row.firstName, row.lastName, row.company, row.email, row.phone,
        row.country, enquiryServicesText(row), row.message, row.locale,
        statusLabel[row.status] || row.status
      ].join(" ").toLowerCase();
      return blob.indexOf(q) !== -1;
    });
    var col = ENQUIRY_COLUMNS.find(function (item) { return item.key === enquirySortBy; });
    var sortType = col ? col.sortType : "string";
    var dir = enquirySortDir === "asc" ? 1 : -1;
    rows.sort(function (a, b) {
      return compareSortValues(
        enquirySortValue(a, enquirySortBy),
        enquirySortValue(b, enquirySortBy),
        sortType,
        dir
      );
    });
    return rows;
  }

  function renderEnquiryCell(row, key) {
    if (key === "createdAt") return el("td", "", formatWhen(row.createdAt));
    if (key === "name") return el("td", "", enquiryName(row));
    if (key === "company") return el("td", "", row.company || "");
    if (key === "email") return el("td", "", row.email || "");
    if (key === "status") {
      var td = el("td");
      td.appendChild(statusPill(row.status || "new", statusLabel[row.status] || row.status || ""));
      return td;
    }
    if (key === "phone") return el("td", "", row.phone || "");
    if (key === "country") return el("td", "", row.country || "未填");
    if (key === "services") return el("td", "", enquiryServicesText(row) || "未填");
    if (key === "locale") return el("td", "", row.locale || "");
    return el("td", "", "");
  }

  function detailLine(label, value) {
    var p = el("p");
    p.appendChild(el("strong", "", label));
    p.appendChild(document.createTextNode(" " + value));
    return p;
  }

  function enquiryForm(row) {
    var form = el("form", "modal-form");
    var serviceChecks = Object.keys(serviceLabel).map(function (id) {
      return "<label class=\"check\"><input type=\"checkbox\" name=\"services\" value=\"" + id + "\"> " + serviceLabel[id] + "</label>";
    }).join("");
    form.innerHTML =
      "<label>名<input name=\"firstName\" required maxlength=\"80\"></label>" +
      "<label>姓<input name=\"lastName\" required maxlength=\"80\"></label>" +
      "<label>公司<input name=\"company\" required maxlength=\"160\"></label>" +
      "<label>電子郵件<input name=\"email\" type=\"email\" required maxlength=\"160\"></label>" +
      "<label>電話<input name=\"phone\" required maxlength=\"40\"></label>" +
      "<label>國家<input name=\"country\" maxlength=\"80\" placeholder=\"可留空\"></label>" +
      "<fieldset><legend>服務</legend><div class=\"check-row\">" + serviceChecks + "</div></fieldset>" +
      "<label>訊息<textarea name=\"message\" rows=\"5\" maxlength=\"4000\"></textarea></label>" +
      "<label>語系<select name=\"locale\">" +
      "<option value=\"zh-tw\">繁體中文</option><option value=\"en\">English</option>" +
      "<option value=\"ja\">日本語</option><option value=\"vi\">Tiếng Việt</option></select></label>" +
      "<label>狀態<select name=\"status\">" +
      "<option value=\"new\">新進</option><option value=\"read\">已讀</option><option value=\"archived\">已封存</option>" +
      "</select></label>";
    if (row) {
      if (row.createdAt) {
        form.insertBefore(detailLine("時間", formatWhen(row.createdAt)), form.firstChild);
      }
      form.querySelector("[name=firstName]").value = row.firstName || "";
      form.querySelector("[name=lastName]").value = row.lastName || "";
      form.querySelector("[name=company]").value = row.company || "";
      form.querySelector("[name=email]").value = row.email || "";
      form.querySelector("[name=phone]").value = row.phone || "";
      form.querySelector("[name=country]").value = row.country || "";
      form.querySelector("[name=message]").value = row.message || "";
      form.querySelector("[name=locale]").value = row.locale || "zh-tw";
      form.querySelector("[name=status]").value = row.status || "new";
      var selected = Array.isArray(row.services) ? row.services : [];
      form.querySelectorAll("[name=services]").forEach(function (input) {
        input.checked = selected.indexOf(input.value) !== -1;
      });
    }
    return form;
  }

  function enquiryPayload(form) {
    var services = [];
    form.querySelectorAll("[name=services]:checked").forEach(function (input) {
      services.push(input.value);
    });
    return {
      firstName: fieldValue(form, "firstName"),
      lastName: fieldValue(form, "lastName"),
      company: fieldValue(form, "company"),
      email: fieldValue(form, "email"),
      phone: fieldValue(form, "phone"),
      country: fieldValue(form, "country"),
      services: services,
      message: fieldValue(form, "message"),
      locale: fieldValue(form, "locale"),
      status: fieldValue(form, "status")
    };
  }

  function renderEnquiries() {
    listEl.textContent = "";
    var rows = filteredEnquiries();
    var pageSize = Number(enquiryPageSize.value) || 20;
    var columns = visibleColumnsOf(ENQUIRY_COLUMNS, enquiryVisibleKeys);
    enquiryPage = renderPager(enquiryPager, rows.length, enquiryPage, pageSize, function (next) {
      enquiryPage = next;
      renderEnquiries();
    });
    if (!rows.length) {
      listEl.appendChild(el("p", "muted", "目前沒有詢問。"));
      return;
    }
    var start = (enquiryPage - 1) * pageSize;
    var slice = rows.slice(start, start + pageSize);
    var table = el("table", "grid");
    var head = el("tr");
    columns.forEach(function (col) {
      var th = el("th", col.sortable ? "sortable" : "", col.label);
      if (col.sortable) {
        bindSortableTh(th, enquirySortBy, enquirySortDir, col.key, function () {
          if (enquirySortBy === col.key) {
            enquirySortDir = enquirySortDir === "asc" ? "desc" : "asc";
          } else {
            enquirySortBy = col.key;
            enquirySortDir = "asc";
          }
          enquiryPage = 1;
          renderEnquiries();
        });
      }
      head.appendChild(th);
    });
    head.appendChild(el("th", "actions-col", "操作"));
    table.appendChild(head);
    slice.forEach(function (row) {
      var tr = el("tr");
      columns.forEach(function (col) {
        tr.appendChild(renderEnquiryCell(row, col.key));
      });
      var actions = el("td", "row-actions");
      appendActionButtons(actions, {
        onEdit: function () {
          openModal("編輯詢問", enquiryForm(row), "enquiry-edit", row);
        },
        onDelete: function () {
          if (!window.confirm("刪除這筆詢問？")) return;
          api("/api/admin/enquiries/" + row.id, { method: "DELETE" }).then(loadEnquiries);
        }
      });
      tr.appendChild(actions);
      table.appendChild(tr);
    });
    listEl.appendChild(table);
  }

  function loadEnquiries() {
    var status = filter.value;
    var path = "/api/admin/enquiries" + (status ? "?status=" + encodeURIComponent(status) : "");
    listEl.textContent = "讀取中";
    api(path).then(function (data) {
      enquiries = data.enquiries || [];
      enquiryPage = 1;
      renderEnquiries();
    }).catch(function () {
      listEl.textContent = "詢問清單讀取失敗。";
    });
  }

  function renderFields() {
    fieldsEl.textContent = "";
    var group = groups.find(function (item) { return item.id === pageSelect.value; });
    if (!group) return;
    var q = (contentSearch.value || "").trim().toLowerCase();
    group.fields.forEach(function (field) {
      if (q) {
        var hay = (field.label + " " + field.key).toLowerCase();
        if (hay.indexOf(q) === -1) return;
      }
      var wrap = el("label", "cms-field");
      var title = el("span", "", field.label);
      if (field.custom) title.appendChild(el("em", "", " 已改"));
      wrap.appendChild(title);
      wrap.appendChild(el("small", "muted", field.key));
      var area = document.createElement("textarea");
      area.value = field.value;
      area.dataset.key = field.key;
      area.dataset.base = field.base || "";
      area.addEventListener("input", function () { setDirty(true); });
      wrap.appendChild(area);
      var reset = el("button", "ghost", "恢復這段預設");
      reset.type = "button";
      reset.addEventListener("click", function () {
        area.value = area.dataset.base || "";
        setDirty(true);
      });
      wrap.appendChild(reset);
      fieldsEl.appendChild(wrap);
    });
    if (!fieldsEl.children.length) fieldsEl.appendChild(el("p", "muted", "沒有符合的欄位。"));
  }

  function loadContent() {
    contentStatus.textContent = "";
    api("/api/admin/content?locale=" + encodeURIComponent(localeSelect.value)).then(function (data) {
      groups = data.groups || [];
      var current = pageSelect.value;
      pageSelect.textContent = "";
      groups.forEach(function (group) {
        var option = el("option", "", group.label);
        option.value = group.id;
        pageSelect.appendChild(option);
      });
      if (current && groups.some(function (group) { return group.id === current; })) pageSelect.value = current;
      contentDirty = false;
      renderFields();
    }).catch(function () {
      contentStatus.textContent = "文案讀取失敗。";
    });
  }

  function filteredMedia() {
    var q = ((mediaSearch && mediaSearch.value) || "").trim().toLowerCase();
    if (!q) return mediaItems.slice();
    return mediaItems.filter(function (item) {
      var blob = [item.filename, item.key, item.url].join(" ").toLowerCase();
      return blob.indexOf(q) !== -1;
    });
  }

  function renderMedia() {
    mediaList.textContent = "";
    var items = filteredMedia();
    if (!mediaItems.length) {
      mediaList.appendChild(el("p", "muted", "尚未上傳圖片。"));
      return;
    }
    if (!items.length) {
      mediaList.appendChild(el("p", "muted", "沒有符合搜尋條件的圖片。"));
      return;
    }
    items.forEach(function (item) {
      var card = el("article", "media-card");
      var img = document.createElement("img");
      img.src = item.url;
      img.alt = item.filename;
      card.appendChild(img);
      card.appendChild(el("p", "", item.filename));
      card.appendChild(el("p", "muted", Math.round(item.size / 1024) + " KB"));
      var actions = el("div", "row-actions");
      var copy = el("button", "ghost", "複製網址");
      copy.type = "button";
      copy.addEventListener("click", function () {
        var absolute = location.origin + item.url;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(absolute).then(function () {
            mediaStatus.textContent = "已複製網址。";
          }).catch(function () {
            window.prompt("複製網址", absolute);
          });
        } else {
          window.prompt("複製網址", absolute);
        }
      });
      var remove = el("button", "btn-icon delete");
      remove.type = "button";
      remove.title = "刪除";
      remove.setAttribute("aria-label", "刪除");
      remove.innerHTML = ICON_DELETE;
      remove.addEventListener("click", function () {
        if (!window.confirm("刪除這張圖片？")) return;
        api("/api/admin/media/" + item.id, { method: "DELETE" }).then(loadMedia);
      });
      actions.appendChild(copy);
      actions.appendChild(remove);
      card.appendChild(actions);
      mediaList.appendChild(card);
    });
  }

  function loadMedia() {
    mediaStatus.textContent = "";
    api("/api/admin/media").then(function (data) {
      mediaItems = data.media || [];
      renderMedia();
    }).catch(function () {
      mediaStatus.textContent = "媒體清單讀取失敗。";
    });
  }

  function pageSortValue(page, key) {
    if (key === "status") return pageStatusLabel[page.status] || page.status || "";
    if (key === "updatedAt") return Number(page.updatedAt) || 0;
    return page[key] == null ? "" : page[key];
  }

  function filteredPages() {
    var q = (pageSearch.value || "").trim().toLowerCase();
    var status = pageStatusFilter.value;
    var rows = pages.filter(function (page) {
      if (status && page.status !== status) return false;
      if (!q) return true;
      return (page.title + " " + page.slug + " " + page.locale + " " + (pageStatusLabel[page.status] || "")).toLowerCase().indexOf(q) !== -1;
    });
    var col = PAGE_COLUMNS.find(function (item) { return item.key === pageSortBy; });
    var sortType = col ? col.sortType : "string";
    var dir = pageSortDir === "asc" ? 1 : -1;
    rows.sort(function (a, b) {
      return compareSortValues(pageSortValue(a, pageSortBy), pageSortValue(b, pageSortBy), sortType, dir);
    });
    return rows;
  }

  function renderPageCell(page, key) {
    if (key === "title") return el("td", "", page.title || "");
    if (key === "locale") return el("td", "", page.locale || "");
    if (key === "slug") return el("td", "", page.slug || "");
    if (key === "status") {
      var td = el("td");
      td.appendChild(statusPill(page.status || "draft", pageStatusLabel[page.status] || page.status || ""));
      return td;
    }
    if (key === "updatedAt") return el("td", "", formatWhen(page.updatedAt));
    return el("td", "", "");
  }

  function pageForm(page) {
    var form = el("form", "modal-form");
    form.innerHTML =
      "<label>語系<select name=\"locale\">" +
      "<option value=\"zh-tw\">繁體中文</option><option value=\"en\">English</option>" +
      "<option value=\"ja\">日本語</option><option value=\"vi\">Tiếng Việt</option></select></label>" +
      "<label>Slug<input name=\"slug\" required pattern=\"[a-z0-9-]+\" placeholder=\"news-launch\"></label>" +
      "<label>標題<input name=\"title\" required maxlength=\"200\"></label>" +
      "<label>內文<textarea name=\"body\" rows=\"8\"></textarea></label>" +
      "<label>封面媒體 key<input name=\"coverKey\" placeholder=\"可留空，或貼上媒體 key\"></label>" +
      "<label>狀態<select name=\"status\"><option value=\"draft\">草稿</option><option value=\"published\">已發布</option></select></label>";
    if (page) {
      form.querySelector("[name=locale]").value = page.locale;
      form.querySelector("[name=slug]").value = page.slug;
      form.querySelector("[name=title]").value = page.title;
      form.querySelector("[name=body]").value = page.body || "";
      form.querySelector("[name=coverKey]").value = page.coverKey || "";
      form.querySelector("[name=status]").value = page.status;
    }
    return form;
  }

  function renderPages() {
    pageList.textContent = "";
    var rows = filteredPages();
    var pageSize = Number(pagePageSize && pagePageSize.value) || 20;
    var columns = visibleColumnsOf(PAGE_COLUMNS, pageVisibleKeys);
    pagePage = renderPager(pagePager, rows.length, pagePage, pageSize, function (next) {
      pagePage = next;
      renderPages();
    });
    if (!rows.length) {
      pageList.appendChild(el("p", "muted", "目前沒有動態頁面。"));
      return;
    }
    var start = (pagePage - 1) * pageSize;
    var slice = rows.slice(start, start + pageSize);
    var table = el("table", "grid");
    var head = el("tr");
    columns.forEach(function (col) {
      var th = el("th", col.sortable ? "sortable" : "", col.label);
      if (col.sortable) {
        bindSortableTh(th, pageSortBy, pageSortDir, col.key, function () {
          if (pageSortBy === col.key) {
            pageSortDir = pageSortDir === "asc" ? "desc" : "asc";
          } else {
            pageSortBy = col.key;
            pageSortDir = "asc";
          }
          pagePage = 1;
          renderPages();
        });
      }
      head.appendChild(th);
    });
    head.appendChild(el("th", "actions-col", "操作"));
    table.appendChild(head);
    slice.forEach(function (page) {
      var tr = el("tr");
      columns.forEach(function (col) {
        tr.appendChild(renderPageCell(page, col.key));
      });
      var actions = el("td", "row-actions");
      appendActionButtons(actions, {
        onEdit: function () {
          openModal("編輯頁面", pageForm(page), "page-edit", page);
        },
        openHref: page.path,
        onDelete: function () {
          if (!window.confirm("刪除這個頁面？")) return;
          api("/api/admin/pages/" + page.id, { method: "DELETE" }).then(loadPages);
        }
      });
      tr.appendChild(actions);
      table.appendChild(tr);
    });
    pageList.appendChild(table);
  }

  function loadPages() {
    api("/api/admin/pages").then(function (data) {
      pages = data.pages || [];
      pagePage = 1;
      renderPages();
    }).catch(function () {
      pageList.textContent = "頁面清單讀取失敗。";
    });
  }

  function userForm(user) {
    var form = el("form", "modal-form");
    form.innerHTML =
      avatarFieldHtml(user) +
      "<label>顯示名稱<input name=\"displayName\" maxlength=\"80\" autocomplete=\"nickname\" placeholder=\"例如：小明\"></label>" +
      "<label>帳號<input name=\"username\" required maxlength=\"64\" autocomplete=\"off\"></label>" +
      "<label>密碼<input name=\"password\" type=\"password\" " + (user ? "" : "required ") + "minlength=\"8\" autocomplete=\"new-password\" placeholder=\"" + (user ? "留空則不修改" : "至少 8 碼") + "\"></label>" +
      "<label>角色<select name=\"role\"><option value=\"editor\">編輯者</option><option value=\"admin\">管理者</option></select></label>";
    if (user) {
      form.querySelector("[name=displayName]").value = user.displayName || "";
      form.querySelector("[name=username]").value = user.username;
      form.querySelector("[name=role]").value = user.role;
    }
    fillAvatarPreview(form, user);
    bindAvatarPreview(form);
    return form;
  }

  function profileForm() {
    var form = el("form", "modal-form");
    form.innerHTML =
      avatarFieldHtml(me) +
      "<label>顯示名稱<input name=\"displayName\" maxlength=\"80\" autocomplete=\"nickname\" placeholder=\"例如：小明\"></label>" +
      "<label>帳號<input name=\"username\" disabled></label>" +
      "<label>新密碼<input name=\"password\" type=\"password\" minlength=\"8\" autocomplete=\"new-password\" placeholder=\"留空則不修改\"></label>" +
      "<p class=\"muted tiny\">帳號與角色由管理者設定；你可以更新顯示名稱、密碼與頭像。</p>";
    form.querySelector("[name=displayName]").value = me.displayName || "";
    form.querySelector("[name=username]").value = me.username;
    fillAvatarPreview(form, me);
    bindAvatarPreview(form);
    return form;
  }

  function userSortValue(user, key) {
    if (key === "displayName") return displayNameOf(user);
    if (key === "role") return roleLabel[user.role] || user.role || "";
    if (key === "lastLoginAt" || key === "createdAt") return Number(user[key]) || 0;
    return user[key] == null ? "" : user[key];
  }

  function filteredUsers() {
    var q = ((userSearch && userSearch.value) || "").trim().toLowerCase();
    var role = (userRoleFilter && userRoleFilter.value) || "";
    var rows = users.filter(function (user) {
      if (role && user.role !== role) return false;
      if (!q) return true;
      var blob = [
        user.username,
        user.displayName,
        roleLabel[user.role] || user.role
      ].join(" ").toLowerCase();
      return blob.indexOf(q) !== -1;
    });
    var col = USER_COLUMNS.find(function (item) { return item.key === userSortBy; });
    var sortType = col ? col.sortType : "string";
    var dir = userSortDir === "asc" ? 1 : -1;
    rows.sort(function (a, b) {
      return compareSortValues(userSortValue(a, userSortBy), userSortValue(b, userSortBy), sortType, dir);
    });
    return rows;
  }

  function renderUserCell(user, key) {
    if (key === "username") {
      var tdUser = el("td");
      var wrap = el("div", "user-cell");
      wrap.appendChild(avatarNode(user, "avatar-sm"));
      var meta = el("div", "user-cell-meta");
      meta.appendChild(el("strong", "", "@" + (user.username || "")));
      if (Number(user.id) === Number(me.id)) meta.appendChild(el("span", "you-chip", "你"));
      wrap.appendChild(meta);
      tdUser.appendChild(wrap);
      return tdUser;
    }
    if (key === "displayName") return el("td", "", displayNameOf(user));
    if (key === "role") {
      var tdRole = el("td");
      tdRole.appendChild(roleBadge(user.role));
      return tdRole;
    }
    if (key === "lastLoginAt") return el("td", "", formatDateTime(user.lastLoginAt));
    if (key === "createdAt") return el("td", "", formatWhen(user.createdAt));
    return el("td", "", "");
  }

  function renderUsers() {
    userList.textContent = "";
    if (!users.length) {
      var empty = el("div", "empty-state");
      empty.innerHTML =
        "<div class=\"empty-art\" aria-hidden=\"true\">" +
        "<svg viewBox=\"0 0 160 100\" width=\"160\" height=\"100\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
        "<rect x=\"20\" y=\"28\" width=\"48\" height=\"48\" rx=\"24\" fill=\"#d5e0ea\"/>" +
        "<rect x=\"56\" y=\"20\" width=\"56\" height=\"56\" rx=\"28\" fill=\"#6ed4d0\"/>" +
        "<rect x=\"96\" y=\"28\" width=\"48\" height=\"48\" rx=\"24\" fill=\"#9ec5d8\"/>" +
        "<circle cx=\"44\" cy=\"46\" r=\"8\" fill=\"#0a1b33\" opacity=\".25\"/>" +
        "<circle cx=\"84\" cy=\"42\" r=\"10\" fill=\"#0a1b33\" opacity=\".45\"/>" +
        "<circle cx=\"120\" cy=\"46\" r=\"8\" fill=\"#0a1b33\" opacity=\".25\"/>" +
        "</svg></div>" +
        "<h2>還沒有其他隊友</h2>" +
        "<p class=\"muted\">新增管理者或編輯者，讓多人一起維護詢價、文案與媒體。</p>";
      var cta = el("button", "button", "新增第一位隊友");
      cta.type = "button";
      cta.addEventListener("click", function () {
        openModal("新增使用者", userForm(null), "user-create", null);
      });
      empty.appendChild(cta);
      userList.appendChild(empty);
      if (userPager) userPager.textContent = "";
      return;
    }

    var list = filteredUsers();
    var pageSize = Number(userPageSize && userPageSize.value) || 20;
    var columns = visibleColumnsOf(USER_COLUMNS, userVisibleKeys);
    userPage = renderPager(userPager, list.length, userPage, pageSize, function (next) {
      userPage = next;
      renderUsers();
    });
    if (!list.length) {
      userList.appendChild(el("p", "muted", "沒有符合搜尋條件的使用者。"));
      return;
    }

    var start = (userPage - 1) * pageSize;
    var slice = list.slice(start, start + pageSize);
    var table = el("table", "grid");
    var head = el("tr");
    columns.forEach(function (col) {
      var th = el("th", col.sortable ? "sortable" : "", col.label);
      if (col.sortable) {
        bindSortableTh(th, userSortBy, userSortDir, col.key, function () {
          if (userSortBy === col.key) {
            userSortDir = userSortDir === "asc" ? "desc" : "asc";
          } else {
            userSortBy = col.key;
            userSortDir = "asc";
          }
          userPage = 1;
          renderUsers();
        });
      }
      head.appendChild(th);
    });
    head.appendChild(el("th", "actions-col", "操作"));
    table.appendChild(head);
    slice.forEach(function (user) {
      var tr = el("tr");
      if (Number(user.id) === Number(me.id)) tr.classList.add("is-me");
      columns.forEach(function (col) {
        tr.appendChild(renderUserCell(user, col.key));
      });
      var isSelf = Number(user.id) === Number(me.id);
      var actions = el("td", "row-actions");
      appendActionButtons(actions, {
        onEdit: function () {
          openModal("編輯使用者", userForm(user), "user-edit", user);
        },
        onDelete: function () {
          if (!window.confirm("刪除使用者 " + displayNameOf(user) + "（@" + user.username + "）？")) return;
          api("/api/admin/users/" + user.id, { method: "DELETE" }).then(loadUsers).catch(function (err) {
            window.alert(userErrorMessage(err.code));
          });
        },
        deleteDisabled: isSelf,
        deleteTitle: isSelf ? "不能刪除自己的帳號" : "刪除"
      });
      tr.appendChild(actions);
      table.appendChild(tr);
    });
    userList.appendChild(table);
  }

  function loadUsers() {
    if (me.role !== "admin") return;
    api("/api/admin/users").then(function (data) {
      users = data.users || [];
      userPage = 1;
      renderUsers();
    }).catch(function () {
      userList.textContent = "使用者清單讀取失敗。";
    });
  }

  function uploadAvatarIfNeeded(form, userId) {
    var fileInput = form.querySelector("[name=avatarFile]");
    var file = fileInput && fileInput.files && fileInput.files[0];
    if (!file) return Promise.resolve(null);
    var body = new FormData();
    body.append("file", file);
    if (userId != null) body.append("userId", String(userId));
    return api("/api/admin/avatar", { method: "POST", body: body });
  }

  function refreshMeFrom(user) {
    if (!user) return;
    me = {
      id: user.id,
      username: user.username,
      role: user.role || "editor",
      displayName: user.displayName || "",
      avatarUrl: user.avatarUrl || "",
      avatarKey: user.avatarKey || "",
      lastLoginAt: user.lastLoginAt || null,
      createdAt: user.createdAt
    };
    applyRoleUi();
  }

  function saveModal() {
    var form = modalBody.querySelector("form");
    if (!form) return;
    modalStatus.textContent = "儲存中";
    if (modalMode === "enquiry-create" || modalMode === "enquiry-edit") {
      var enquiryBody = enquiryPayload(form);
      var enquiryReq = modalMode === "enquiry-create"
        ? api("/api/admin/enquiries", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(enquiryBody)
          })
        : api("/api/admin/enquiries/" + modalTarget.id, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(enquiryBody)
          });
      enquiryReq.then(function () {
        closeModal();
        loadEnquiries();
      }).catch(function () {
        modalStatus.textContent = "儲存失敗，請檢查必填欄位與格式。";
      });
      return;
    }
    if (modalMode === "page-create" || modalMode === "page-edit") {
      var payload = {
        locale: fieldValue(form, "locale"),
        slug: fieldValue(form, "slug"),
        title: fieldValue(form, "title"),
        body: fieldValue(form, "body"),
        coverKey: fieldValue(form, "coverKey"),
        status: fieldValue(form, "status")
      };
      var pageReq = modalMode === "page-create"
        ? api("/api/admin/pages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
        : api("/api/admin/pages/" + modalTarget.id, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      pageReq.then(function () {
        closeModal();
        loadPages();
      }).catch(function (err) {
        modalStatus.textContent = err.code === "exists" ? "同一語系的 slug 已存在。" : "儲存失敗。";
      });
      return;
    }
    if (modalMode === "user-create" || modalMode === "user-edit") {
      var password = fieldValue(form, "password");
      var clearAvatar = fieldValue(form, "clearAvatar") === "1";
      var userPayload = {
        username: fieldValue(form, "username"),
        displayName: fieldValue(form, "displayName"),
        role: fieldValue(form, "role")
      };
      if (password) userPayload.password = password;
      if (clearAvatar) userPayload.clearAvatar = true;
      if (modalMode === "user-edit" && modalTarget && modalTarget.role === "admin" && userPayload.role !== "admin") {
        var adminCount = users.filter(function (item) { return item.role === "admin"; }).length;
        if (adminCount <= 1) {
          modalStatus.textContent = userErrorMessage("last-admin");
          return;
        }
      }
      var userReq = modalMode === "user-create"
        ? api("/api/admin/users", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(Object.assign({ password: password }, userPayload))
          })
        : api("/api/admin/users/" + modalTarget.id, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userPayload)
          });
      userReq.then(function (data) {
        var saved = data && data.user;
        var targetId = saved ? saved.id : (modalTarget && modalTarget.id);
        return uploadAvatarIfNeeded(form, targetId).then(function (avatarData) {
          if (avatarData && avatarData.user && Number(avatarData.user.id) === Number(me.id)) {
            refreshMeFrom(avatarData.user);
          } else if (saved && Number(saved.id) === Number(me.id)) {
            refreshMeFrom(Object.assign({}, me, saved));
          }
          closeModal();
          loadUsers();
        });
      }).catch(function (err) {
        modalStatus.textContent = userErrorMessage(err.code);
      });
      return;
    }

    if (modalMode === "profile-edit") {
      var profilePassword = fieldValue(form, "password");
      var profilePayload = {
        displayName: fieldValue(form, "displayName")
      };
      if (profilePassword) profilePayload.password = profilePassword;
      if (fieldValue(form, "clearAvatar") === "1") profilePayload.clearAvatar = true;
      api("/api/admin/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(profilePayload)
      }).then(function (data) {
        refreshMeFrom(data.user || data);
        return uploadAvatarIfNeeded(form, me.id).then(function (avatarData) {
          if (avatarData && avatarData.user) refreshMeFrom(avatarData.user);
          closeModal();
          if (me.role === "admin") loadUsers();
        });
      }).catch(function (err) {
        modalStatus.textContent = userErrorMessage(err.code);
      });
    }
  }

  document.getElementById("logout").addEventListener("click", function () {
    fetch("/api/logout", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: "{}"
    }).then(function () { location.href = "/admin/login"; });
  });

  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      if (tab.getAttribute("data-tab") !== "content" && contentDirty) {
        if (!window.confirm("文案尚未儲存，確定離開？")) return;
      }
      document.querySelectorAll(".tab").forEach(function (item) { item.classList.remove("on"); });
      document.querySelectorAll(".panel").forEach(function (item) { item.classList.remove("on"); });
      tab.classList.add("on");
      document.getElementById(tab.getAttribute("data-tab")).classList.add("on");
    });
  });

  filter.addEventListener("change", loadEnquiries);
  enquirySearch.addEventListener("input", function () {
    debounce("enquiry", function () {
      enquiryPage = 1;
      renderEnquiries();
    });
  });
  enquiryPageSize.addEventListener("change", function () {
    enquiryPage = 1;
    renderEnquiries();
  });
  if (enquiryReloadBtn) enquiryReloadBtn.addEventListener("click", loadEnquiries);
  bindColSettingsToggle(enquiryColumnsBtn, enquiryColPanel);

  localeSelect.addEventListener("change", function () {
    if (contentDirty && !window.confirm("文案尚未儲存，確定切換語系？")) {
      return;
    }
    loadContent();
  });
  pageSelect.addEventListener("change", function () {
    if (contentDirty && !window.confirm("文案尚未儲存，確定切換頁面？")) return;
    contentDirty = false;
    contentStatus.textContent = "";
    renderFields();
  });
  contentSearch.addEventListener("input", function () {
    debounce("content", renderFields);
  });
  document.getElementById("preview-content").addEventListener("click", function () {
    var prefix = localePrefix[localeSelect.value] || "";
    var path = previewPaths[pageSelect.value] || "/";
    var href = path === "/" ? (prefix || "/") : prefix + path;
    window.open(href, "_blank", "noopener");
  });
  document.getElementById("save-content").addEventListener("click", function () {
    var fields = {};
    fieldsEl.querySelectorAll("textarea").forEach(function (area) {
      fields[area.dataset.key] = area.value;
    });
    contentStatus.textContent = "儲存中";
    api("/api/admin/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: localeSelect.value, fields: fields })
    }).then(function () {
      contentDirty = false;
      contentStatus.textContent = "已儲存。前台重新整理後會看到新文案。";
      loadContent();
    }).catch(function () {
      contentStatus.textContent = "儲存失敗。";
    });
  });

  document.getElementById("media-upload").addEventListener("click", function () {
    var input = document.getElementById("media-file");
    if (!input.files || !input.files[0]) {
      mediaStatus.textContent = "請先選擇圖片。";
      return;
    }
    var body = new FormData();
    body.append("file", input.files[0]);
    mediaStatus.textContent = "上傳中";
    fetch("/api/admin/media", {
      method: "POST",
      headers: { accept: "application/json" },
      body: body
    }).then(function (response) {
      if (response.status === 401) {
        location.href = "/admin/login";
        throw new Error("auth");
      }
      return response.json().then(function (data) {
        if (!response.ok) throw new Error((data && data.error) || "request");
        return data;
      });
    }).then(function () {
      input.value = "";
      mediaStatus.textContent = "上傳成功。";
      loadMedia();
    }).catch(function (err) {
      var msg = "上傳失敗。";
      if (err.message === "size") msg = "檔案太大（上限約 2MB）。";
      if (err.message === "type") msg = "只接受 jpeg／png／webp／gif。";
      mediaStatus.textContent = msg;
    });
  });
  if (mediaSearch) {
    mediaSearch.addEventListener("input", function () {
      debounce("media", renderMedia);
    });
  }
  if (mediaReloadBtn) mediaReloadBtn.addEventListener("click", loadMedia);

  var enquiryCreateBtn = document.getElementById("enquiry-create");
  if (enquiryCreateBtn) {
    enquiryCreateBtn.addEventListener("click", function () {
      openModal("新增詢問", enquiryForm(null), "enquiry-create", null);
    });
  }

  document.getElementById("page-create").addEventListener("click", function () {
    openModal("新增頁面", pageForm(null), "page-create", null);
  });
  pageSearch.addEventListener("input", function () {
    debounce("pages", function () {
      pagePage = 1;
      renderPages();
    });
  });
  pageStatusFilter.addEventListener("change", function () {
    pagePage = 1;
    renderPages();
  });
  if (pagePageSize) {
    pagePageSize.addEventListener("change", function () {
      pagePage = 1;
      renderPages();
    });
  }
  if (pageReloadBtn) pageReloadBtn.addEventListener("click", loadPages);
  bindColSettingsToggle(pageColumnsBtn, pageColPanel);

  document.getElementById("user-create").addEventListener("click", function () {
    openModal("新增使用者", userForm(null), "user-create", null);
  });
  if (userSearch) {
    userSearch.addEventListener("input", function () {
      debounce("users", function () {
        userPage = 1;
        renderUsers();
      });
    });
  }
  if (userRoleFilter) {
    userRoleFilter.addEventListener("change", function () {
      userPage = 1;
      renderUsers();
    });
  }
  if (userPageSize) {
    userPageSize.addEventListener("change", function () {
      userPage = 1;
      renderUsers();
    });
  }
  if (userReloadBtn) userReloadBtn.addEventListener("click", loadUsers);
  bindColSettingsToggle(userColumnsBtn, userColPanel);

  if (profileEditBtn) {
    profileEditBtn.addEventListener("click", function () {
      openModal("我的帳號", profileForm(), "profile-edit", me);
    });
  }
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document.getElementById("modal-save").addEventListener("click", saveModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  window.addEventListener("beforeunload", function (event) {
    if (!contentDirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  enquiryVisibleKeys = loadVisibleColumns(ENQUIRY_COLUMNS_KEY, ENQUIRY_COLUMNS, enquiryVisibleKeys);
  pageVisibleKeys = loadVisibleColumns(PAGE_COLUMNS_KEY, PAGE_COLUMNS, pageVisibleKeys);
  userVisibleKeys = loadVisibleColumns(USER_COLUMNS_KEY, USER_COLUMNS, userVisibleKeys);

  renderColumnPanel(
    enquiryColPanel,
    ENQUIRY_COLUMNS,
    function () { return enquiryVisibleKeys; },
    function (keys) { enquiryVisibleKeys = keys; },
    ENQUIRY_COLUMNS_KEY,
    renderEnquiries
  );
  renderColumnPanel(
    pageColPanel,
    PAGE_COLUMNS,
    function () { return pageVisibleKeys; },
    function (keys) { pageVisibleKeys = keys; },
    PAGE_COLUMNS_KEY,
    renderPages
  );
  renderColumnPanel(
    userColPanel,
    USER_COLUMNS,
    function () { return userVisibleKeys; },
    function (keys) { userVisibleKeys = keys; },
    USER_COLUMNS_KEY,
    renderUsers
  );

  api("/api/admin/me").then(function (data) {
    refreshMeFrom(data);
    loadEnquiries();
    loadContent();
    loadMedia();
    loadPages();
    if (me.role === "admin") loadUsers();
  }).catch(function () {
    location.href = "/admin/login";
  });
})();
