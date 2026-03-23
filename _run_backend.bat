@echo off
cd /d "%~dp0backend"
python -m app.main >> "%~dp0backend_runtime.log" 2>&1
