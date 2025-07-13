# 删除test商品说明

## 问题描述
需要删除数据库中test用户发布的test商品。

## 解决方案

### 方法1: 使用API删除（推荐）

#### 1. 确保后端服务正在运行
```bash
# 在项目根目录执行
./gradlew bootRun
```

#### 2. 调用删除API
使用以下任一方式：

**Windows批处理脚本:**
```bash
# 双击运行
delete-test-items.bat
```

**PowerShell脚本:**
```powershell
# 在PowerShell中执行
.\delete-test-items.ps1
```

**手动调用API:**
```bash
curl -X DELETE http://localhost:8080/items/test-items
```

### 方法2: 直接访问数据库

#### 1. 访问H2数据库控制台
- 打开浏览器访问: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- 用户名: `sa`
- 密码: (留空)

#### 2. 执行SQL删除语句
```sql
-- 删除test商品的图片记录
DELETE FROM item_images WHERE item_id IN (
    SELECT id FROM items WHERE title = 'test' AND seller_id IN (
        SELECT id FROM users WHERE username = 'test'
    )
);

-- 删除test商品记录
DELETE FROM items WHERE title = 'test' AND seller_id IN (
    SELECT id FROM users WHERE username = 'test'
);
```

## 验证删除结果

### 1. 检查API返回
删除API会返回删除结果信息。

### 2. 检查数据库
访问H2控制台查看items表，确认test商品已被删除。

### 3. 检查前端显示
刷新前端页面，确认test商品不再显示在商品列表中。

## 注意事项

1. **数据备份**: 删除操作不可逆，请确保要删除的数据确实不需要。
2. **权限检查**: 删除API会检查用户权限，确保只有商品所有者能删除。
3. **关联数据**: 删除商品时会同时删除相关的图片记录。
4. **测试环境**: 当前使用的是H2内存数据库，重启后数据会丢失。

## 技术实现

### 后端实现
- **ItemService.deleteTestItems()**: 查找并删除test商品
- **ItemController.deleteTestItems()**: 提供REST API端点
- **自动清理**: 删除商品时自动清理相关图片记录

### 前端支持
- 前端已有删除单个商品的功能
- 可以通过商品详情页或首页的删除按钮删除自己的商品

## 故障排除

### 如果删除失败
1. 检查后端服务是否正在运行
2. 检查网络连接
3. 查看后端日志获取详细错误信息
4. 确认test商品确实存在

### 如果API调用失败
1. 确认端口8080没有被其他程序占用
2. 检查防火墙设置
3. 尝试使用H2控制台直接操作数据库 