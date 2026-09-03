package com.mathbank.examsheet.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * problem-service의 ProblemDetailDto 응답을 examsheet-service 쪽에서 받기 위한 로컬 사본.
 * 서비스 간 결합을 피하기 위해 problem-service의 도메인/DTO 클래스를 직접 import하지 않는다.
 */
@Getter
@Setter
@NoArgsConstructor
public class ProblemDto {
    private Long id;
    private String title;
    private String content;
    private String imagePath;
    private String answer;
    private String explanation;
    private List<TagDto> tagList;
}
