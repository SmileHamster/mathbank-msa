package com.mathbank.examsheet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProblemConditionDto {
    private Long gradeTagId;
    private Long semesterTagId;
    private List<Long> unitTagIds;
    private Long difficultyTagId;
}
