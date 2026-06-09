@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -File "%~dp0wyniki-formularz.ps1"
if errorlevel 1 pause
