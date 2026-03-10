# 创建默认用户的脚本

# 连接MySQL并创建默认用户
mysql -uroot -pMypassword.123 petapp -e "
-- 如果没有用户，创建一个默认用户
INSERT IGNORE INTO users (id, phone, nickname, password_hash, avatar, coins, diamonds, level)
VALUES (1, 'demo', '萌新主人', 'demo', '👤', 1000, 10, 1)
ON DUPLICATE KEY UPDATE nickname = '萌新主人';

-- 初始化用户统计
INSERT IGNORE INTO user_stats (user_id) VALUES (1);

SELECT * FROM users;
"