@echo off
setlocal
title BlackTube - Iniciando...
color 0A
echo.
echo  =============================================
echo        B L A C K T U B E  -  Iniciando
echo  =============================================
echo.

cd /d "%~dp0"
set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"
set "BACKEND_SEED_LOG=%ROOT%backend_seed.log"
set "BACKEND_LOG=%ROOT%backend_runtime.log"
set "FRONTEND_LOG=%ROOT%frontend_runtime.log"

echo [0/5] Liberando portas 8000 e 3010...
for %%P in (8000 3010) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr :%%P ^| findstr LISTENING') do (
        taskkill /PID %%A /F >nul 2>nul
    )
)
echo      OK

echo [1/5] Instalando backend...
cd /d "%BACKEND_DIR%"
pip install -r requirements.txt -q 2>nul
echo      OK

echo [2/5] Criando banco de dados...
python -m app.seed > "%BACKEND_SEED_LOG%" 2>&1
if errorlevel 1 (
    echo      AVISO: seed falhou. Veja backend_seed.log
) else (
    echo      OK
)

echo [3/5] Ligando backend em background...
if exist "%BACKEND_LOG%" del /f /q "%BACKEND_LOG%" >nul 2>nul
start "BlackTube Backend" /min "%ROOT%_run_backend.bat"
echo      OK

echo [4/5] Ligando frontend em background...
cd /d "%FRONTEND_DIR%"
if not exist node_modules (
    echo      Instalando dependencias do frontend - primeira vez, demora um pouco...
    call npm.cmd install
)
if exist "%FRONTEND_LOG%" del /f /q "%FRONTEND_LOG%" >nul 2>nul
start "BlackTube Frontend" /min "%ROOT%_run_frontend.bat"
echo      OK

echo [5/5] Esperando servicos responderem...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ProgressPreference='SilentlyContinue';" ^
  "$backendOk=$false; $frontendOk=$false;" ^
  "for($i=0;$i -lt 45;$i++){" ^
  "  try { Invoke-WebRequest 'http://127.0.0.1:8000/health' -UseBasicParsing -TimeoutSec 2 | Out-Null; $backendOk=$true } catch {}" ^
  "  try { Invoke-WebRequest 'http://127.0.0.1:3010' -UseBasicParsing -TimeoutSec 2 | Out-Null; $frontendOk=$true } catch {}" ^
  "  if($backendOk -and $frontendOk){ exit 0 }" ^
  "  Start-Sleep -Seconds 1" ^
  "};" ^
  "exit 1"

if errorlevel 1 (
    echo.
    echo  AVISO: Um dos servicos demorou mais que o esperado.
    echo  Backend log:  %BACKEND_LOG%
    echo  Frontend log: %FRONTEND_LOG%
) else (
    echo      OK
)

echo.
echo  =============================================
echo     PRONTO! Abrindo no navegador...
echo  =============================================
echo.
echo  Backend:  http://localhost:8000/docs
echo  Frontend: http://localhost:3010
echo.
echo  Login: lucas@xpansive.com / black777
echo.
start http://127.0.0.1:3010
echo  Pode fechar esta janela.
pause
