Write-Host "正在删除test商品..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/items/test-items" -Method DELETE
    Write-Host "删除成功: $response" -ForegroundColor Green
} catch {
    Write-Host "删除失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "操作完成" -ForegroundColor Yellow 