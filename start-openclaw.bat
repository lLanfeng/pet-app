@echo off
echo Starting OpenClaw Gateway...
start "" cmd /k "openclaw gateway start"
timeout /t 3 /nobreak >nul
start http://localhost:18789
