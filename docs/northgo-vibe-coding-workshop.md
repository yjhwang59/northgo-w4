# Northgo Vibe Coding 工作坊

以 Cursor Agent 實作功能，以 Codex 審查差異，再由學員用瀏覽器、API 與 Git 證據完成驗收。建議安排 6 小時實作，休息另計。對象為具備基本 HTML、JavaScript 與 Git 操作能力的企業開發者或碩士在職專班學員。

## 學習目標

1. 從瀏覽器表單追蹤資料到 Worker、D1 與後台。
2. 把自然語言需求寫成有範圍、反例與驗收條件的任務。
3. 讓兩個 Agent 根據同一份規格交接，用測試證據決定是否採納審查意見。
4. 交付可重現、可審查的 Git 變更。

## 講師備課

- 準備並固定一個乾淨的教學分支與 commit，包含詢價、後台、migration、本機啟動腳本及 `.dev.vars.example`。本教材編寫時，這些功能位於工作目錄，現有 `HEAD`（`1d703f4`）是靜態站版本。請用乾淨 clone 預演，並把 commit SHA 提供給學員。預演時確認本機 migration、瀏覽器送單及後台查詢均成功。
- 在教學分支的根目錄準備一份共用 `AGENTS.md`，寫明先讀 README、以來源檔修改、以本機 D1 與合成資料驗收、修改後重建並檢查。開課時請兩個工具各自複述已讀規則，確認讀到同一份專案上下文。
- 確認學員能登入 Cursor 與 Codex。可在 Cursor 裡開啟 OpenAI Codex 擴充套件，分別使用 Cursor Agent 與 Codex 面板。課堂交接資料使用任務規格、Git diff 與測試輸出。
- 使用本機 D1、獨立練習分支和假資料。首次啟動後、首次後台登入前，在本機 `.dev.vars` 設定至少 8 字元的練習密碼。帳密、Session Cookie 與客戶資料一律留在本機。Windows PowerShell 若限制執行 `npm.ps1`，可用 `npm.cmd` 執行同一命令。
- 既有的 [表單流程簡報](../presentations/enquiry-form-deck.html) 可作為表單需求素材。第 2 頁仍描述舊版的 Email 入口，實作流程以本教材與教學分支為準。
- 本次備課驗證已通過 build 與兩項既有檢查，並以記憶體 SQLite 執行 Worker 的詢價寫入與後台授權測試。本機 Wrangler migration 在目前環境回報 `fetch failed`，教室環境仍需完成瀏覽器與 D1 的整合預演。

```bash
git status --short
git switch -c lab/enquiry-service
npm ci
npm run build
npm run check
npm run start:local
```

開啟終端機印出的本機網址。以 `/zh-tw/contact` 驗證前台，以 `/admin/login` 驗證後台。`start:local` 會套用本機 migration 並建置網站。每次修改產生頁面的來源或前端資產後，重新執行 build，再重跑檢查。

## 授課節奏

| 時間 | 教學活動 | 學員產出 |
| --- | --- | --- |
| 45 分 | 啟動基線，送出一筆假詢價，登入後台找回紀錄 | 一筆基線紀錄與回歸檢查輸出 |
| 45 分 | 用 Cursor 追蹤資料流，把使用者故事改寫為可驗收需求 | 需求卡、修改計畫、預期檔案 |
| 90 分 | 先做一個語系和一個服務，確認後擴到四語系與四服務頁 | 可展示的功能、聚焦的 Git diff |
| 60 分 | 開新 Codex 對話審查 diff，演練無效參數、資料驗證及權限測試 | 可重現的審查報告與採納決定 |
| 75 分 | 修正發現的問題，雙人交叉操作，驗證瀏覽器與後台 | 驗收紀錄與修正版 |
| 45 分 | 示範成果，說明取捨，整理 PR 摘要與測試證據 | PR 或本機可審查 commit，附差異、測試與審查回覆 |

## 專案導讀

1. `content/site.js` 提供四語系內容，`build.mjs` 產出服務頁與聯絡頁，建置產物在 `dist/`。
2. `assets/enquiry.js` 讀取選取的服務並送往 `POST /api/enquiries`。Worker 使用 `src/validate-enquiry.mjs` 檢查資料，驗證通過後寫入 `enquiries`。
3. `assets/admin.js` 經由受登入保護的 `GET /api/admin/enquiries` 讀取紀錄。用瀏覽器 Network 面板對照請求、回應與後台顯示。
4. `npm run check` 執行靜態產物與詢價驗證函式的檢查。瀏覽器互動、資料庫寫入與登入權限由下列驗收步驟補足。

## 實作任務｜從服務頁帶入詢價服務

**使用者故事**　訪客看完服務介紹後，希望點擊詢價按鈕直接帶入目前服務，減少重選操作，同時保留增選或取消的彈性。

