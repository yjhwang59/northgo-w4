(function (global) {
  var origin = "https://www.northgo.com";

  var locales = {
    en: { prefix: "", name: "English" },
    "zh-tw": { prefix: "/zh-tw", name: "繁體中文" },
    ja: { prefix: "/ja", name: "日本語" },
    vi: { prefix: "/vi", name: "Tiếng Việt" }
  };

  var copy = {
    en: {
      htmlLang: "en",
      title: "Sitemap | Northgo",
      treeTitle: "Sitemap tree | Northgo",
      skip: "Skip to content",
      h1: "Sitemap",
      treeH1: "Sitemap",
      lede: "Mapped from the live site on 14 October 2026. Each language has 11 pages.",
      treeLede: "The same 11 pages, shown as a short tree.",
      localeLabel: "Language",
      jumpLabel: "Sections",
      treeLink: "Tree view",
      cardLink: "Detailed view",
      mapLink: "Office map",
      note: "Footer News returned 404 on 14 October 2026, so /news is not linked. Social icons point to an empty hash, and Strategy Creative is an external site.",
      footer: "Northgo sitemap. Links open https://www.northgo.com",
      status: "Showing English",
      home: "Home",
      services: "Services",
      company: "Company",
      contact: "Contact and locations",
      legal: "Legal",
      homeName: "Home",
      homeDesc: "Making logistics effortless. Brand message, four services, and why Northgo.",
      ourServices: "Our services",
      why: "Why Northgo",
      freightName: "Freight Logistics",
      freightDesc: "Freight forwarding by ocean, air, road, and customs clearance.",
      ocean: "Ocean Freight",
      air: "Air Freight",
      land: "Land Transport",
      customs: "Customs Clearance",
      projectName: "Project Logistics",
      projectDesc: "Planning and management for oversized, heavy, and high-value cargo.",
      engineering: "Engineering solutions",
      management: "Project management",
      industries: "Industries: oil and gas, offshore and marine, infrastructure, energy, rail, renewable energy, mining, engineering and construction, industrial",
      warehouseName: "Warehouse Logistics",
      warehouseDesc: "Flexible, secure storage with inventory control and value-added work.",
      sites: "Located warehouses",
      storage: "Flexible storage",
      inventory: "Inventory management",
      valueAdded: "Value-added services",
      offshore: "Offshore logistics",
      agencyName: "Shipping Agency",
      agencyDesc: "Port operations, berthing, and crew matters.",
      vesselsA: "Dry bulk, tankers, break bulk, cruise",
      vesselsB: "Offshore, specialised carriers, container ships, car carriers",
      aboutName: "About",
      aboutDesc: "Founded in Taipei in 1988. Renamed from Max Seair Logistics to Northgo on 11 November 2024.",
      vision: "Vision: the most trusted name in logistics",
      mission: "Mission: making logistics effortless",
      values: "Values: customers, integrity, innovation, sustainability",
      story: "Story: what changed in the rename, and what stayed the same",
      contactName: "Contact",
      contactDesc: "Footer Locations uses this same page.",
      enquiry: "Enquiry form",
      locations: "Locations",
      office0: "Taipei head office",
      office1: "Taichung",
      office2: "Kaohsiung",
      office3: "Los Angeles",
      office4: "Ho Chi Minh City",
      office5: "Tokyo",
      office6: "Osaka",
      privacyName: "Privacy Policy",
      privacyDesc: "How personal information is collected and used.",
      termsName: "Terms of Service",
      termsDesc: "Terms for using the site and related services.",
      cookieName: "Cookie Policy",
      cookieDesc: "How the site uses cookies.",
      disclaimerName: "Legal Disclaimer",
      disclaimerDesc: "Limits on the use of site content."
    },
    "zh-tw": {
      htmlLang: "zh-Hant",
      title: "網站地圖｜Northgo",
      treeTitle: "網站地圖（樹狀）｜Northgo",
      skip: "跳至內容",
      h1: "網站地圖",
      treeH1: "網站地圖",
      lede: "依 2026 年 10 月 14 日實站整理。每個語系 11 個頁面。",
      treeLede: "同一套 11 個頁面的精簡樹狀結構。",
      localeLabel: "語系",
      jumpLabel: "頁面區塊",
      treeLink: "樹狀地圖",
      cardLink: "詳細地圖",
      mapLink: "據點地圖",
      note: "頁尾 News 在 2026-10-14 回傳 404，因此 /news 未列入。社群圖示指向空白錨點，Strategy Creative 為外部網站。",
      footer: "Northgo 網站地圖。連結開啟 https://www.northgo.com",
      status: "已顯示繁體中文",
      home: "首頁",
      services: "服務",
      company: "公司",
      contact: "聯絡與據點",
      legal: "法律",
      homeName: "首頁",
      homeDesc: "讓物流變得輕鬆。品牌主張、四大服務，以及為什麼選擇 Northgo。",
      ourServices: "服務總覽",
      why: "為什麼選擇 Northgo",
      freightName: "貨運物流",
      freightDesc: "海運、空運、陸運與報關的貨運承攬。",
      ocean: "海運",
      air: "空運",
      land: "陸運",
      customs: "報關",
      projectName: "專案物流",
      projectDesc: "超大、超重與高價值貨物的規劃與專案管理。",
      engineering: "工程方案",
      management: "專案管理",
      industries: "產業別：油氣、離岸與海事、基礎建設、能源、鐵路、再生能源、採礦、工程建設、工業",
      warehouseName: "倉儲物流",
      warehouseDesc: "彈性、安全的倉儲，含庫存管理與加值作業。",
      sites: "據點倉儲",
      storage: "彈性儲位",
      inventory: "進階庫存管理",
      valueAdded: "加值服務",
      offshore: "離岸物流",
      agencyName: "船務代理",
      agencyDesc: "港口作業、靠泊安排與船員事務。",
      vesselsA: "乾散貨、油輪、雜貨、郵輪",
      vesselsB: "離岸、特殊船、貨櫃船、汽車船",
      aboutName: "關於我們",
      aboutDesc: "1988 年創立於台北。2024 年 11 月 11 日由 Max Seair Logistics 更名為 Northgo。",
      vision: "願景：成為最受信賴的物流夥伴",
      mission: "使命：讓物流變得輕鬆",
      values: "價值：客戶導向、誠信透明、創新卓越、永續責任",
      story: "沿革：更名前後什麼變了、什麼沒變",
      contactName: "聯絡我們",
      contactDesc: "頁尾的據點連結指向同一頁。",
      enquiry: "詢問表單",
      locations: "全球據點",
      office0: "台北總部",
      office1: "台中",
      office2: "高雄",
      office3: "洛杉磯",
      office4: "胡志明市",
      office5: "東京",
      office6: "大阪",
      privacyName: "隱私權政策",
      privacyDesc: "個人資料如何被收集與使用。",
      termsName: "服務條款",
      termsDesc: "使用網站與相關服務的條款。",
      cookieName: "Cookie 政策",
      cookieDesc: "網站如何使用 Cookie。",
      disclaimerName: "法律免責聲明",
      disclaimerDesc: "網站內容的使用限制。"
    },
    ja: {
      htmlLang: "ja",
      title: "サイトマップ｜Northgo",
      treeTitle: "サイトマップ（ツリー）｜Northgo",
      skip: "本文へ移動",
      h1: "サイトマップ",
      treeH1: "サイトマップ",
      lede: "2026年10月14日の公開サイトに基づきます。各言語11ページです。",
      treeLede: "同じ11ページを簡潔なツリーで示します。",
      localeLabel: "言語",
      jumpLabel: "セクション",
      treeLink: "ツリー表示",
      cardLink: "詳細表示",
      mapLink: "拠点マップ",
      note: "フッターの News は 2026-10-14 に 404 だったため、/news は載せていません。ソーシャルアイコンは空のアンカーで、Strategy Creative は外部サイトです。",
      footer: "Northgo サイトマップ。リンク先は https://www.northgo.com",
      status: "日本語を表示しています",
      home: "ホーム",
      services: "サービス",
      company: "会社",
      contact: "連絡先と拠点",
      legal: "法務",
      homeName: "ホーム",
      homeDesc: "物流を楽にする。ブランドメッセージ、4つのサービス、Northgo を選ぶ理由。",
      ourServices: "サービス一覧",
      why: "Northgo を選ぶ理由",
      freightName: "貨物物流",
      freightDesc: "海上、航空、陸上輸送と通関のフォワーディング。",
      ocean: "海上輸送",
      air: "航空輸送",
      land: "陸上輸送",
      customs: "通関",
      projectName: "プロジェクト物流",
      projectDesc: "大型・重量・高額貨物の計画とプロジェクト管理。",
      engineering: "エンジニアリング",
      management: "プロジェクト管理",
      industries: "産業：石油・ガス、オフショア・海事、インフラ、エネルギー、鉄道、再生可能エネルギー、鉱業、エンジニアリング・建設、工業",
      warehouseName: "倉庫物流",
      warehouseDesc: "在庫管理と付加価値作業を含む、柔軟で安全な保管。",
      sites: "拠点倉庫",
      storage: "柔軟な保管",
      inventory: "在庫管理",
      valueAdded: "付加価値サービス",
      offshore: "オフショア物流",
      agencyName: "船舶代理店",
      agencyDesc: "港湾業務、着岸手配、船員関連。",
      vesselsA: "ドライバルク、タンカー、ブレークバルク、クルーズ",
      vesselsB: "オフショア、特殊船、コンテナ船、自動車船",
      aboutName: "会社概要",
      aboutDesc: "1988年に台北で創業。2024年11月11日に Max Seair Logistics から Northgo へ改名。",
      vision: "ビジョン：最も信頼される物流パートナー",
      mission: "ミッション：物流を楽にする",
      values: "価値観：顧客本位、誠実と透明性、革新、持続可能性",
      story: "沿革：改名で変わったこと、変わらないこと",
      contactName: "お問い合わせ",
      contactDesc: "フッターの拠点リンクは同じページです。",
      enquiry: "お問い合わせフォーム",
      locations: "世界の拠点",
      office0: "台北（本社）",
      office1: "台中",
      office2: "高雄",
      office3: "ロサンゼルス",
      office4: "ホーチミン",
      office5: "東京",
      office6: "大阪",
      privacyName: "プライバシーポリシー",
      privacyDesc: "個人情報の収集と利用。",
      termsName: "利用規約",
      termsDesc: "サイトと関連サービスの利用条件。",
      cookieName: "Cookie ポリシー",
      cookieDesc: "サイトでの Cookie の使い方。",
      disclaimerName: "免責事項",
      disclaimerDesc: "サイト内容の利用上の制限。"
    },
    vi: {
      htmlLang: "vi",
      title: "Sơ đồ trang | Northgo",
      treeTitle: "Sơ đồ dạng cây | Northgo",
      skip: "Tới nội dung",
      h1: "Sơ đồ trang",
      treeH1: "Sơ đồ trang",
      lede: "Theo trang đang chạy ngày 14 tháng 10 năm 2026. Mỗi ngôn ngữ có 11 trang.",
      treeLede: "Cùng 11 trang, trình bày thành cây ngắn gọn.",
      localeLabel: "Ngôn ngữ",
      jumpLabel: "Mục",
      treeLink: "Dạng cây",
      cardLink: "Dạng chi tiết",
      mapLink: "Bản đồ văn phòng",
      note: "Mục News ở chân trang trả về 404 vào ngày 2026-10-14, nên /news không được liên kết. Biểu tượng mạng xã hội trỏ tới neo trống, Strategy Creative là trang bên ngoài.",
      footer: "Sơ đồ trang Northgo. Liên kết mở https://www.northgo.com",
      status: "Đang hiển thị tiếng Việt",
      home: "Trang chủ",
      services: "Dịch vụ",
      company: "Công ty",
      contact: "Liên hệ và văn phòng",
      legal: "Pháp lý",
      homeName: "Trang chủ",
      homeDesc: "Làm logistics trở nên dễ dàng. Thông điệp thương hiệu, bốn dịch vụ, và lý do chọn Northgo.",
      ourServices: "Tổng quan dịch vụ",
      why: "Vì sao chọn Northgo",
      freightName: "Logistics hàng hóa",
      freightDesc: "Giao nhận đường biển, hàng không, đường bộ và thông quan.",
      ocean: "Vận tải biển",
      air: "Vận tải hàng không",
      land: "Vận tải đường bộ",
      customs: "Thông quan",
      projectName: "Logistics dự án",
      projectDesc: "Lập kế hoạch và quản lý hàng quá khổ, quá nặng và giá trị cao.",
      engineering: "Giải pháp kỹ thuật",
      management: "Quản lý dự án",
      industries: "Ngành: dầu khí, ngoài khơi và hàng hải, hạ tầng, năng lượng, đường sắt, năng lượng tái tạo, khai thác mỏ, kỹ thuật và xây dựng, công nghiệp",
      warehouseName: "Logistics kho bãi",
      warehouseDesc: "Lưu kho linh hoạt, an toàn, kèm quản lý tồn kho và dịch vụ gia tăng.",
      sites: "Kho theo vị trí",
      storage: "Lưu kho linh hoạt",
      inventory: "Quản lý tồn kho",
      valueAdded: "Dịch vụ gia tăng",
      offshore: "Logistics ngoài khơi",
      agencyName: "Đại lý tàu",
      agencyDesc: "Khai thác cảng, sắp xếp cầu bến và công việc thuyền viên.",
      vesselsA: "Hàng rời khô, tàu dầu, hàng rời, du thuyền",
      vesselsB: "Ngoài khơi, tàu chuyên dụng, tàu container, tàu chở ô tô",
      aboutName: "Giới thiệu",
      aboutDesc: "Thành lập tại Đài Bắc năm 1988. Đổi tên từ Max Seair Logistics thành Northgo ngày 11 tháng 11 năm 2024.",
      vision: "Tầm nhìn: đối tác logistics đáng tin cậy nhất",
      mission: "Sứ mệnh: làm logistics trở nên dễ dàng",
      values: "Giá trị: khách hàng, chính trực, đổi mới, bền vững",
      story: "Lịch sử: điều thay đổi và điều giữ nguyên sau khi đổi tên",
      contactName: "Liên hệ",
      contactDesc: "Liên kết văn phòng ở chân trang trỏ tới cùng một trang.",
      enquiry: "Biểu mẫu yêu cầu",
      locations: "Văn phòng toàn cầu",
      office0: "Đài Bắc (trụ sở)",
      office1: "Đài Trung",
      office2: "Cao Hùng",
      office3: "Los Angeles",
      office4: "Thành phố Hồ Chí Minh",
      office5: "Tokyo",
      office6: "Osaka",
      privacyName: "Chính sách quyền riêng tư",
      privacyDesc: "Cách thu thập và sử dụng dữ liệu cá nhân.",
      termsName: "Điều khoản dịch vụ",
      termsDesc: "Điều khoản sử dụng trang và dịch vụ liên quan.",
      cookieName: "Chính sách Cookie",
      cookieDesc: "Cách trang sử dụng cookie.",
      disclaimerName: "Tuyên bố miễn trừ",
      disclaimerDesc: "Giới hạn khi sử dụng nội dung trang."
    }
  };

  function displayPath(prefix, dataPath) {
    var hashAt = dataPath.indexOf("#");
    var hash = hashAt >= 0 ? dataPath.slice(hashAt) : "";
    var pathname = hashAt >= 0 ? dataPath.slice(0, hashAt) : dataPath;
    if (!pathname || pathname === "/") return (prefix || "/") + hash;
    return prefix + pathname + hash;
  }

  function absoluteUrl(prefix, dataPath) {
    var shown = displayPath(prefix, dataPath);
    if (shown === "/") return origin + "/";
    return origin + shown;
  }

  function apply(code) {
    var pack = copy[code];
    var prefix = locales[code].prefix;
    document.documentElement.lang = pack.htmlLang;
    document.title = document.body.getAttribute("data-page") === "tree" ? pack.treeTitle : pack.title;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = pack[el.getAttribute("data-i18n")];
      if (value == null) return;
      el.textContent = value;
    });
    document.querySelectorAll("[data-path]").forEach(function (el) {
      var dataPath = el.getAttribute("data-path");
      if (el.classList.contains("site-link")) el.href = absoluteUrl(prefix, dataPath);
      else el.textContent = displayPath(prefix, dataPath);
    });
    document.querySelectorAll("[data-locale]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-locale") === code ? "true" : "false");
    });
    var localesGroup = document.querySelector(".locales");
    var jump = document.querySelector(".jump");
    if (localesGroup) localesGroup.setAttribute("aria-label", pack.localeLabel);
    if (jump) jump.setAttribute("aria-label", pack.jumpLabel);
    var status = document.getElementById("locale-status");
    if (status) status.textContent = pack.status;
  }

  function bind() {
    document.querySelector(".locales").addEventListener("click", function (event) {
      var button = event.target.closest("button[data-locale]");
      if (!button) return;
      var code = button.getAttribute("data-locale");
      try { sessionStorage.setItem("northgo-sitemap-locale", code); } catch (err) {}
      apply(code);
    });
    var saved = "zh-tw";
    try {
      var stored = sessionStorage.getItem("northgo-sitemap-locale");
      if (stored && copy[stored]) saved = stored;
    } catch (err) {}
    apply(saved);
  }

  global.NorthgoSitemap = { apply: apply, bind: bind };
})(window);
