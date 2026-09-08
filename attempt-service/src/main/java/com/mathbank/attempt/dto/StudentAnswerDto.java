package com.mathbank.attempt.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StudentAnswerDto {
    @NotNull(message = "problemId는 필수입니다.")
    private Long problemId;

    @NotNull(message = "isCorrect는 필수입니다.")
    private Boolean isCorrect;
}
