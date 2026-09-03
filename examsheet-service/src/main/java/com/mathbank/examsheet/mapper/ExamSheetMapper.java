package com.mathbank.examsheet.mapper;

import com.mathbank.examsheet.domain.ExamSheet;
import com.mathbank.examsheet.domain.ExamSheetProblem;
import com.mathbank.examsheet.dto.ExamSheetListDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ExamSheetMapper {
    void insertExamSheet(ExamSheet examSheet);
    void insertExamSheetProblems(@Param("examSheetId") Long examSheetId,
                                 @Param("problems") List<ExamSheetProblem> problems);
    List<ExamSheetListDto> findAll(@Param("createdBy") String createdBy);
    ExamSheet findById(Long id);
    List<ExamSheetProblem> findProblemsByExamSheetId(Long examSheetId);
    void deleteById(Long id);
    void deleteProblemsById(Long examSheetId);
}
