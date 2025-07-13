-- 删除test用户发布的test商品
-- 首先删除相关的图片记录
DELETE FROM item_images WHERE item_id IN (
    SELECT id FROM items WHERE title = 'test' AND seller_id IN (
        SELECT id FROM users WHERE username = 'test'
    )
);

-- 然后删除商品记录
DELETE FROM items WHERE title = 'test' AND seller_id IN (
    SELECT id FROM users WHERE username = 'test'
);

-- 如果test用户没有其他商品，也可以删除test用户（可选）
-- DELETE FROM users WHERE username = 'test'; 