package com.mathbank.attempt.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * examsheet-service의 GET /api/examsheets/{id} 응답 중 존재 확인/이름 표시에 필요한
 * 필드만 담는 로컬 사본 (problems 목록 등 나머지 필드는 여기서 필요 없어 생략).
 */
@Getter
@Setter
@NoArgsConstructor
public class ExamSheetDto {
    private Long id;
    private String name;
    private Integer totalCount;
}
