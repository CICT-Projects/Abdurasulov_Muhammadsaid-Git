# Скрипт для запуска приложения в режиме разработки

Write-Host "====================================" -ForegroundColor Green
Write-Host "🚗 Запуск приложения для разработки" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Останавливаем существующие процессы
Write-Host "Останавливаю существующие процессы..." -ForegroundColor Yellow
Stop-Process -Name dotnet -Force -ErrorAction SilentlyContinue
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Запускаем бэкенд
Write-Host "📦 Запускаю бэкенд на http://localhost:5026..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @"
Set-Location 'C:\Users\USER\Desktop\HomeTask\TaskApi'
dotnet run
"@

Start-Sleep -Seconds 5

# Запускаем фронтенд
Write-Host "🎨 Запускаю фронтенд на http://localhost:5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @"
Set-Location 'C:\Users\USER\Desktop\HomeTask\frontend'
npm run dev
"@

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Оба сервера запущены!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Фронтенд: http://localhost:5173" -ForegroundColor Blue
Write-Host "📍 Бэкенд API: http://localhost:5026/api/cars" -ForegroundColor Blue
Write-Host ""
Write-Host "Откройте браузер и перейдите на http://localhost:5173" -ForegroundColor Yellow

