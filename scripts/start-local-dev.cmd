@echo off
setlocal
cd /d "%~dp0.."
node scripts\start-local-dev.mjs
exit /b %ERRORLEVEL%
