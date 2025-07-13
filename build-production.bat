@echo off
echo 构建生产环境版本...
echo.

echo 1. 构建前端项目...
cd frontend
call npm run build
cd ..

echo.
echo 2. 构建后端项目...
call gradlew build

echo.
echo 构建完成！
echo 前端文件已构建到: src/main/resources/static/
echo 后端JAR文件: build/libs/
echo.
echo 运行应用: java -jar build/libs/secondhandmarketapp-0.0.1-SNAPSHOT.jar
echo.
pause 