@echo off
echo Iniciando Lazaro Backend...
echo.
taskkill /F /IM LazaroBackend.exe >nul 2>&1
set ASPNETCORE_ENVIRONMENT=Development
cd /d "C:\Users\fm469\OneDrive\Documents\Tesis\Proyecto Lazaro\LazaroBackend"
start /b cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:5016/swagger"
dotnet run --launch-profile http
pause
