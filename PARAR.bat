@echo off
title BlackTube - Parando...
echo.
echo  Fechando BlackTube...
echo.
for %%P in (8000 3010) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr :%%P ^| findstr LISTENING') do (
        taskkill /PID %%A /T /F >nul 2>nul
    )
)
echo  Pronto. Tudo fechado.
timeout /t 2 /nobreak >nul
