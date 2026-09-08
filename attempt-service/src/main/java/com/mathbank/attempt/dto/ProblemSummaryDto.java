package com.mathbank.attempt.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * problem-service의 /api/problems/by-ids 배치 응답 중 통계 계산에 필요한 필드만 담는 로컬 사본.
 * problem-service의 도메인/DTO 클래스를 직접 참조하지 않기 위해 별도로 정의한다.
 */
@Getter
@Setter
@NoArgsConstructor
public class ProblemSummaryDto {
    private Long id;
    private String title;
    private List<TagDto> tagList;
}
