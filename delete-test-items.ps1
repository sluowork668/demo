Write-Host "正在删除test商品..." -ForegroundColor Green
Write-Host ""

try {
    # 检查后端服务是否运行
    Write-Host "检查后端服务状态..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:8080/items" -Method GET -UseBasicParsing
    Write-Host "后端服务正常运行" -ForegroundColor Green
    
    # 调用删除test商品的API
    Write-Host "正在删除test商品..." -ForegroundColor Yellow
    $deleteResponse = Invoke-RestMethod -Uri "http://localhost:8080/items/test-items" -Method DELETE
    Write-Host "删除结果: $deleteResponse" -ForegroundColor Green
    
} catch {
    Write-Host "操作失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "请确保后端服务正在运行" -ForegroundColor Yellow
    Write-Host "或者直接访问 http://localhost:8080/h2-console 手动删除" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "删除完成！" -ForegroundColor Green
Read-Host "按任意键继续..." 