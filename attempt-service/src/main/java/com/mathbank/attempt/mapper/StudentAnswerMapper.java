package com.mathbank.attempt.mapper;

import com.mathbank.attempt.domain.StudentAnswer;
import com.mathbank.attempt.dto.stats.ExamResultDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentAnswerMapper {
    void insertAnswers(@Param("answers") List<StudentAnswer> answers);
    void deleteAnswers(@Param("studentId") Long studentId, @Param("examSheetId") Long examSheetId);
    List<StudentAnswer> findAllByStudent(@Param("studentId") Long studentId);

    // examSheetId/totalCount/correctCount만 채워지고, examSheetName/score는 서비스에서 Feign 조회 후 채운다.
    List<ExamResultDto> findSummaryByStudent(@Param("studentId") Long studentId);
    ExamResultDto findSummaryByStudentAndExamSheet(@Param("studentId") Long studentId,
                                                    @Param("examSheetId") Long examSheetId);
}
