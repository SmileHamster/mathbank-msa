CREATE TABLE IF NOT EXISTS tag (
    id         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '태그 PK',
    tag_type   ENUM('GRADE','SEMESTER','UNIT','SUB_UNIT','TYPE','DIFFICULTY')
               NOT NULL                              COMMENT '태그 분류축',
    tag_value  VARCHAR(100) NOT NULL                 COMMENT '태그 값',
    sort_order INT          NOT NULL DEFAULT 0       COMMENT '정렬 순서',
    PRIMARY KEY (id),
    UNIQUE KEY uk_tag_type_value (tag_type, tag_value),
    KEY idx_tag_type (tag_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='태그 (6축 분류)';

CREATE TABLE IF NOT EXISTS problem (
    id          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '문제 PK',
    title       VARCHAR(500) NOT NULL                COMMENT '문제 제목',
    content     LONGTEXT     NOT NULL                COMMENT '문제 본문 (LaTeX)',
    image_path  VARCHAR(500) NULL                    COMMENT '문제 이미지 경로',
    answer      TEXT         NOT NULL                COMMENT '정답',
    explanation LONGTEXT     NULL                     COMMENT '해설 (LaTeX)',
    created_by  VARCHAR(50)  NOT NULL                COMMENT '등록자 username (auth-service 스키마 분리로 FK 불가, 문자열로 보관)',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP                    COMMENT '등록일시',
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    PRIMARY KEY (id),
    KEY idx_problem_created_by (created_by),
    KEY idx_problem_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='문제';

CREATE TABLE IF NOT EXISTS problem_tag (
    problem_id BIGINT NOT NULL COMMENT '문제 PK',
    tag_id     BIGINT NOT NULL COMMENT '태그 PK',
    PRIMARY KEY (problem_id, tag_id),
    KEY idx_problem_tag_tag_id (tag_id),
    CONSTRAINT fk_problem_tag_problem
        FOREIGN KEY (problem_id) REFERENCES problem (id) ON DELETE CASCADE,
    CONSTRAINT fk_problem_tag_tag
        FOREIGN KEY (tag_id)     REFERENCES tag     (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='문제-태그 매핑';
