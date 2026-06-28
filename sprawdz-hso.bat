@echo off
setlocal

set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if not exist "%NODE_EXE%" if "%NODE_EXE%"=="node" goto run
if not exist "%NODE_EXE%" (
  echo Nie znaleziono Node.js.
  exit /b 1
)

:run
"%NODE_EXE%" "%~dp0scripts\test-hso.mjs"
exit /b %errorlevel%
