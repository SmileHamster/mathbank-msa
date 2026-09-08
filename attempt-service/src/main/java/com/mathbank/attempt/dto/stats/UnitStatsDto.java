package com.mathbank.attempt.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UnitStatsDto {
    private String unitName;
    private Integer totalCount;
    private Integer correctCount;
    private Double correctRate;
}
