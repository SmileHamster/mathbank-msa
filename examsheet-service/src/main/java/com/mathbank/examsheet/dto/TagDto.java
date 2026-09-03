package com.mathbank.examsheet.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TagDto {
    private Long id;
    private String tagType;
    private String tagValue;
    private Integer sortOrder;
}
