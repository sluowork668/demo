-- 用户表 - 与JPA实体兼容
CREATE TABLE IF NOT EXISTS users
(
    id          IDENTITY      PRIMARY KEY     NOT NULL,
    username    VARCHAR(100)    UNIQUE     NOT NULL,
    email       VARCHAR(255)    UNIQUE     NOT NULL,
    password    VARCHAR(255)    NOT NULL,
    firstname   VARCHAR(100)    NOT NULL,
    lastname    VARCHAR(100)    NOT NULL,
    phone_number VARCHAR(50),
    address     VARCHAR(255),
    city        VARCHAR(100),
    state       VARCHAR(100),
    zip_code    VARCHAR(20),
    country     VARCHAR(100),
    role        VARCHAR(50),
    enabled     BOOLEAN         DEFAULT TRUE
);

-- Spring Security authorities表
CREATE TABLE IF NOT EXISTS authorities
(
    username    VARCHAR(100)    NOT NULL,
    authority   VARCHAR(50)     NOT NULL,
    PRIMARY KEY (username, authority),
    CONSTRAINT fk_authorities_users FOREIGN KEY (username) REFERENCES users(username)
);

-- 商品表 - 修复字段名以匹配实体类
CREATE TABLE IF NOT EXISTS items
(
    id          IDENTITY      PRIMARY KEY     NOT NULL,
    title       VARCHAR(255),
    description VARCHAR(1024),
    price       DECIMAL(10,2)  NOT NULL,
    category    VARCHAR(100),
    seller_id   BIGINT        NOT NULL,
    created_at  TIMESTAMP     NOT NULL,
    is_sold     BOOLEAN       DEFAULT FALSE,
    CONSTRAINT fk_items_seller FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- 商品图片表
CREATE TABLE IF NOT EXISTS item_images
(
    item_id     BIGINT        NOT NULL,
    image_url   VARCHAR(500)  NOT NULL,
    CONSTRAINT fk_item_images_item FOREIGN KEY (item_id) REFERENCES items(id)
);

-- 聊天室表
CREATE TABLE IF NOT EXISTS chat_rooms
(
    id          IDENTITY      PRIMARY KEY     NOT NULL,
    name        VARCHAR(255)        NOT NULL,
    buyer       VARCHAR(100)        NOT NULL,
    seller      VARCHAR(100)        NOT NULL,
    item_id     BIGINT     NOT NULL,
    closed      BOOLEAN     NOT NULL,
    created_at  TIMESTAMP   NOT NULL,
    CONSTRAINT fk_chat_rooms_buyer FOREIGN KEY (buyer) REFERENCES users(username),
    CONSTRAINT fk_chat_rooms_seller FOREIGN KEY (seller) REFERENCES users(username),
    CONSTRAINT fk_chat_rooms_item FOREIGN KEY (item_id) REFERENCES items(id)
);

-- 消息表
CREATE TABLE IF NOT EXISTS message
(
    id              IDENTITY      PRIMARY KEY     NOT NULL,
    message_type    VARCHAR(50)        NOT NULL,
    content         VARCHAR(1024)        NOT NULL,
    chat_room_id    BIGINT     NOT NULL,
    sender          VARCHAR(100)        NOT NULL,
    sent_at         TIMESTAMP   NOT NULL,
    CONSTRAINT fk_message_chat_room FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id),
    CONSTRAINT fk_message_sender FOREIGN KEY (sender) REFERENCES users(username)
);

-- 插入测试用户
INSERT INTO users (username, email, password, firstname, lastname, role, enabled) VALUES
('test', 'test@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Test', 'User', 'USER', true);

-- 插入测试商品
INSERT INTO items (title, description, price, category, seller_id, created_at, is_sold) VALUES
('test', 'This is a test item', 99.99, 'Electronics', 1, CURRENT_TIMESTAMP(), false);

-- 插入测试商品图片
INSERT INTO item_images (item_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop');
