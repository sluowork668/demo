@echo off
echo 启动二手市场应用开发环境...
echo.

echo 1. 启动后端服务 (Spring Boot)...
start "Backend Server" cmd /k "gradlew bootRun"

echo 等待后端启动...
timeout /t 10 /nobreak > nul

echo 2. 启动前端服务 (React + Vite)...
cd frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 开发环境启动完成！
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:8080
echo.
echo 按任意键退出...
pause > nul 