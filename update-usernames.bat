@echo off
echo Updating usernames for existing users...
echo.

REM 调用API端点来更新username
curl -X POST http://localhost:8080/api/auth/update-usernames

echo.
echo Username update completed!
pause 