**範圍**　四種語言的四個服務頁各新增服務專屬詢價連結。沿用既有服務 ID、表單、API 與 schema。已知起點為 `build.mjs` 的服務頁模板與 `assets/enquiry.js`。先由學員確認實際修改範圍。

| 編號 | 操作 | 預期結果 |
| --- | --- | --- |
| A1 | 從繁中貨運物流服務頁點擊新增的詢價連結 | 進入 `/zh-tw/contact?service=freight#enquiry`，只預選貨運物流 |
| A2 | 逐一開啟四個語系的各服務頁連結 | 保留原語系，對應 `freight`、`project`、`warehouse` 或 `agency`，且可自行增選或取消 |
| A3 | 直接開啟聯絡頁，或傳入 `?service=unknown` | 欄位可手動操作，服務維持預設未勾選，頁面正常運作 |
| A4 | 預選貨運後取消，改選倉儲，填入完整假資料並送出 | Network 顯示 `services: ["warehouse"]` 與 HTTP 201，登入後台只看到倉儲 |
| A5 | 以 JSON 向 `POST /api/enquiries` 送出格式錯誤的 Email | HTTP 400，回傳欄位包含 `email`，後台無新增對應紀錄 |
| A6 | 在無痕視窗讀取 `/api/admin/enquiries` | HTTP 401，回應未包含詢價資料 |

測試時可使用 `learner@example.com`、電話 `00000000`、公司「Workshop Demo」及唯一的合成訊息標記。測試 A5 可在瀏覽器開發者工具重送 A4 的 JSON 請求，改壞 Email 並保留 `Content-Type: application/json` 與 `Accept: application/json`。用 Network 回應和後台訊息標記核對結果。可加測停用 JavaScript 後仍能手動勾選及送出。

### Cursor 規劃提示詞

```text
先讀 README.md、build.mjs、content/site.js、assets/enquiry.js 和 src/worker.js。
請以唯讀方式追蹤「服務頁 → 聯絡頁 → POST /api/enquiries → D1 → 後台」。
需求是四語系的四個服務頁能連到同語系聯絡頁，預選對應服務。
請指出實際的檔案與函式，提出最小變更及 A1–A6 的驗收步驟。
未知參數應安全忽略，使用者要能增選或取消。等我確認計畫再改檔。
```

確認計畫後，請 Cursor 先完成 A1，再擴展其他服務及語系。學員每輪檢查 `git diff`、重新建置並操作一次。當現象與預期不符，提供 URL、操作步驟、實際結果和預期結果，請 Agent 縮小修改。

### Codex 審查提示詞

```text
請以唯讀方式檢查本機 Git diff 與詢價服務預選的 A1–A6 規格。
優先檢查語系路徑、未知參數是否安全、使用者取消後的 payload、
驗證失敗是否寫入資料，以及未登入是否能讀到詢價。
可執行本機建置與檢查。每項發現附檔案行號、重現步驟與預期／實際結果。
標明哪些結論來自程式碼閱讀、哪些已實跑、哪些仍需瀏覽器驗證。
```

審查前執行 `git status --short`，若有新增檔案也提供給 Codex 查閱。學員逐項重現問題，記錄採納或退回的理由，再指派一個 Agent 修正。

## 評量 Rubric

| 指標 | 配分 | 滿分條件 |
| --- | --- | --- |
| 需求與規劃 | 20 | 寫出使用者故事、影響範圍、驗收條件與反例 |
| 功能與整合 | 35 | A1–A4 通過，資料從使用者實際選擇一路反映到後台 |
| 驗證與權限 | 25 | build/check 通過，A5–A6 有可重現的證據 |
| Agent 協作與交付 | 20 | 提供規格、diff、審查處置、測試紀錄與 PR 摘要 |

建議 80 分及格。A5 與 A6 均為交付門檻。交付前以 `git diff --check` 檢查差異，確認檢附的輸出與畫面只含合成資料，並記錄實測與待驗證項目。

## 進階題｜可選填的預計出貨日期

把日期做成第二次課程的跨層練習。以 `YYYY-MM-DD` 表示不帶時區的曆日，接受空值與真實曆日，拒絕如 `2027-02-30` 的日期。讓學員先寫下資料契約，再串起多語標籤、前端送出、Worker 驗證、增量 D1 migration 和後台顯示。驗收包含空值、合法日期、非法日期、既有資料能正常讀取，以及 JavaScript 與原生表單兩種提交路徑。

## 官方文件

- [Cursor Agent](https://cursor.com/docs/agent/overview) · [Cursor Rules](https://cursor.com/docs/rules)
- [Codex IDE 擴充套件](https://learn.chatgpt.com/docs/codex/ide) · [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Cloudflare D1 本機開發](https://developers.cloudflare.com/d1/best-practices/local-development/)
