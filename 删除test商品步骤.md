# 删除test商品步骤

## 方法1: 通过H2数据库控制台删除（推荐）

### 步骤1: 启动后端服务
```bash
./gradlew bootRun
```

### 步骤2: 访问H2数据库控制台
1. 打开浏览器
2. 访问: http://localhost:8080/h2-console
3. 输入连接信息:
   - JDBC URL: `jdbc:h2:mem:testdb`
   - 用户名: `sa`
   - 密码: (留空)
4. 点击"Connect"

### 步骤3: 执行删除SQL
复制以下SQL语句到H2控制台并执行:

```sql
-- 删除test商品的图片记录
DELETE FROM item_images WHERE item_id IN (
    SELECT id FROM items WHERE title = 'test'
);

-- 删除test商品记录
DELETE FROM items WHERE title = 'test';
```

### 步骤4: 验证删除结果
执行以下查询确认删除成功:
```sql
SELECT * FROM items WHERE title = 'test';
```

## 方法2: 使用提供的SQL脚本

1. 打开H2控制台
2. 复制 `delete-test-items.sql` 文件中的内容
3. 粘贴到H2控制台并执行

## 方法3: 通过API删除

如果后端服务正在运行，可以使用API删除:

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/items/test-items" -Method DELETE

# 或者使用curl (如果安装了curl)
curl -X DELETE http://localhost:8080/items/test-items
```

## 验证删除成功

1. 刷新前端页面 http://localhost:5173
2. 确认test商品不再显示在商品列表中
3. 或者通过API检查: http://localhost:8080/items

## 注意事项

- 删除操作不可逆
- 删除商品时会同时删除相关的图片记录
- 如果test用户没有其他商品，也可以删除test用户
- H2是内存数据库，重启后数据会丢失 