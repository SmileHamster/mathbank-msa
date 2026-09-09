USE mathbank_attempt;

CREATE TABLE IF NOT EXISTS student (
    id         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '학생 PK',
    name       VARCHAR(100) NOT NULL               COMMENT '학생 이름',
    grade      VARCHAR(20)  NULL                   COMMENT '학년 (problem-service 스키마 분리로 FK 대신 문자열, 예: "중2")',
    memo       VARCHAR(500) NULL                   COMMENT '메모',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    PRIMARY KEY (id),
    KEY idx_student_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='학생';

CREATE TABLE IF NOT EXISTS student_answer (
    id            BIGINT     NOT NULL AUTO_INCREMENT COMMENT '응시 기록 PK',
    student_id    BIGINT     NOT NULL               COMMENT '학생 PK',
    exam_sheet_id BIGINT     NOT NULL               COMMENT '시험지 id (examsheet-service 스키마 분리로 FK 불가)',
    problem_id    BIGINT     NOT NULL               COMMENT '문제 id (problem-service 스키마 분리로 FK 불가)',
    is_correct    TINYINT(1) NOT NULL DEFAULT 0     COMMENT '정답 여부 (0: 오답, 1: 정답)',
    submitted_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '응시일시',
    PRIMARY KEY (id),
    KEY idx_sa_student_id    (student_id),
    KEY idx_sa_exam_sheet_id (exam_sheet_id),
    KEY idx_sa_problem_id    (problem_id),
    KEY idx_sa_student_exam  (student_id, exam_sheet_id),
    CONSTRAINT fk_sa_student
        FOREIGN KEY (student_id) REFERENCES student (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='학생 응시 기록';
