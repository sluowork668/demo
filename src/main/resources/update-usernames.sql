-- 为没有username的用户添加username
-- 这个脚本会为每个用户生成一个基于email的username

-- 首先查看现有的用户数据
SELECT id, username, email FROM users;

-- 为username为空的用户生成username
UPDATE users 
SET username = CONCAT('user_', id) 
WHERE username IS NULL OR username = '';

-- 为username重复的用户添加后缀
UPDATE users u1
SET username = CONCAT(u1.username, '_', u1.id)
WHERE EXISTS (
    SELECT 1 FROM users u2 
    WHERE u2.username = u1.username 
    AND u2.id != u1.id
    AND u2.id < u1.id
);

-- 验证更新结果
SELECT id, username, email FROM users ORDER BY id; 