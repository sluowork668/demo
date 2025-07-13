-- 删除test用户发布的test商品
-- 首先查看现有的test商品
SELECT 'Before deletion - Test items:' as info;
SELECT * FROM items WHERE title = 'test';

SELECT 'Before deletion - Test item images:' as info;
SELECT * FROM item_images WHERE item_id IN (
    SELECT id FROM items WHERE title = 'test'
);

-- 删除test商品的图片记录
DELETE FROM item_images WHERE item_id IN (
    SELECT id FROM items WHERE title = 'test'
);

-- 删除test商品记录
DELETE FROM items WHERE title = 'test';

-- 验证删除结果
SELECT 'After deletion - Test items:' as info;
SELECT * FROM items WHERE title = 'test';

SELECT 'After deletion - Test item images:' as info;
SELECT * FROM item_images WHERE item_id IN (
    SELECT id FROM items WHERE title = 'test'
);

-- 如果test用户没有其他商品，也可以删除test用户（可选）
-- DELETE FROM users WHERE username = 'test'; 