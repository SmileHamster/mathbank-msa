CREATE TABLE IF NOT EXISTS exam_sheet (
    id           BIGINT       NOT NULL AUTO_INCREMENT COMMENT '시험지 PK',
    name         VARCHAR(200) NOT NULL               COMMENT '시험지 이름',
    grade_tag_id BIGINT       NULL                   COMMENT '학년 태그 id (problem-service 스키마 분리로 FK 불가)',
    total_count  INT          NOT NULL DEFAULT 0     COMMENT '총 문항 수',
    created_by   VARCHAR(50)  NOT NULL               COMMENT '생성자 username (auth-service 스키마 분리로 FK 불가, 문자열로 보관)',
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    PRIMARY KEY (id),
    KEY idx_exam_sheet_created_by (created_by),
    KEY idx_exam_sheet_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시험지';

CREATE TABLE IF NOT EXISTS exam_sheet_problem (
    exam_sheet_id BIGINT NOT NULL COMMENT '시험지 PK',
    problem_id    BIGINT NOT NULL COMMENT '문제 id (problem-service 스키마 분리로 FK 불가)',
    sort_order    INT    NOT NULL DEFAULT 0 COMMENT '문항 순서',
    PRIMARY KEY (exam_sheet_id, problem_id),
    CONSTRAINT fk_esp_exam_sheet
        FOREIGN KEY (exam_sheet_id) REFERENCES exam_sheet (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시험지-문제 매핑';
