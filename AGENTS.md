# AGENTS.md

給所有 AI 編輯工具（Claude Code、Codex、Cursor）共用的規則。專案介紹和資料夾說明請看 [README.md](README.md)，這裡只寫「多個工具一起改時」要遵守的事。

## 1. 工作區：一個工具一個分支

- **不要在同一個資料夾同時讓兩個工具改檔案。** 每個工具用自己的 git worktree 和分支：
  ```
  git worktree add ../northgo-codex -b codex/<任務名稱>
  git worktree add ../northgo-cursor -b cursor/<任務名稱>
  ```
  Claude Code 用 `claude/<任務名稱>`（桌面版可自動建立 worktree）。
- 新的 worktree 第一次要先：
  1. `npm install`
  2. `npm run start:local`（會自動建立 `.dev.vars` 和本機資料庫；`.dev.vars` 不在 git 裡，每個 worktree 各一份）
- 本機伺服器會自動在 8787–8790 找空的連接埠，最多四個可同時跑。啟動後請看終端機顯示的網址，不要假設一定是 8787。

## 2. 分工：以檔案為單位

開始動手前，先說清楚這次會改哪些檔案。以下檔案一次只能有一個分支在改：

| 檔案 | 原因 |
|---|---|
| `content/site.js` | 全站文字都在這裡，最容易衝突 |
| `build.mjs` | 全站版面和表單畫面 |
| `src/worker.js` | 後端所有路由 |
| `migrations/` | 新增 migration 時檔名編號不能撞號（`0002_...`、`0003_...`） |
| `package.json`、`package-lock.json` | 版本號和套件 |

已經存在的 migration 不要修改，要改資料庫就新增一個檔案。

## 3. 不要動的東西

- `dist/`：由 `npm run build` 產生，不要手改，也不要提交。
- `.dev.vars`：有密碼，不要提交、不要貼到對話裡。
- `.wrangler/`、`node_modules/`：本機產物。

## 4. 完成前的檢查

每個分支在合併前都要通過：

```
npm run build
npm run check
```

`build.mjs` 會清空 `dist/` 內的檔案、不刪資料夾本身，避免 Windows 上 `wrangler dev` 鎖住資料夾時出現 `EBUSY: rmdir dist`。若連內部檔案都被鎖而建置失敗，再停掉**同一個資料夾**裡的 `wrangler dev`，或改到自己的 worktree 建置。

`check-dist.mjs` 會檢查頁數（28 頁）和 sitemap（29 筆）。新增或刪除頁面時，要一起更新這兩個數字。

## 5. 合併與上線

- 改完提交到自己的分支，透過 PR 或 `git merge` 合回 `main`，一次合一個分支，合完再跑一次第 4 節的檢查。
- **只從 `main` 上線，由人來執行 `npm run deploy`。** AI 工具不要自行部署，也不要對線上 D1 執行 `--remote` 的指令。
- 不要 force push `main`。

## 6. 其他

- 這是教學示範站，不要填入真實客戶資料。
- 回覆和文件用繁體中文，用語保持白話（參考 README 的寫法）。
