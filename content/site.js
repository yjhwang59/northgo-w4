"use strict";

const offices = [
  {
    id: "tpe",
    head: true,
    email: "info.tpe@northgo.com",
    tel: "+886-2-2531-8677",
    fax: "+886-2-2531-8577",
    maps: "7F., No. 10, Sec. 3, Minsheng E. Rd., Taipei City 104511, Taiwan",
    name: {
      en: "Taipei Office",
      "zh-tw": "台北辦公室",
      ja: "台北オフィス",
      vi: "Văn phòng Đài Bắc"
    },
    address: {
      en: "7F., No. 10, Sec. 3, Minsheng E. Rd., Taipei City 104511, Taiwan",
      "zh-tw": "台北市中山區民生東路三段10號7樓",
      ja: "7F., No. 10, Sec. 3, Minsheng E. Rd., Taipei City 104511, Taiwan",
      vi: "7F., No. 10, Sec. 3, Minsheng E. Rd., Taipei City 104511, Taiwan"
    }
  },
  {
    id: "txg",
    head: false,
    email: "info.txg@northgo.com",
    tel: "+886-4-2326-2580",
    fax: "+886-4-2326-0308",
    maps: "No. 4, Zhongheng 11th Rd., Taichung City 435058, Taiwan",
    name: {
      en: "Taichung Office",
      "zh-tw": "台中辦公室",
      ja: "台中オフィス",
      vi: "Văn phòng Đài Trung"
    },
    address: {
      en: "No. 4, Zhongheng 11th Rd., Taichung City 435058, Taiwan",
      "zh-tw": "台中市梧棲區中橫十一路4號",
      ja: "台中市梧棲區中橫十一路4號",
      vi: "No. 4, Zhongheng 11th Rd., Taichung City 435058, Taiwan"
    }
  },
  {
    id: "khh",
    head: false,
    email: "info.khh@northgo.com",
    tel: "+886-7-335-0730",
    fax: "+886-7-336-4536",
    maps: "19F-2, No.31 Hai-Pien Rd., Kaohsiung City 802609, Taiwan",
    name: {
      en: "Kaohsiung Office",
      "zh-tw": "高雄辦公室",
      ja: "高雄オフィス",
      vi: "Văn phòng Cao Hùng"
    },
    address: {
      en: "19F-2, No.31 Hai-Pien Rd., Kaohsiung City 802609, Taiwan",
      "zh-tw": "高雄市苓雅區海邊路31號19樓之2",
      ja: "高雄市苓雅區海邊路31號19樓之2",
      vi: "19F-2, No.31 Hai-Pien Rd., Kaohsiung City 802609, Taiwan"
    }
  },
  {
    id: "lax",
    head: false,
    email: "info.lax@northgo.com",
    tel: "+1-714-853-1088",
    fax: "",
    maps: "119 S. Atlantic Blvd, Ste#301, Monterey Park, CA 91754, USA",
    name: {
      en: "Los Angeles Office",
      "zh-tw": "洛杉磯辦公室",
      ja: "ロサンゼルスオフィス",
      vi: "Văn phòng Los Angeles"
    },
    address: {
      en: "119 S. Atlantic Blvd, Ste#301, Monterey Park, CA 91754, USA",
      "zh-tw": "美國加州蒙特利公園市南大西洋大道119號301室",
      ja: "119 S. Atlantic Blvd, Ste#301, Monterey Park, CA 91754, USA",
      vi: "119 S. Atlantic Blvd, Ste#301, Monterey Park, CA 91754, USA"
    }
  },
  {
    id: "sgn",
    head: false,
    email: "info.hcmc@northgo.com",
    tel: "+84-28-9995-7368",
    fax: "",
    maps: "5th Floor, No. 92D Nguyen Huu Canh Street, Ward 22, Binh Thanh District, Ho Chi Minh City, Vietnam",
    name: {
      en: "Ho Chi Minh Office",
      "zh-tw": "胡志明市辦公室",
      ja: "ホーチミンオフィス",
      vi: "Văn phòng Thành phố Hồ Chí Minh"
    },
    address: {
      en: "5th Floor, No. 92D Nguyen Huu Canh Street, Ward 22, Binh Thanh District, Ho Chi Minh City, Vietnam",
      "zh-tw": "胡志明市平盛郡第22坊阮有鏡街92D號5樓",
      ja: "5th Floor, No. 92D Nguyen Huu Canh Street, Ward 22, Binh Thanh District, Ho Chi Minh City, Vietnam",
      vi: "Tầng 5, số 92D đường Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, Thành phố Hồ Chí Minh"
    }
  },
  {
    id: "tyo",
    head: false,
    email: "info.tyo@northgo.com",
    tel: "+81-3-6260-3944",
    fax: "+81-3-6260-3945",
    maps: "104-0041 6FL., Gran+Ginza-East 1-5-1 Shintomi, Chuo-Ku, Tokyo City, Japan",
    name: {
      en: "Tokyo Office",
      "zh-tw": "東京辦公室",
      ja: "東京オフィス",
      vi: "Văn phòng Tokyo"
    },
    address: {
      en: "104-0041 6FL., Gran+Ginza-East 1-5-1 Shintomi, Chuo-Ku, Tokyo City, Japan",
      "zh-tw": "東京都中央區新富1-5-1 Gran+Ginza-East 6樓",
      ja: "〒104-0041 東京都中央区新富1-5-1 Gran+Ginza-East 6階",
      vi: "104-0041 6FL., Gran+Ginza-East 1-5-1 Shintomi, Chuo-Ku, Tokyo City, Japan"
    }
  },
  {
    id: "osa",
    head: false,
    email: "info.osa@northgo.com",
    tel: "+81-6-6676-8395",
    fax: "+81-6-6676-8397",
    maps: "530-0002 3FL., -B MF Sakura-Bashi Build, 2-6-23 Sonezaki Shinchi, kita-ku, Osaka City, Japan",
    name: {
      en: "Osaka Office",
      "zh-tw": "大阪辦公室",
      ja: "大阪オフィス",
      vi: "Văn phòng Osaka"
    },
    address: {
      en: "530-0002 3FL., -B MF Sakura-Bashi Build, 2-6-23 Sonezaki Shinchi, kita-ku, Osaka City, Japan",
      "zh-tw": "大阪市北區曾根崎新地2-6-23 櫻橋大樓3樓",
      ja: "〒530-0002 大阪市北区曾根崎新地2-6-23 桜橋ビル3階",
      vi: "530-0002 3FL., -B MF Sakura-Bashi Build, 2-6-23 Sonezaki Shinchi, kita-ku, Osaka City, Japan"
    }
  }
];

const pages = [
  { id: "home", path: "/" },
  { id: "freight", path: "/services/freight-logistics" },
  { id: "project", path: "/services/project-logistics" },
  { id: "warehouse", path: "/services/warehouse-logistics" },
  { id: "agency", path: "/services/shipping-agency" },
  { id: "about", path: "/about" },
  { id: "contact", path: "/contact" }
];

const locales = [
  { code: "en", htmlLang: "en", hreflang: "en", prefix: "", name: "English" },
  { code: "zh-tw", htmlLang: "zh-Hant", hreflang: "zh-TW", prefix: "/zh-tw", name: "繁體中文" },
  { code: "ja", htmlLang: "ja", hreflang: "ja", prefix: "/ja", name: "日本語" },
  { code: "vi", htmlLang: "vi", hreflang: "vi", prefix: "/vi", name: "Tiếng Việt" }
];

