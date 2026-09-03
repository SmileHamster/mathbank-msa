package com.mathbank.examsheet.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ExamSheetProblemDto {
    private Integer sortOrder;
    private Long problemId;
    private String title;
    private String content;
    private String imagePath;
    private String answer;
    private String explanation;
    private List<TagDto> tagList;
}
