@echo off
echo 正在删除test商品...
echo.

REM 调用删除test商品的API
curl -X DELETE http://localhost:8080/items/test-items

echo.
echo 删除完成！
pause 