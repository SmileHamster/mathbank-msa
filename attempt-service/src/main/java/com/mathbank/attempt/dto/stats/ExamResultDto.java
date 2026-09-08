package com.mathbank.attempt.dto.stats;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExamResultDto {
    private Long examSheetId;
    private String examSheetName;
    private Integer totalCount;
    private Integer correctCount;
    private Integer score;
}
