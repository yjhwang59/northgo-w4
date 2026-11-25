# Northgo 官網示範站（northgo-w4）

這是用大躍（Northgo）官網內容重新做的**示範網站**，給「AI 系統開發入門班」當教學範例。
本資料夾自 [northgo-demo.aidc.work](https://northgo-demo.aidc.work/) 對應的示範站原始碼複製而來，架構與內容相同（v0.1.7）。
它示範一個網站怎麼從「只有畫面」一步步變成「能收資料、能自己管理」的系統。

- 參考線上示範：https://northgo-demo.aidc.work/
- 正式官網（內容來源）：https://www.northgo.com/
- 本專案 Cloudflare Worker 名稱為 `northgo-w4`（未綁定示範站網域，避免蓋掉線上 demo）

> 給 Cursor 的提醒：開始改任何東西前，請先讀完這份 README。

---

## 這個網站能做什麼

| 功能 | 說明 |
|---|---|
| 四種語言 | 英文、繁體中文、日文、越南文 |
| 公司介紹 | 首頁、關於我們、四個服務頁（貨運物流、專案物流、倉儲物流、船務代理） |
| 詢價表單 | 「聯絡我們」頁可以填寫詢價，送出前會檢查必填欄位、Email 和電話格式 |
| 存進資料庫 | 送出的詢價會存起來，不會因為關掉網頁就不見 |
| 後台 | 登入後左側樹狀選單可管理詢價、網站文案、圖片媒體、動態頁面；管理者還能管理帳號、角色與選單 |

---

## 資料夾裡有什麼

| 位置 | 用途（白話） |
|---|---|
| `content/site.js` | **網站上所有的文字**都在這裡。要改文案，先改這個檔案 |
| `content/cms-fields.json` | 後台可以修改哪些文字欄位 |
| `content/countries.json` | 詢價表單「國家」下拉選單的選項 |
| `assets/` | 網頁的樣式（`.css`）和互動功能（`.js`），例如表單送出、後台畫面 |
| `build.mjs` | 把 `content/` 的文字套進版面，產生每一頁網頁 |
| `dist/` | 產生出來的網頁（**不要直接改這裡**，每次產生都會被蓋掉） |
| `src/worker.js` | 網站的「後端」：收表單、存資料庫、處理後台登入 |
| `src/validate-enquiry.mjs` | 檢查詢價表單有沒有填對 |
| `src/auth.mjs` | 後台密碼加密與登入用的小工具 |
| `migrations/` | 資料庫表格與後續升級（例如角色、媒體、動態頁） |
| `presentations/enquiry-form-deck.html` | 說明詢價表單流程的簡報 |
| `scripts/` | 在自己電腦上啟動網站的小程式 |
| `wrangler.jsonc` | 上線到 Cloudflare 的設定 |
| `.dev.vars.example` | 本機設定檔的範本（真正的 `.dev.vars` 放密碼，不要上傳到 GitHub） |

---

## 資料庫裡有哪些表格

| 表格 | 存什麼 |
|---|---|
| `enquiries` | 客戶詢價：姓名、公司、Email、電話、國家、想詢問的服務、留言、狀態（新進／已讀／已封存） |
| `admins` | 後台帳號（密碼加密；角色為 `admin` 或 `editor`；另有顯示名稱、頭像、最後登入時間） |
| `sessions` | 誰目前是登入狀態 |
| `content_overrides` | 在後台改過的網站文字 |
| `media_assets` | 後台上傳的圖片中繼資料（檔案本體在 R2） |
| `cms_pages` | 後台建立的動態頁面（草稿／已發布） |
| `admin_menus` | 後台左側功能選單（群組與功能、排序、是否只給管理者） |

角色說明：

| 角色 | 可以做什麼 |
|---|---|
| `admin` | 詢價、文案、媒體、動態頁面、使用者帳號（含頭像與顯示名稱）、選單 |
| `editor` | 詢價、文案、媒體、動態頁面（不能管帳號）；可在「我的帳號」改自己的顯示名稱、密碼與頭像 |

---

## 在自己電腦上跑起來

需要先安裝 [Node.js](https://nodejs.org/)。

1. 用 Cursor 打開這個資料夾。
2. 打開終端機，第一次先安裝套件：
   ```
   npm install
   ```
3. 啟動網站：
   ```
   npm run start:local
   ```
   第一次會自動建立 `.dev.vars` 和本機資料庫。
4. 打開 `.dev.vars`，設定後台帳號 `ADMIN_USERNAME`，並把 `ADMIN_PASSWORD` 改成 **8 個字以上**的密碼。登入時會用這組帳密建立（或同步）同名管理者；正式環境請用 `wrangler secret put` 設定同樣兩項。
5. 用瀏覽器打開終端機顯示的網址（通常是 http://localhost:8787 ）。

| 想看的頁面 | 網址 |
|---|---|
| 首頁 | `/` |
| 繁體中文首頁 | `/zh-tw` |
| 聯絡我們（詢價表單） | `/zh-tw/contact` |
| 後台登入 | `/admin/login` |
| 動態頁面（範例） | `/zh-tw/pages/你的-slug`（英文為 `/pages/你的-slug`） |
| 上傳圖片 | `/media/檔名key` |

本機 R2 會由 `wrangler dev` 模擬；正式環境要先在 Cloudflare 建立 bucket `northgo-w4-media`（並更新 `wrangler.jsonc` 的 D1 `database_id`），再由人執行 `npm run deploy`。

---

## 常用指令

| 指令 | 做什麼 |
|---|---|
| `npm run start:local` | 在自己電腦上啟動整個網站（含資料庫和後台） |
| `npm run build` | 只重新產生網頁到 `dist/` |
| `npm run preview` | 只看靜態網頁（沒有表單和後台） |
| `npm run check` | 檢查網頁和表單檢查規則有沒有壞掉 |
| `npm run deploy` | 上線到 Cloudflare（需要有權限） |

---

## 想改東西時從哪裡下手

- **改網站文字** → `content/site.js`，改完執行 `npm run build`
- **改顏色、字體、排版** → `assets/site.css`
- **表單多一個欄位** → 要一起改：表單畫面（`build.mjs`）、檢查規則（`src/validate-enquiry.mjs`）、資料庫（`migrations/` 新增一個檔案）
- **後台多一個可改的文字** → `content/cms-fields.json`

給 Cursor 下指令的範例：

```
請先讀 README.md。我想在聯絡表單加一個「預計出貨日期」欄位，
請告訴我要改哪些檔案，先不要動手，等我確認。
```

---

## 這個範例怎麼搭配課程

| 階段 | 看哪裡 |
|---|---|
| 畫面（線框圖 → 首版） | `dist/zh-tw/index.html`、`dist/zh-tw/contact/index.html` |
| 內容和版面分開 | `content/site.js` + `build.mjs` |
| 表單和檢查 | `assets/enquiry.js` + `src/validate-enquiry.mjs` |
| 存進資料庫 | `migrations/0001_init.sql` + `src/worker.js` |
| 後台和登入 | `/admin`、`src/auth.mjs`、`assets/admin.js` |
| 角色、媒體、動態頁 | `migrations/0002_admin_cms_media.sql`、`src/worker.js` |
| 後台左側選單 | `migrations/0004_admin_menus.sql`、`assets/admin.js` |
| 上線 | `wrangler.jsonc` + `npm run deploy` |

---

## 注意事項

- 這是**教學用示範站**，不是大躍正式官網。
- `.dev.vars` 裡有密碼，**不要上傳到 GitHub**，也不要貼到 LINE 或聊天室。
- 請不要在示範站填真實的客戶資料。
