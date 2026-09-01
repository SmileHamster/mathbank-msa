CREATE TABLE IF NOT EXISTS member (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    username   VARCHAR(50)  NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_member_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원 (auth-service 전용)';