const copy = {
  en: {
    skip: "Skip to content",
    navLabel: "Primary",
    localeLabel: "Language",
    why: "Why Northgo",
    services: "Services",
    about: "About",
    contact: "Contact",
    enquire: "Enquire now",
    menu: "Menu",
    home: "Home",
    footerNav: "Navigation",
    footerServices: "Services",
    map: "Office map",
    member: "Member of IATA, ISO 45001, and AEO.",
    rights: "© 2026 Northgo. All rights reserved.",
    headOffice: "Head office",
    tel: "Tel",
    fax: "Fax",
    email: "Email",
    viewMaps: "Open in Google Maps",
    onThisPage: "On this page",
    pages: {
      home: {
        title: "Northgo | Making logistics effortless",
        description: "Freight forwarding, project cargo, warehousing, and shipping agency. Northgo was founded in Taipei in 1988 and works from seven offices.",
        h1: "Making logistics effortless.",
        accent: "effortless",
        lede: "Northgo plans and moves freight for businesses that ship across borders. The company was founded in Taipei in 1988 and has spent more than 30 years on freight forwarding, project cargo, warehousing, and port agency.",
        modesLabel: "Ways Northgo moves freight",
        modes: ["Sea", "Air", "Road"],
        servicesTitle: "Four services",
        servicesIntro: "Each service below is work Northgo already offers. Open a page for the modes, cargo types, and handling steps.",
        services: [
          { page: "freight", title: "Freight Logistics", text: "Ocean, air, and land forwarding, plus customs clearance." },
          { page: "project", title: "Project Logistics", text: "Planning and transport for oversized, heavy, and high-value cargo." },
          { page: "warehouse", title: "Warehouse Logistics", text: "Storage at Taichung Port, inventory control, and value-added work." },
          { page: "agency", title: "Shipping Agency", text: "Port operations, berthing, and crew matters." }
        ],
        whyTitle: "Why Northgo",
        whyBody: "Logistics is a short idea that becomes hard in practice: routes, documents, warehouses, and port calls. Northgo’s job is to keep those steps clear for the shipper.",
        whyPoints: [
          { title: "Seamless experience", text: "One team follows the shipment instead of handing you a chain of unrelated vendors." },
          { title: "Hands-on experts", text: "People who plan the move stay close to the work and the exceptions." }
        ],
        stats: [
          { value: "360°", text: "Planning through delivery for the project or shipment." },
          { value: "24/7", text: "Operations support, 365 days a year." }
        ],
        teamTitle: "An extension of your logistics team",
        teamBody: "The same people who know the cargo also know the offices in Asia and North America.",
        teamPoints: [
          { title: "Trusted logistics experts", text: "Decades of freight forwarding and supply-chain work." },
          { title: "Flexible solutions", text: "Routes and storage shaped around the cargo, not a fixed menu only." },
          { title: "People-oriented service", text: "You can reach the operations team at any hour." },
          { title: "Committed to success", text: "Specialists use the office network to keep freight moving." }
        ],
        certs: "Northgo publishes membership of IATA, ISO 45001, and AEO.",
        ctaTitle: "Partner with Northgo",
        ctaText: "Tell the Taipei head office what you are moving, or write to the office nearest the shipment.",
        ctaLabel: "Get in touch"
      },
      freight: {
        title: "Freight Logistics | Northgo",
        description: "Ocean, air, road, and rail freight forwarding, with customs clearance for bulk, delicate, and time-critical cargo.",
        h1: "Freight Logistics",
        lede: "End-to-end forwarding by sea, air, road, and rail, with customs support for bulk, delicate, and time-critical cargo.",
        introTitle: "How a shipment is handled",
        intro: "Northgo plans the route, books the move, and follows the cargo through to delivery. Specialists at origin and destination adjust the plan for cost, routing, or transit time.",
        topics: [
          {
            id: "ocean-freight",
            title: "Ocean Freight",
            text: "Import and export sea freight, with sailings on carriers Northgo contracts directly.",
            points: [
              "FCL: full-container shipping with access to major lanes.",
              "LCL: consolidated shipping across Northgo’s customer volume.",
              "Origin and destination teams for cost, route, or transit time."
            ]
          },
          {
            id: "air-freight",
            title: "Air Freight",
            text: "Air freight when transit time matters, with visibility from pickup through arrival and routing built around the shipment.",
            points: []
          },
          {
            id: "land-transport",
            title: "Land Transport",
            text: "Trucking after cargo leaves the ship or aircraft. Partners get the shipment details they need to deliver on time, with tracking along the way.",
            points: []
          },
          {
            id: "customs-clearance",
            title: "Customs Clearance",
            text: "Before import, the Harmonized System code drives duties and taxes. Northgo’s customs team checks that classification so the goods can clear.",
            points: []
          }
        ]
      },
      project: {
        title: "Project Logistics | Northgo",
        description: "Door-to-door project logistics for oversized, heavy, and high-value cargo, from engineering through delivery.",
        h1: "Project Logistics",
        lede: "Door-to-door movement for turnkey projects, from large equipment to the smallest components.",
        introTitle: "Heavy lifts, planned early",
        intro: "Oversized and heavy cargo needs the route, permits, and lift plan settled before the cargo moves. Northgo coordinates that work across its office network.",
        topics: [
          {
            id: "engineering",
            title: "Engineering solutions",
            text: "An in-house engineering team prepares methods for complex, large-scale projects.",
            points: []
          },
          {
            id: "project-management",
            title: "Project management",
            text: "From the first plan to delivery, Northgo watches schedule, cost, taxes, and customs so the cargo can move.",
            points: []
          }
        ],
        lists: [
          {
            id: "industries",
            title: "Industries",
            items: [
              "Oil and gas",
              "Offshore and marine",
              "Infrastructure",
              "Energy",
              "Rail",
              "Renewable energy",
              "Mining",
              "Engineering and construction",
              "Industrial"
            ]
          },
          {
            id: "project-services",
            title: "What the project team handles",
            items: [
              "Chartering and freight management",
              "Route survey and feasibility studies",
              "Lifting, heavy-lift, and multimodal transport",
              "Door-to-door transportation",
              "Method statements, drawings, and technical documents",
              "Customs clearance and trade documents",
              "Real-time visibility of the move"
            ]
          }
        ],
        closeTitle: "Health, safety, and environment",
        closeText: "Project and heavy-lift work follows Northgo’s health, safety, and environmental practice: protect the cargo, keep people safe, and limit the impact of the move. Crews are trained for the regions where the cargo travels."
      },
      warehouse: {
        title: "Warehouse Logistics | Northgo",
        description: "Warehousing at Taichung Port, with flexible storage, inventory control, value-added work, and offshore cargo handling.",
        h1: "Warehouse Logistics",
        lede: "Storage that sits inside the wider move, including facilities at Taichung Port for project and offshore cargo.",
        introTitle: "Storage tied to the shipment",
        intro: "The warehouses are not a separate product from the freight. They hold cargo where the routes already run, especially for offshore and large projects.",
        topics: [
          {
            id: "located-warehouses",
            title: "Located warehouses",
            text: "Facilities at Taichung Port sit near shipping routes and roads, so cargo spends less time between the ship and the warehouse.",
            points: []
          },
          {
            id: "flexible-storage",
            title: "Flexible storage",
            text: "General cargo, temperature-controlled goods, and secure space for high-value or hazardous materials.",
            points: []
          },
          {
            id: "inventory-management",
            title: "Inventory management",
            text: "A warehouse management system shows stock as it changes, so orders can be picked against what is actually on hand.",
            points: []
          },
          {
            id: "value-added",
            title: "Value-added services",
            text: "Work done at the warehouse before the cargo moves again.",
            points: [
              "Pick and pack, kitting, and labeling.",
              "Inspection and repackaging.",
              "Container leasing and sales, including DNV-certified containers for offshore and industrial use."
            ]
          },
          {
            id: "offshore-logistics",
            title: "Offshore logistics",
            text: "Taichung Port space is used for offshore equipment and components, including offshore wind and other maritime projects. Northgo stores, handles, and forwards that cargo onward.",
            points: []
          }
        ]
      },
      agency: {
        title: "Shipping Agency | Northgo",
        description: "Port agency for dry bulk, tankers, break bulk, cruise, offshore vessels, specialised carriers, container ships, and car carriers.",
        h1: "Shipping Agency",
        lede: "Port agency and marine services, from berthing arrangements to crew matters.",
        introTitle: "A vessel call, handled in advance",
        intro: "Northgo works with port authorities and the other parties on the call so the ship can berth, work cargo, and sail with less idle time. The agency brief covers documents, crew, and the owner’s interests while the ship is in port.",
        topics: [
          {
            id: "vessel-types",
            title: "Types of vessels",
            text: "The agency desk handles these vessel groups.",
            groups: [
              { title: "Dry bulk", text: "Agriculture products, cement, clinker, clay, coal, fertilizer, grain, ore, salt, and steel." },
              { title: "Tankers", text: "Liquefied chemicals, ammonia, crude, CPP, LNG, LPG, lubricant, molasses, palm oil, and vegetable oil." },
              { title: "Break bulk", text: "Conventional general cargo ships, project cargo ships, and heavy-lift carriers." },
              { title: "Cruise", text: "Fishery training boats, yachts, and passenger ships." },
              { title: "Offshore", text: "Dredgers, cable ships, jack-up vessels, crew transit vessels, heavy-lift ships, supply boats, working barges, and salvage tugs." },
              { title: "Specialised carriers", text: "Heavy-lift carriers, submersible ships, and cable-laying barges." },
              { title: "Container ships", text: "Panamax container ships, ultra-large container vessels, and feeder vessels." },
              { title: "Car carriers", text: "Ferries and RO/RO ships." }
            ]
          }
        ],
        lists: [
          {
            id: "agency-services",
            title: "Port agency and marine services",
            groups: [
              {
                title: "Port agency",
                items: [
                  "Full port agency",
                  "Protective agency",
                  "Bunkering agency",
                  "Dry docking agency",
                  "Husbandry agency",
                  "New building delivery"
                ]
              },
              {
                title: "Marine services",
                items: [
                  "Lay-up and ship handling",
                  "Laundry, bunker and water, and deck, engine, or provision supply",
                  "Delivery of ship spares",
                  "General average, P&I, and H&M handling",
                  "Survey and inspection, including hull underwater cleaning",
                  "Crew logistics",
                  "Emergency rescue and offshore salvage"
                ]
              }
            ]
          }
        ],
        closeTitle: "How the desk works",
        closeText: "The published strengths are experienced management, a responsive team, close communication, rapid response, local relationships, protection of the owner’s interests, problem solving, and offshore experience."
      },
      about: {
        title: "About | Northgo",
        description: "Founded in Taipei in 1988 as Max Seair Logistics. Renamed Northgo on 11 November 2024.",
        h1: "About Northgo",
        lede: "Northgo was founded in Taipei in 1988 as Max Seair Logistics Inc. On 11 November 2024 the company took the name Northgo. The team and the work stayed.",
        visionTitle: "Vision",
        vision: "To be the most trusted name in logistics.",
        visionBody: "Trust is the test for each job: the client should be able to come back with the next problem.",
        missionTitle: "Mission",
        mission: "Making logistics effortless.",
        missionBody: "Remove the steps that do not help the shipment, and leave a move the client can follow.",
        valuesTitle: "Values",
        valuesIntro: "Northgo states the standard as doing the right thing, not only doing things right. Everyone at the company is responsible for these four.",
        values: [
          { title: "Customer-centric approach", text: "Decisions and services are judged by the value they create for the client." },
          { title: "Integrity and transparency", text: "Clients are told what is happening, in plain terms." },
          { title: "Innovation and excellence", text: "The service changes when a better way to move the cargo is clear." },
          { title: "Sustainability and responsibility", text: "Look for ways to reduce the environmental impact of the work and to stay responsible to the communities around the offices." }
        ],
        storyTitle: "Our story",
        story: [
          "The company started in Taipei in 1988 to do logistics with more care than a simple handoff. It grew as Max Seair Logistics Inc.",
          "In 2024 the name changed so the brand matched the direction of the work. Northgo is the name from 11 November 2024. The people doing the work did not change."
        ],
        changedTitle: "What has changed?",
        changed: "The name. Northgo is the brand used with clients from that date.",
        sameTitle: "What remains the same?",
        same: "The team, the standard of work, and the commitment to the client built over more than thirty years."
      },
      contact: {
        title: "Contact | Northgo",
        description: "Taipei head office, plus Taichung, Kaohsiung, Los Angeles, Ho Chi Minh City, Tokyo, and Osaka.",
        h1: "Contact",
        lede: "Write to the Taipei head office, or contact the office closest to the shipment. Addresses and numbers below are the ones published on Northgo’s contact page.",
        enquiryTitle: "Enquiry",
        enquiryText: "Send the form and it is kept for the Northgo team. You can also email the Taipei head office.",
        enquiryLabel: "Email info.tpe@northgo.com",
        form: {
          firstName: "First name",
          lastName: "Last name",
          company: "Company",
          email: "Email",
          phone: "Phone number",
          country: "Country",
          countryEmpty: "Select one",
          services: "What services are you interested in?",
          message: "Message",
          terms: "I accept the Terms",
          submit: "Send enquiry",
          sending: "Sending",
          success: "Thank you! Your submission has been received!",
          error: "Oops! Something went wrong while submitting the form.",
          invalid: "Check the marked fields.",
          other: "Other",
          requiredNote: "Fields marked * are required."
        },
        locationsTitle: "Offices",
        locationsIntro: "Seven offices: Taipei, Taichung, Kaohsiung, Los Angeles, Ho Chi Minh City, Tokyo, and Osaka.",
        mapLabel: "Open the office map"
      }
    }
  },
  "zh-tw": {
    skip: "跳至內容",
    navLabel: "主要",
    localeLabel: "語系",
    why: "為什麼選擇 Northgo",
    services: "服務",
    about: "關於我們",
    contact: "聯絡我們",
    enquire: "立即詢問",
    menu: "選單",
    home: "首頁",
    footerNav: "導覽",
    footerServices: "服務",
    map: "據點地圖",
    member: "會員身分：IATA、ISO 45001、AEO。",
    rights: "© 2026 Northgo. 版權所有。",
    headOffice: "總部",
    tel: "電話",
    fax: "傳真",
    email: "電子郵件",
    viewMaps: "在 Google 地圖開啟",
    onThisPage: "本頁小節",
    pages: {
      home: {
        title: "Northgo｜讓物流變得輕鬆",
        description: "貨運承攬、專案物流、倉儲與船務代理。Northgo 1988 年創立於台北，目前有七個辦公室。",
        h1: "讓物流變得輕鬆。",
        accent: "輕鬆",
        lede: "Northgo 為跨境出貨的企業規劃並承運貨物。公司 1988 年創立於台北，超過 30 年從事貨運承攬、專案貨物、倉儲與港口代理。",
        modesLabel: "Northgo 的運輸方式",
        modes: ["海運", "空運", "陸運"],
        servicesTitle: "四項服務",
        servicesIntro: "以下都是 Northgo 已經在做的工作。各頁說明運輸方式、貨物類型與作業內容。",
        services: [
          { page: "freight", title: "貨運物流", text: "海運、空運、陸運承攬，以及報關。" },
          { page: "project", title: "專案物流", text: "超大、超重與高價值貨物的規劃與運輸。" },
          { page: "warehouse", title: "倉儲物流", text: "台中港倉儲、庫存管理與加值作業。" },
          { page: "agency", title: "船務代理", text: "港口作業、靠泊安排與船員事務。" }
        ],
        whyTitle: "為什麼選擇 Northgo",
        whyBody: "物流概念很短，實務卻很長：航線、文件、倉庫與靠港。Northgo 要讓託運人看得懂這些步驟。",
        whyPoints: [
          { title: "順暢的作業", text: "同一組人跟著這票貨，而不是把你轉給互不相關的供應商。" },
          { title: "親手處理的專家", text: "規劃運輸的人留在作業與例外狀況旁邊。" }
        ],
        stats: [
          { value: "360°", text: "從規劃到送達，涵蓋這票貨或這個專案。" },
          { value: "24/7", text: "營運支援，全年無休。" }
        ],
        teamTitle: "物流團隊的延伸",
        teamBody: "認識這票貨的人，也認識亞洲與北美的辦公室。",
        teamPoints: [
          { title: "可信的物流專家", text: "數十年的貨運承攬與供應鏈經驗。" },
          { title: "依貨物調整", text: "路線與倉儲依貨物安排，不只套用固定菜單。" },
          { title: "隨時找得到人", text: "任何時間都可以聯絡營運團隊。" },
          { title: "把貨送完", text: "專員透過辦公室網絡讓貨物繼續移動。" }
        ],
        certs: "Northgo 公開標示為 IATA、ISO 45001 與 AEO 的會員。",
        ctaTitle: "與 Northgo 合作",
        ctaText: "寫信給台北總部，說明要運的貨，或聯絡最靠近這票貨的辦公室。",
        ctaLabel: "與我們聯絡"
      },
      freight: {
        title: "貨運物流｜Northgo",
        description: "海運、空運、陸運與鐵路的貨運承攬，以及大宗、精密與時效貨物的報關。",
        h1: "貨運物流",
        lede: "海運、空運、陸運與鐵路的全程承攬，並協助報關。涵蓋大宗、精密與時效貨物。",
        introTitle: "一票貨怎麼走",
        intro: "Northgo 規劃路線、安排運輸，並跟到送達。起運地與目的地的專員會依成本、路線或時效調整計畫。",
        topics: [
          {
            id: "ocean-freight",
            title: "海運",
            text: "進出口海運，船期來自 Northgo 直接簽約的船公司。",
            points: [
              "整櫃：走主要航線的整櫃運輸。",
              "併櫃：依 Northgo 客戶的整體貨量併裝。",
              "起運地與目的地團隊協助成本、路線或時效。"
            ]
          },
          {
            id: "air-freight",
            title: "空運",
            text: "時效要緊時走空運，從提貨到抵達都看得到貨況，路線依這票貨安排。",
            points: []
          },
          {
            id: "land-transport",
            title: "陸運",
            text: "貨物離開船舶或飛機之後的卡車運輸。合作車隊取得送達所需的資料，途中可追蹤。",
            points: []
          },
          {
            id: "customs-clearance",
            title: "報關",
            text: "進口前，協調制度稅則號列決定關稅與稅費。Northgo 的報關團隊核對稅則，讓貨物可以清關。",
            points: []
          }
        ]
      },
      project: {
        title: "專案物流｜Northgo",
        description: "超大、超重與高價值專案貨物的門到門物流，從工程規劃到送達。",
        h1: "專案物流",
        lede: "統包專案的門到門運輸，從大型設備到最小的零件。",
        introTitle: "重貨要先計畫",
        intro: "超大與超重貨物在移動前就要定好路線、許可與吊裝。Northgo 透過辦公室網絡協調這些工作。",
        topics: [
          {
            id: "engineering",
            title: "工程方案",
            text: "內部工程團隊為複雜的大型專案準備工法。",
            points: []
          },
          {
            id: "project-management",
            title: "專案管理",
            text: "從第一份計畫到送達，Northgo 看進度、成本、稅費與報關，讓貨物動得了。",
            points: []
          }
        ],
        lists: [
          {
            id: "industries",
            title: "產業別",
            items: ["油氣", "離岸與海事", "基礎建設", "能源", "鐵路", "再生能源", "採礦", "工程建設", "工業"]
          },
          {
            id: "project-services",
            title: "專案團隊處理的事",
            items: [
              "租船與運費管理",
              "路線勘察與可行性研究",
              "吊裝、重吊與複合運輸",
              "門到門運輸",
              "工法說明、圖說與技術文件",
              "報關與貿易文件",
              "運輸過程的即時可見度"
            ]
          }
        ],
        closeTitle: "健康、安全與環境",
        closeText: "專案與重吊作業依 Northgo 的健康、安全與環境做法：保護貨物、保住人員安全、降低這次運輸的影響。作業人員依貨物經過的地區受訓。"
      },
      warehouse: {
        title: "倉儲物流｜Northgo",
        description: "台中港倉儲，含彈性儲位、庫存管理、加值作業與離岸貨物處理。",
        h1: "倉儲物流",
        lede: "倉儲是整段運輸的一部分，包含台中港設施，服務專案與離岸貨物。",
        introTitle: "倉庫跟著這票貨",
        intro: "倉庫不是跟貨運分開賣的產品。貨物放在航線已經經過的地方，尤其是離岸與大型專案。",
        topics: [
          {
            id: "located-warehouses",
            title: "據點倉儲",
            text: "台中港的設施靠近航線與道路，貨物在船與倉庫之間少停一段。",
            points: []
          },
          {
            id: "flexible-storage",
            title: "彈性儲位",
            text: "一般貨物、溫控貨物，以及高價值或危險品的安全儲位。",
            points: []
          },
          {
            id: "inventory-management",
            title: "庫存管理",
            text: "倉儲管理系統顯示庫存變化，揀貨時對得上實際在庫的數量。",
            points: []
          },
          {
            id: "value-added",
            title: "加值服務",
            text: "貨物再次出發前，在倉庫完成的作業。",
            points: [
              "揀貨包裝、組套與貼標。",
              "檢驗與重新包裝。",
              "貨櫃租賃與買賣，包含符合 DNV 認證、供離岸與工業使用的貨櫃。"
            ]
          },
          {
            id: "offshore-logistics",
            title: "離岸物流",
            text: "台中港空間用於離岸設備與構件，包含離岸風電與其他海事專案。Northgo 儲存、處理並續運這些貨物。",
            points: []
          }
        ]
      },
      agency: {
        title: "船務代理｜Northgo",
        description: "乾散貨、油輪、雜貨、郵輪、離岸船、特殊船、貨櫃船與汽車船的港口代理。",
        h1: "船務代理",
        lede: "港口代理與海事服務，從靠泊安排到船員事務。",
        introTitle: "靠港之前就開始處理",
        intro: "Northgo 與港務及靠港相關單位配合，讓船舶靠泊、裝卸並開航，減少空等。代理範圍包含文件、船員，以及船舶在港期間船東的利益。",
        topics: [
          {
            id: "vessel-types",
            title: "船型",
            text: "代理台處理以下船種。",
            groups: [
              { title: "乾散貨", text: "農產品、水泥、熟料、黏土、煤、肥料、穀物、礦砂、鹽與鋼材。" },
              { title: "油輪", text: "液化化學品、氨、原油、清潔石油產品、LNG、LPG、潤滑油、糖蜜、棕櫚油與植物油。" },
              { title: "雜貨", text: "傳統雜貨船、專案貨船與重吊船。" },
              { title: "郵輪", text: "漁業訓練船、遊艇與客船。" },
              { title: "離岸", text: "挖泥船、布纜船、自升式平台、船員交通船、重吊船、補給船、工作駁船與救助拖船。" },
              { title: "特殊船", text: "重吊船、半潛船與布纜駁。" },
              { title: "貨櫃船", text: "巴拿馬型貨櫃船、超大型貨櫃船與支線船。" },
              { title: "汽車船", text: "渡輪與滾裝船。" }
            ]
          }
        ],
        lists: [
          {
            id: "agency-services",
            title: "港口代理與海事服務",
            groups: [
              {
                title: "港口代理",
                items: ["總代理", "保護代理", "加油代理", "塢修代理", "船東事務代理", "新船交付"]
              },
              {
                title: "海事服務",
                items: [
                  "停航與船舶處理",
                  "洗衣、燃油與淡水，以及甲板、輪機或伙食補給",
                  "船舶備件遞送",
                  "共同海損、保賠與船體險處理",
                  "驗船與檢查，含水下船體清洗",
                  "船員後勤",
                  "緊急救助與離岸打撈"
                ]
              }
            ]
          }
        ],
        closeTitle: "代理台怎麼工作",
        closeText: "公開的強項是有經驗的管理、反應快的團隊、密切溝通、快速回應、在地關係、維護船東利益、解決問題，以及離岸經驗。"
      },
      about: {
        title: "關於我們｜Northgo",
        description: "1988 年於台北以 Max Seair Logistics 創立。2024 年 11 月 11 日更名為 Northgo。",
        h1: "關於 Northgo",
        lede: "Northgo 1988 年在台北以 Max Seair Logistics Inc. 創立。2024 年 11 月 11 日公司改名為 Northgo。團隊與工作沒有換。",
        visionTitle: "願景",
        vision: "成為最受信賴的物流名字。",
        visionBody: "每一票貨的檢驗標準是信任：客戶下一題還願意回來。",
        missionTitle: "使命",
        mission: "讓物流變得輕鬆。",
        missionBody: "拿掉對這票貨沒有幫助的步驟，留下客戶跟得上的運輸。",
        valuesTitle: "價值",
        valuesIntro: "Northgo 把標準寫成做對的事，而不只是把事情做對。公司裡每個人都要守住這四項。",
        values: [
          { title: "以客戶為中心", text: "決定與服務，以對客戶創造的價值來判斷。" },
          { title: "誠信與透明", text: "用清楚的話告訴客戶現在發生什麼事。" },
          { title: "創新與把事情做好", text: "有更清楚的運法時，服務就跟著改。" },
          { title: "永續與責任", text: "尋找降低作業環境影響的方法，並對辦公室所在的社區負責。" }
        ],
        storyTitle: "沿革",
        story: [
          "公司 1988 年在台北成立，想把物流做得比單純轉手更仔細。之後以 Max Seair Logistics Inc. 成長。",
          "2024 年改名，讓品牌對上工作的方向。Northgo 是 2024 年 11 月 11 日起使用的名字。做事的人沒有換。"
        ],
        changedTitle: "什麼變了？",
        changed: "名字。從那天起，對客戶使用的品牌是 Northgo。",
        sameTitle: "什麼沒變？",
        same: "團隊、工作標準，以及超過三十年對客戶的承諾。"
      },
      contact: {
        title: "聯絡我們｜Northgo",
        description: "台北總部，以及台中、高雄、洛杉磯、胡志明市、東京與大阪。",
        h1: "聯絡我們",
        lede: "寫信給台北總部，或聯絡最靠近這票貨的辦公室。下面的地址與電話是 Northgo 聯絡頁公開的資料。",
        enquiryTitle: "詢問",
        enquiryText: "填寫表單後會存入 Northgo 的詢問紀錄。也可以寫信給台北總部。",
        enquiryLabel: "寫信至 info.tpe@northgo.com",
        form: {
          firstName: "名",
          lastName: "姓",
          company: "公司",
          email: "電子郵件",
          phone: "電話",
          country: "國家",
          countryEmpty: "請選擇",
          services: "您對哪些服務有興趣？",
          message: "訊息",
          terms: "我接受條款",
          submit: "送出詢問",
          sending: "送出中",
          success: "已收到您的詢問。",
          error: "送出時發生問題，請再試一次。",
          invalid: "請檢查標示的欄位。",
          other: "其他",
          requiredNote: "標示 * 的欄位為必填。"
        },
        locationsTitle: "辦公室",
        locationsIntro: "七個辦公室：台北、台中、高雄、洛杉磯、胡志明市、東京、大阪。",
        mapLabel: "開啟據點地圖"
      }
    }
  },
  ja: {
    skip: "本文へ移動",
    navLabel: "メイン",
    localeLabel: "言語",
    why: "Northgo を選ぶ理由",
    services: "サービス",
    about: "会社概要",
    contact: "お問い合わせ",
    enquire: "問い合わせる",
    menu: "メニュー",
    home: "ホーム",
    footerNav: "案内",
    footerServices: "サービス",
    map: "拠点マップ",
    member: "加盟：IATA、ISO 45001、AEO。",
    rights: "© 2026 Northgo.",
    headOffice: "本社",
    tel: "電話",
    fax: "FAX",
    email: "メール",
    viewMaps: "Google マップで開く",
    onThisPage: "このページの項目",
    pages: {
      home: {
        title: "Northgo｜物流を楽にする",
        description: "フォワーディング、プロジェクト貨物、倉庫、船舶代理店。Northgo は 1988 年に台北で創業し、7 拠点で働いています。",
        h1: "物流を楽にする。",
        accent: "楽に",
        lede: "Northgo は国境を越えて出す貨物の計画と輸送を引き受けます。1988 年に台北で創業し、30 年以上、フォワーディング、プロジェクト貨物、倉庫、港湾代理を続けています。",
        modesLabel: "Northgo の運び方",
        modes: ["海上", "航空", "陸上"],
        servicesTitle: "4 つのサービス",
        servicesIntro: "ここに挙げたのは、Northgo がすでに行っている仕事です。各ページに輸送モード、貨物、作業内容があります。",
        services: [
          { page: "freight", title: "貨物物流", text: "海上、航空、陸上のフォワーディングと通関。" },
          { page: "project", title: "プロジェクト物流", text: "大型、重量、高額貨物の計画と輸送。" },
          { page: "warehouse", title: "倉庫物流", text: "台中港の保管、在庫管理、付加価値作業。" },
          { page: "agency", title: "船舶代理店", text: "港湾作業、着岸、船員関連。" }
        ],
        whyTitle: "Northgo を選ぶ理由",
        whyBody: "物流は短い考えが、実務では長くなります。航路、書類、倉庫、寄港。Northgo の仕事は、荷主がこれらの段取りを追えるようにすることです。",
        whyPoints: [
          { title: "途切れない対応", text: "同じ担当が貨物に付き、関係のない業者へ次々と渡すのではありません。" },
          { title: "手を動かす専門家", text: "計画した人が、作業と例外のそばに残ります。" }
        ],
        stats: [
          { value: "360°", text: "計画から引き渡しまで、その貨物またはプロジェクトを見ます。" },
          { value: "24/7", text: "オペレーションの支援は年中無休です。" }
        ],
        teamTitle: "物流チームの延長",
        teamBody: "貨物を知っている人が、アジアと北米のオフィスも知っています。",
        teamPoints: [
          { title: "信頼できる物流の専門家", text: "数十年のフォワーディングとサプライチェーンの経験。" },
          { title: "貨物に合わせる", text: "固定メニューだけでなく、路線と保管を貨物に合わせます。" },
          { title: "いつでも担当につながる", text: "オペレーションチームへは時間を問わず連絡できます。" },
          { title: "最後まで運ぶ", text: "担当者は拠点のネットワークで貨物を動かし続けます。" }
        ],
        certs: "Northgo は IATA、ISO 45001、AEO の加盟を公開しています。",
        ctaTitle: "Northgo と組む",
        ctaText: "台北本社へ運ぶ貨物を書くか、その貨物に近いオフィスへ連絡してください。",
        ctaLabel: "連絡する"
      },
      freight: {
        title: "貨物物流｜Northgo",
        description: "海上、航空、陸上、鉄道のフォワーディングと、大口、精密、急ぎ貨物の通関。",
        h1: "貨物物流",
        lede: "海上、航空、陸上、鉄道の一貫フォワーディングと通関です。大口、精密、急ぎの貨物を扱います。",
        introTitle: "一票の扱い",
        intro: "Northgo は路線を組み、輸送を手配し、引き渡しまで追います。仕出地と仕向地の担当が、費用、路線、所要時間に合わせて計画を直します。",
        topics: [
          {
            id: "ocean-freight",
            title: "海上輸送",
            text: "輸出入の海上輸送です。船腹は Northgo が直接契約する船社のスケジュールを使います。",
            points: [
              "FCL：主要航路のコンテナ貸切。",
              "LCL：Northgo の顧客貨物をまとめた混載。",
              "仕出地と仕向地のチームが費用、路線、所要時間を見ます。"
            ]
          },
          {
            id: "air-freight",
            title: "航空輸送",
            text: "所要時間が重要なときの航空貨物です。集荷から到着まで見え、路線はその貨物に合わせます。",
            points: []
          },
          {
            id: "land-transport",
            title: "陸上輸送",
            text: "船または航空機を離れたあとのトラック輸送です。提携運送会社は届けに必要な情報を受け取り、途中を追跡できます。",
            points: []
          },
          {
            id: "customs-clearance",
            title: "通関",
            text: "輸入の前に、HS コードが関税と税金を決めます。Northgo の通関チームがその分類を確認し、貨物が通関できるようにします。",
            points: []
          }
        ]
      },
      project: {
        title: "プロジェクト物流｜Northgo",
        description: "大型、重量、高額なプロジェクト貨物のドアツードア。エンジニアリングから引き渡しまで。",
        h1: "プロジェクト物流",
        lede: "ターンキー案件のドアツードア輸送です。大型機器から小さな部品まで扱います。",
        introTitle: "重量物は先に計画する",
        intro: "大型と重量貨物は、動かす前に路線、許可、吊り計画を決める必要があります。Northgo は拠点のネットワークでその作業をまとめます。",
        topics: [
          {
            id: "engineering",
            title: "エンジニアリング",
            text: "社内のエンジニアリングチームが、複雑で大規模な案件の工法を用意します。",
            points: []
          },
          {
            id: "project-management",
            title: "プロジェクト管理",
            text: "最初の計画から引き渡しまで、Northgo は日程、費用、税金、通関を見て、貨物が動けるようにします。",
            points: []
          }
        ],
        lists: [
          {
            id: "industries",
            title: "産業",
            items: ["石油・ガス", "オフショア・海事", "インフラ", "エネルギー", "鉄道", "再生可能エネルギー", "鉱業", "エンジニアリング・建設", "工業"]
          },
          {
            id: "project-services",
            title: "プロジェクトチームが扱うこと",
            items: [
              "用船とフレート管理",
              "路線調査と実現性の検討",
              "吊り、ヘビーリフト、複合輸送",
              "ドアツードア輸送",
              "工法、図面、技術文書",
              "通関と貿易書類",
              "輸送のリアルタイムな見える化"
            ]
          }
        ],
        closeTitle: "健康、安全、環境",
        closeText: "プロジェクトとヘビーリフトは、Northgo の健康、安全、環境のやり方に従います。貨物を守り、人の安全を守り、その輸送の影響を抑えます。作業員は貨物が通る地域に合わせて訓練を受けます。"
      },
      warehouse: {
        title: "倉庫物流｜Northgo",
        description: "台中港の倉庫。柔軟な保管、在庫管理、付加価値作業、オフショア貨物の取り扱い。",
        h1: "倉庫物流",
        lede: "保管は輸送全体の一部です。台中港の施設では、プロジェクト貨物とオフショア貨物を扱います。",
        introTitle: "倉庫は貨物に付く",
        intro: "倉庫はフォワーディングと別売りではありません。航路がすでに通る場所に置き、特にオフショアと大型案件で使います。",
        topics: [
          {
            id: "located-warehouses",
            title: "拠点倉庫",
            text: "台中港の施設は航路と道路に近く、船と倉庫のあいだで貨物が止まる時間を短くします。",
            points: []
          },
          {
            id: "flexible-storage",
            title: "柔軟な保管",
            text: "一般貨物、温度管理が必要な貨物、高額品や危険物のための安全なスペース。",
            points: []
          },
          {
            id: "inventory-management",
            title: "在庫管理",
            text: "倉庫管理システムが在庫の変化を示し、実際にある数量に対してピッキングできます。",
            points: []
          },
          {
            id: "value-added",
            title: "付加価値サービス",
            text: "貨物が再び出る前に、倉庫で行う作業です。",
            points: [
              "ピックアンドパック、キッティング、ラベリング。",
              "検査と再梱包。",
              "コンテナのリースと販売。オフショアと産業用途の DNV 認証コンテナを含みます。"
            ]
          },
          {
            id: "offshore-logistics",
            title: "オフショア物流",
            text: "台中港のスペースは、オフショア機器と部材に使います。洋上風力とその他の海事案件を含みます。Northgo は保管し、扱い、先へ送ります。",
            points: []
          }
        ]
      },
      agency: {
        title: "船舶代理店｜Northgo",
        description: "ドライバルク、タンカー、在来船、クルーズ、オフショア、特殊船、コンテナ船、自動車船の港湾代理店。",
        h1: "船舶代理店",
        lede: "港湾代理店と海事サービスです。着岸手配から船員関連まで扱います。",
        introTitle: "寄港の前から動く",
        intro: "Northgo は港湾当局と寄港の関係者と組み、着岸、荷役、出港までの待ち時間を短くします。代理の範囲は書類、船員、そして在港中の船主の利益です。",
        topics: [
          {
            id: "vessel-types",
            title: "船種",
            text: "代理店が扱う船種です。",
            groups: [
              { title: "ドライバルク", text: "農産物、セメント、クリンカ、粘土、石炭、肥料、穀物、鉱石、塩、鋼材。" },
              { title: "タンカー", text: "液化化学品、アンモニア、原油、CPP、LNG、LPG、潤滑油、糖蜜、パーム油、植物油。" },
              { title: "ブレークバルク", text: "在来雑貨船、プロジェクト貨物船、ヘビーリフト船。" },
              { title: "クルーズ", text: "漁業訓練船、ヨット、旅客船。" },
              { title: "オフショア", text: "浚渫船、ケーブル船、ジャッキアップ船、乗組員輸送船、ヘビーリフト船、サプライボート、作業バージ、サルベージタグ。" },
              { title: "特殊船", text: "ヘビーリフト船、半潜水船、ケーブル敷設バージ。" },
              { title: "コンテナ船", text: "パナマックスコンテナ船、超大型コンテナ船、フィーダー船。" },
              { title: "自動車船", text: "フェリーと RO/RO 船。" }
            ]
          }
        ],
        lists: [
          {
            id: "agency-services",
            title: "港湾代理店と海事サービス",
            groups: [
              {
                title: "港湾代理店",
                items: ["総代理店", "保護代理店", "補油代理店", "入渠代理店", "ハスバンドリー", "新造船の引き渡し"]
              },
              {
                title: "海事サービス",
                items: [
                  "係船と本船対応",
                  "洗濯、補油と給水、甲板・機関・糧食の補給",
                  "船用部品の受け渡し",
                  "共同海損、P&I、船体保険の対応",
                  "検査。船底の水中洗浄を含む",
                  "船員のロジスティクス",
                  "緊急救助とオフショアサルベージ"
                ]
              }
            ]
          }
        ],
        closeTitle: "デスクの働き方",
        closeText: "公開している強みは、経験のある管理、反応の速いチーム、密な連絡、迅速な対応、現地との関係、船主の利益を守ること、問題解決、オフショアの経験です。"
      },
      about: {
        title: "会社概要｜Northgo",
        description: "1988 年に台北で Max Seair Logistics として創業。2024 年 11 月 11 日に Northgo へ改名。",
        h1: "Northgo について",
        lede: "Northgo は 1988 年、台北で Max Seair Logistics Inc. として創業しました。2024 年 11 月 11 日に社名を Northgo としました。チームと仕事はそのままです。",
        visionTitle: "ビジョン",
        vision: "物流で最も信頼される名前になる。",
        visionBody: "各案件の基準は信頼です。次の問題でも、顧客が戻ってこられること。",
        missionTitle: "ミッション",
        mission: "物流を楽にする。",
        missionBody: "その貨物の役に立たない段取りを外し、顧客が追える輸送を残します。",
        valuesTitle: "価値観",
        valuesIntro: "Northgo の基準は、正しくこなすことより、正しいことをすることです。次の四つは、会社の全員の責任です。",
        values: [
          { title: "顧客を中心に置く", text: "判断とサービスは、顧客に生む価値で見ます。" },
          { title: "誠実と透明性", text: "今起きていることを、わかりやすい言葉で伝えます。" },
          { title: "革新と仕上がり", text: "より良い運び方がはっきりしたとき、サービスを変えます。" },
          { title: "持続可能性と責任", text: "作業の環境負荷を下げる方法を探し、オフィスのある地域への責任を持ちます。" }
        ],
        storyTitle: "沿革",
        story: [
          "会社は 1988 年に台北で始まりました。単なる受け渡しより丁寧に物流をするためです。その後 Max Seair Logistics Inc. として育ちました。",
          "2024 年に名前を変え、ブランドを仕事の方向に合わせました。Northgo は 2024 年 11 月 11 日からの名前です。仕事をする人は変わっていません。"
        ],
        changedTitle: "変わったこと",
        changed: "名前です。その日から、顧客に使うブランドは Northgo です。",
        sameTitle: "変わらないこと",
        same: "チーム、仕事の基準、そして 30 年を超えて積んだ顧客への約束です。"
      },
      contact: {
        title: "お問い合わせ｜Northgo",
        description: "台北本社、台中、高雄、ロサンゼルス、ホーチミン、東京、大阪。",
        h1: "お問い合わせ",
        lede: "台北本社へ書くか、その貨物に近いオフィスへ連絡してください。下記の住所と電話は、Northgo の問い合わせページで公開されているものです。",
        enquiryTitle: "問い合わせ",
        enquiryText: "フォームの内容は Northgo の問い合わせ記録に保存されます。台北本社へメールすることもできます。",
        enquiryLabel: "info.tpe@northgo.com へメール",
        form: {
          firstName: "名",
          lastName: "姓",
          company: "会社",
          email: "メール",
          phone: "電話番号",
          country: "国",
          countryEmpty: "選択してください",
          services: "関心のあるサービス",
          message: "メッセージ",
          terms: "規約に同意します",
          submit: "送信する",
          sending: "送信中",
          success: "受け付けました。",
          error: "送信できませんでした。もう一度お試しください。",
          invalid: "表示された欄を確認してください。",
          other: "その他",
          requiredNote: "* は必須です。"
        },
        locationsTitle: "オフィス",
        locationsIntro: "7 拠点：台北、台中、高雄、ロサンゼルス、ホーチミン、東京、大阪。",
        mapLabel: "拠点マップを開く"
      }
    }
  },
  vi: {
    skip: "Tới nội dung",
    navLabel: "Chính",
    localeLabel: "Ngôn ngữ",
    why: "Vì sao chọn Northgo",
    services: "Dịch vụ",
    about: "Giới thiệu",
    contact: "Liên hệ",
    enquire: "Gửi yêu cầu",
    menu: "Menu",
    home: "Trang chủ",
    footerNav: "Điều hướng",
    footerServices: "Dịch vụ",
    map: "Bản đồ văn phòng",
    member: "Thành viên của IATA, ISO 45001 và AEO.",
    rights: "© 2026 Northgo. Bảo lưu mọi quyền.",
    headOffice: "Trụ sở chính",
    tel: "Điện thoại",
    fax: "Fax",
    email: "Email",
    viewMaps: "Mở trên Google Maps",
    onThisPage: "Mục trong trang",
    pages: {
      home: {
        title: "Northgo | Làm logistics trở nên dễ dàng",
        description: "Giao nhận, hàng dự án, kho bãi và đại lý tàu. Northgo thành lập tại Đài Bắc năm 1988 và làm việc tại bảy văn phòng.",
        h1: "Làm logistics trở nên dễ dàng.",
        accent: "dễ dàng",
        lede: "Northgo lập kế hoạch và vận chuyển hàng cho doanh nghiệp giao thương qua biên giới. Công ty thành lập tại Đài Bắc năm 1988, với hơn 30 năm giao nhận, hàng dự án, kho bãi và đại lý cảng.",
        modesLabel: "Cách Northgo vận chuyển",
        modes: ["Đường biển", "Hàng không", "Đường bộ"],
        servicesTitle: "Bốn dịch vụ",
        servicesIntro: "Các mục dưới đây là việc Northgo đang làm. Mỗi trang nêu phương thức, loại hàng và các bước xử lý.",
        services: [
          { page: "freight", title: "Logistics hàng hóa", text: "Giao nhận đường biển, hàng không, đường bộ, và thông quan." },
          { page: "project", title: "Logistics dự án", text: "Lập kế hoạch và vận chuyển hàng quá khổ, quá nặng và giá trị cao." },
          { page: "warehouse", title: "Logistics kho bãi", text: "Lưu kho tại cảng Đài Trung, quản lý tồn kho và dịch vụ gia tăng." },
          { page: "agency", title: "Đại lý tàu", text: "Khai thác cảng, sắp xếp cầu bến và công việc thuyền viên." }
        ],
        whyTitle: "Vì sao chọn Northgo",
        whyBody: "Logistics là một ý ngắn, nhưng việc thì dài: tuyến, chứng từ, kho và lượt cập cảng. Việc của Northgo là để chủ hàng theo dõi được các bước đó.",
        whyPoints: [
          { title: "Một mạch việc", text: "Cùng một nhóm theo lô hàng, thay vì chuyển bạn qua các nhà cung cấp không liên quan." },
          { title: "Chuyên gia trực tiếp", text: "Người lập kế hoạch ở gần việc và các ngoại lệ." }
        ],
        stats: [
          { value: "360°", text: "Từ kế hoạch đến giao hàng cho lô hàng hoặc dự án." },
          { value: "24/7", text: "Hỗ trợ vận hành, 365 ngày mỗi năm." }
        ],
        teamTitle: "Phần nối thêm của đội logistics",
        teamBody: "Người biết lô hàng cũng biết các văn phòng ở châu Á và Bắc Mỹ.",
        teamPoints: [
          { title: "Chuyên gia logistics đáng tin", text: "Nhiều thập niên giao nhận và chuỗi cung ứng." },
          { title: "Linh hoạt theo hàng", text: "Tuyến và kho theo lô hàng, không chỉ một thực đơn cố định." },
          { title: "Gọi được người", text: "Có thể liên hệ đội vận hành vào bất kỳ giờ nào." },
          { title: "Đưa hàng đi tiếp", text: "Chuyên viên dùng mạng lưới văn phòng để hàng tiếp tục di chuyển." }
        ],
        certs: "Northgo công bố tư cách thành viên của IATA, ISO 45001 và AEO.",
        ctaTitle: "Hợp tác với Northgo",
        ctaText: "Viết cho trụ sở Đài Bắc về lô hàng, hoặc liên hệ văn phòng gần lô hàng nhất.",
        ctaLabel: "Liên hệ"
      },
      freight: {
        title: "Logistics hàng hóa | Northgo",
        description: "Giao nhận đường biển, hàng không, đường bộ và đường sắt, cùng thông quan cho hàng rời, hàng tinh và hàng gấp.",
        h1: "Logistics hàng hóa",
        lede: "Giao nhận trọn tuyến bằng đường biển, hàng không, đường bộ và đường sắt, kèm hỗ trợ thông quan cho hàng rời, hàng tinh và hàng gấp.",
        introTitle: "Một lô hàng được xử lý thế nào",
        intro: "Northgo lập tuyến, đặt vận chuyển và theo dõi đến khi giao. Chuyên viên ở nơi đi và nơi đến chỉnh kế hoạch theo chi phí, tuyến hoặc thời gian vận chuyển.",
        topics: [
          {
            id: "ocean-freight",
            title: "Vận tải biển",
            text: "Hàng biển xuất và nhập, trên lịch tàu của các hãng mà Northgo ký trực tiếp.",
            points: [
              "FCL: nguyên container trên các tuyến chính.",
              "LCL: hàng gom theo sản lượng khách của Northgo.",
              "Đội ở nơi đi và nơi đến xem chi phí, tuyến hoặc thời gian."
            ]
          },
          {
            id: "air-freight",
            title: "Vận tải hàng không",
            text: "Hàng không khi thời gian vận chuyển là việc quan trọng, thấy được hàng từ lúc lấy đến lúc đến, và tuyến được dựng theo lô hàng.",
            points: []
          },
          {
            id: "land-transport",
            title: "Vận tải đường bộ",
            text: "Xe tải sau khi hàng rời tàu hoặc máy bay. Đối tác nhận thông tin cần để giao đúng hạn, và có theo dõi trên đường.",
            points: []
          },
          {
            id: "customs-clearance",
            title: "Thông quan",
            text: "Trước khi nhập, mã HS quyết định thuế. Đội thông quan của Northgo kiểm tra phân loại đó để hàng có thể thông quan.",
            points: []
          }
        ]
      },
      project: {
        title: "Logistics dự án | Northgo",
        description: "Logistics cửa đến cửa cho hàng dự án quá khổ, quá nặng và giá trị cao, từ kỹ thuật đến giao hàng.",
        h1: "Logistics dự án",
        lede: "Vận chuyển cửa đến cửa cho dự án chìa khóa trao tay, từ thiết bị lớn đến linh kiện nhỏ nhất.",
        introTitle: "Hàng nặng cần kế hoạch trước",
        intro: "Hàng quá khổ và quá nặng cần chốt tuyến, giấy phép và phương án cẩu trước khi hàng chuyển. Northgo phối hợp việc đó qua mạng lưới văn phòng.",
        topics: [
          {
            id: "engineering",
            title: "Giải pháp kỹ thuật",
            text: "Đội kỹ thuật nội bộ chuẩn bị phương án cho dự án phức tạp, quy mô lớn.",
            points: []
          },
          {
            id: "project-management",
            title: "Quản lý dự án",
            text: "Từ kế hoạch đầu đến lúc giao, Northgo theo dõi tiến độ, chi phí, thuế và thông quan để hàng di chuyển được.",
            points: []
          }
        ],
        lists: [
          {
            id: "industries",
            title: "Ngành",
            items: ["Dầu khí", "Ngoài khơi và hàng hải", "Hạ tầng", "Năng lượng", "Đường sắt", "Năng lượng tái tạo", "Khai thác mỏ", "Kỹ thuật và xây dựng", "Công nghiệp"]
          },
          {
            id: "project-services",
            title: "Việc đội dự án đảm nhận",
            items: [
              "Quản lý thuê tàu và cước",
              "Khảo sát tuyến và nghiên cứu khả thi",
              "Cẩu, hàng siêu trọng và vận tải đa phương thức",
              "Vận chuyển cửa đến cửa",
              "Biện pháp thi công, bản vẽ và hồ sơ kỹ thuật",
              "Thông quan và chứng từ thương mại",
              "Theo dõi lô hàng theo thời gian thực"
            ]
          }
        ],
        closeTitle: "Sức khỏe, an toàn và môi trường",
        closeText: "Hàng dự án và hàng siêu trọng theo cách làm về sức khỏe, an toàn và môi trường của Northgo: bảo vệ hàng, giữ an toàn cho người, và hạn chế tác động của chuyến đi. Đội ngũ được đào tạo theo khu vực hàng đi qua."
      },
      warehouse: {
        title: "Logistics kho bãi | Northgo",
        description: "Kho tại cảng Đài Trung, với lưu kho linh hoạt, quản lý tồn kho, dịch vụ gia tăng và xử lý hàng ngoài khơi.",
        h1: "Logistics kho bãi",
        lede: "Lưu kho nằm trong cả chặng vận chuyển, gồm cơ sở tại cảng Đài Trung cho hàng dự án và hàng ngoài khơi.",
        introTitle: "Kho đi cùng lô hàng",
        intro: "Kho không phải sản phẩm tách khỏi giao nhận. Hàng được giữ ở nơi tuyến đã chạy qua, nhất là với hàng ngoài khơi và dự án lớn.",
        topics: [
          {
            id: "located-warehouses",
            title: "Kho theo vị trí",
            text: "Cơ sở tại cảng Đài Trung nằm gần tuyến biển và đường bộ, nên hàng ít dừng giữa tàu và kho.",
            points: []
          },
          {
            id: "flexible-storage",
            title: "Lưu kho linh hoạt",
            text: "Hàng thông thường, hàng cần kiểm soát nhiệt độ, và chỗ an toàn cho hàng giá trị cao hoặc hàng nguy hiểm.",
            points: []
          },
          {
            id: "inventory-management",
            title: "Quản lý tồn kho",
            text: "Hệ thống quản lý kho cho thấy tồn kho đang đổi, để soạn hàng đúng số lượng đang có.",
            points: []
          },
          {
            id: "value-added",
            title: "Dịch vụ gia tăng",
            text: "Việc làm tại kho trước khi hàng đi tiếp.",
            points: [
              "Soạn và đóng gói, kitting, dán nhãn.",
              "Kiểm tra và đóng gói lại.",
              "Cho thuê và bán container, gồm container đạt chứng nhận DNV cho dùng ngoài khơi và công nghiệp."
            ]
          },
          {
            id: "offshore-logistics",
            title: "Logistics ngoài khơi",
            text: "Diện tích tại cảng Đài Trung dùng cho thiết bị và cấu kiện ngoài khơi, gồm điện gió ngoài khơi và các dự án hàng hải khác. Northgo lưu kho, xử lý và gửi tiếp hàng đó.",
            points: []
          }
        ]
      },
      agency: {
        title: "Đại lý tàu | Northgo",
        description: "Đại lý cảng cho hàng rời khô, tàu dầu, hàng rời, du thuyền, tàu ngoài khơi, tàu chuyên dụng, tàu container và tàu chở ô tô.",
        h1: "Đại lý tàu",
        lede: "Đại lý cảng và dịch vụ hàng hải, từ sắp xếp cầu bến đến công việc thuyền viên.",
        introTitle: "Xử lý trước khi tàu cập",
        intro: "Northgo làm việc với cảng vụ và các bên của lượt cập để tàu cập cầu, làm hàng và rời cảng với ít thời gian chờ. Phần việc gồm chứng từ, thuyền viên và lợi ích của chủ tàu khi tàu ở cảng.",
        topics: [
          {
            id: "vessel-types",
            title: "Loại tàu",
            text: "Bàn đại lý xử lý các nhóm tàu sau.",
            groups: [
              { title: "Hàng rời khô", text: "Nông sản, xi măng, clinker, đất sét, than, phân bón, ngũ cốc, quặng, muối và thép." },
              { title: "Tàu dầu", text: "Hóa chất hóa lỏng, amoniac, dầu thô, CPP, LNG, LPG, dầu nhờn, mật mía, dầu cọ và dầu thực vật." },
              { title: "Hàng rời", text: "Tàu hàng tổng hợp thông thường, tàu hàng dự án và tàu siêu trọng." },
              { title: "Du thuyền", text: "Tàu huấn luyện thủy sản, du thuyền và tàu khách." },
              { title: "Ngoài khơi", text: "Tàu nạo vét, tàu cáp, tàu jack-up, tàu đưa đón thuyền viên, tàu nâng nặng, tàu tiếp tế, sà lan công trình và tàu kéo cứu hộ." },
              { title: "Tàu chuyên dụng", text: "Tàu siêu trọng, tàu bán chìm và sà lan rải cáp." },
              { title: "Tàu container", text: "Tàu container Panamax, tàu container siêu lớn và tàu feeder." },
              { title: "Tàu chở ô tô", text: "Phà và tàu RO/RO." }
            ]
          }
        ],
        lists: [
          {
            id: "agency-services",
            title: "Đại lý cảng và dịch vụ hàng hải",
            groups: [
              {
                title: "Đại lý cảng",
                items: [
                  "Đại lý cảng đầy đủ",
                  "Đại lý bảo vệ",
                  "Đại lý tiếp nhiên liệu",
                  "Đại lý lên đà",
                  "Đại lý husbandry",
                  "Bàn giao tàu đóng mới"
                ]
              },
              {
                title: "Dịch vụ hàng hải",
                items: [
                  "Nằm bờ và xử lý tàu",
                  "Giặt là, nhiên liệu và nước, tiếp tế boong, máy hoặc lương thực",
                  "Giao phụ tùng tàu",
                  "Xử lý tổn thất chung, P&I và bảo hiểm thân tàu",
                  "Giám định và kiểm tra, gồm vệ sinh thân tàu dưới nước",
                  "Hậu cần thuyền viên",
                  "Cứu hộ khẩn cấp và cứu hộ ngoài khơi"
                ]
              }
            ]
          }
        ],
        closeTitle: "Cách bàn đại lý làm việc",
        closeText: "Các điểm mạnh đã công bố là quản lý có kinh nghiệm, đội phản hồi nhanh, liên lạc sát, phản ứng nhanh, quan hệ tại chỗ, bảo vệ lợi ích chủ tàu, giải quyết vấn đề và kinh nghiệm ngoài khơi."
      },
      about: {
        title: "Giới thiệu | Northgo",
        description: "Thành lập tại Đài Bắc năm 1988 với tên Max Seair Logistics. Đổi tên thành Northgo ngày 11 tháng 11 năm 2024.",
        h1: "Giới thiệu Northgo",
        lede: "Northgo thành lập tại Đài Bắc năm 1988 với tên Max Seair Logistics Inc. Ngày 11 tháng 11 năm 2024, công ty lấy tên Northgo. Đội ngũ và công việc giữ nguyên.",
        visionTitle: "Tầm nhìn",
        vision: "Trở thành cái tên đáng tin cậy nhất trong logistics.",
        visionBody: "Thước đo của mỗi việc là sự tin cậy: khách hàng còn muốn quay lại với vấn đề tiếp theo.",
        missionTitle: "Sứ mệnh",
        mission: "Làm logistics trở nên dễ dàng.",
        missionBody: "Bỏ các bước không giúp lô hàng, và để lại một chuyến đi mà khách hàng theo dõi được.",
        valuesTitle: "Giá trị",
        valuesIntro: "Northgo đặt chuẩn là làm điều đúng, không chỉ làm cho đúng việc. Mọi người trong công ty chịu trách nhiệm với bốn điều này.",
        values: [
          { title: "Lấy khách hàng làm trung tâm", text: "Quyết định và dịch vụ được nhìn bằng giá trị tạo ra cho khách hàng." },
          { title: "Chính trực và minh bạch", text: "Nói cho khách hàng việc đang xảy ra, bằng lời dễ hiểu." },
          { title: "Đổi mới và làm cho tốt", text: "Dịch vụ đổi khi có cách vận chuyển rõ hơn." },
          { title: "Bền vững và trách nhiệm", text: "Tìm cách giảm tác động môi trường của việc làm, và chịu trách nhiệm với cộng đồng quanh văn phòng." }
        ],
        storyTitle: "Câu chuyện",
        story: [
          "Công ty bắt đầu tại Đài Bắc năm 1988, để làm logistics cẩn thận hơn một lần chuyển tay. Sau đó lớn lên với tên Max Seair Logistics Inc.",
          "Năm 2024, tên đổi để thương hiệu khớp hướng công việc. Northgo là tên từ ngày 11 tháng 11 năm 2024. Người làm việc không đổi."
        ],
        changedTitle: "Điều đã đổi",
        changed: "Tên. Từ ngày đó, thương hiệu dùng với khách hàng là Northgo.",
        sameTitle: "Điều giữ nguyên",
        same: "Đội ngũ, chuẩn công việc, và cam kết với khách hàng trong hơn ba mươi năm."
      },
      contact: {
        title: "Liên hệ | Northgo",
        description: "Trụ sở Đài Bắc, cùng Đài Trung, Cao Hùng, Los Angeles, Thành phố Hồ Chí Minh, Tokyo và Osaka.",
        h1: "Liên hệ",
        lede: "Viết cho trụ sở Đài Bắc, hoặc liên hệ văn phòng gần lô hàng nhất. Địa chỉ và số dưới đây là dữ liệu công bố trên trang liên hệ của Northgo.",
        enquiryTitle: "Yêu cầu",
        enquiryText: "Nội dung biểu mẫu được lưu vào hồ sơ yêu cầu của Northgo. Bạn cũng có thể gửi email cho trụ sở Đài Bắc.",
        enquiryLabel: "Gửi email tới info.tpe@northgo.com",
        form: {
          firstName: "Tên",
          lastName: "Họ",
          company: "Công ty",
          email: "Email",
          phone: "Số điện thoại",
          country: "Quốc gia",
          countryEmpty: "Chọn một",
          services: "Bạn quan tâm dịch vụ nào?",
          message: "Tin nhắn",
          terms: "Tôi chấp nhận điều khoản",
          submit: "Gửi yêu cầu",
          sending: "Đang gửi",
          success: "Đã nhận yêu cầu của bạn.",
          error: "Gửi không thành công. Hãy thử lại.",
          invalid: "Hãy kiểm tra các trường được đánh dấu.",
          other: "Khác",
          requiredNote: "Các trường có * là bắt buộc."
        },
        locationsTitle: "Văn phòng",
        locationsIntro: "Bảy văn phòng: Đài Bắc, Đài Trung, Cao Hùng, Los Angeles, Thành phố Hồ Chí Minh, Tokyo và Osaka.",
        mapLabel: "Mở bản đồ văn phòng"
      }
    }
  }
};

module.exports = {
  origin: "https://www.northgo.com",
  offices: offices,
  pages: pages,
  locales: locales,
  copy: copy
};
