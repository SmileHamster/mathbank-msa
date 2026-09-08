package com.mathbank.attempt.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class StudentListDto {
    private Long id;
    private String name;
    private String grade;
    private String memo;
    private LocalDateTime createdAt;
}
