@echo off
echo ===================================
echo 🚗 Запуск CRUD Приложения машин
echo ===================================
echo.

REM Проверка .NET
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ .NET SDK не установлен!
    pause
    exit /b 1
)

REM Проверка Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен!
    pause
    exit /b 1
)

echo ✅ .NET SDK: 
dotnet --version
echo.
echo ✅ Node.js: 
node --version
echo.

REM Запуск бэкенда в новом окне
echo 📦 Запуск бэкенда на http://localhost:5026...
start "TaskApi Backend" cmd /k "cd TaskApi && dotnet run"

REM Небольшая задержка перед запуском фронтенда
timeout /t 3 /nobreak

REM Запуск фронтенда в новом окне
echo 🎨 Запуск фронтенда на http://localhost:5173...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Оба приложения запущены!
echo.
echo 📍 Фронтенд: http://localhost:5173
echo 📍 Бэкенд API: https://localhost:5026/api/cars
echo.
echo Закройте это окно для остановки приложений.
pause

