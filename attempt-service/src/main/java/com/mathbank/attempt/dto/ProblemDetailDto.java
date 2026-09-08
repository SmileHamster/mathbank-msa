package com.mathbank.attempt.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * problem-service의 GET /api/problems/{id} 응답을 받기 위한 로컬 사본.
 */
@Getter
@Setter
@NoArgsConstructor
public class ProblemDetailDto {
    private Long id;
    private String title;
    private String content;
    private String imagePath;
    private String answer;
    private String explanation;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TagDto> tagList;
}
