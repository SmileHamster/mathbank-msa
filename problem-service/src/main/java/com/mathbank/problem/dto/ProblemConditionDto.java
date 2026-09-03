package com.mathbank.problem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProblemConditionDto {
    private Long gradeTagId;
    private Long semesterTagId;
    private List<Long> unitTagIds;
    private Long difficultyTagId;
}
