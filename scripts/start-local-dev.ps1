# Start northgo local Worker (build + D1 migrate + wrangler dev).
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
node .\scripts\start-local-dev.mjs
