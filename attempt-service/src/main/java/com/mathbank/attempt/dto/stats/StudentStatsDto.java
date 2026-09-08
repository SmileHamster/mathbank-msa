package com.mathbank.attempt.dto.stats;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class StudentStatsDto {
    private Long studentId;
    private String studentName;
    private String grade;
    private List<ExamResultDto> examResults;
    private List<UnitStatsDto> unitStats;
    private List<DifficultyStatsDto> difficultyStats;
}
