package com.mathbank.attempt.controller;

import com.mathbank.attempt.common.response.ApiResponse;
import com.mathbank.attempt.dto.StudentAnswerDto;
import com.mathbank.attempt.dto.stats.ExamResultDto;
import com.mathbank.attempt.dto.stats.StudentStatsDto;
import com.mathbank.attempt.service.AttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;

    @PostMapping("/{studentId}/exams/{examSheetId}")
    public ApiResponse<Void> submit(@PathVariable Long studentId,
                                     @PathVariable Long examSheetId,
                                     @RequestBody @Valid List<StudentAnswerDto> answers,
                                     @RequestHeader("X-Username") String username) {
        attemptService.submitAnswers(studentId, examSheetId, answers, username);
        return ApiResponse.success(null);
    }

    @GetMapping("/{studentId}/stats")
    public ApiResponse<StudentStatsDto> stats(@PathVariable Long studentId,
                                               @RequestHeader("X-Username") String username) {
        return ApiResponse.success(attemptService.getStudentStats(studentId, username));
    }

    @GetMapping("/{studentId}/exams/{examSheetId}")
    public ApiResponse<ExamResultDto> examResult(@PathVariable Long studentId,
                                                  @PathVariable Long examSheetId,
                                                  @RequestHeader("X-Username") String username) {
        return ApiResponse.success(attemptService.getExamResult(studentId, examSheetId, username));
    }
}
