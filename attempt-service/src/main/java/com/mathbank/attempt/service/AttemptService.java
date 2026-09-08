package com.mathbank.attempt.service;

import com.mathbank.attempt.client.ExamSheetClient;
import com.mathbank.attempt.client.ProblemClient;
import com.mathbank.attempt.common.exception.ResourceNotFoundException;
import com.mathbank.attempt.domain.Student;
import com.mathbank.attempt.domain.StudentAnswer;
import com.mathbank.attempt.dto.*;
import com.mathbank.attempt.dto.stats.DifficultyStatsDto;
import com.mathbank.attempt.dto.stats.ExamResultDto;
import com.mathbank.attempt.dto.stats.StudentStatsDto;
import com.mathbank.attempt.dto.stats.UnitStatsDto;
import com.mathbank.attempt.mapper.StudentAnswerMapper;
import com.mathbank.attempt.mapper.StudentMapper;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final StudentAnswerMapper studentAnswerMapper;
    private final StudentMapper studentMapper;
    private final ProblemClient problemClient;
    private final ExamSheetClient examSheetClient;

    @Transactional
    public void submitAnswers(Long studentId, Long examSheetId, List<StudentAnswerDto> answers, String username) {
        requireStudent(studentId);
        fetchExamSheet(examSheetId, username); // 존재 확인 (없으면 404)

        List<StudentAnswer> entities = answers.stream()
                .map(a -> StudentAnswer.builder()
                        .studentId(studentId)
                        .examSheetId(examSheetId)
                        .problemId(a.getProblemId())
                        .isCorrect(a.getIsCorrect())
                        .build())
                .toList();

        studentAnswerMapper.deleteAnswers(studentId, examSheetId);
        if (!entities.isEmpty()) {
            studentAnswerMapper.insertAnswers(entities);
        }
    }

    public StudentStatsDto getStudentStats(Long studentId, String username) {
        Student student = requireStudent(studentId);

        List<ExamResultDto> examResults = studentAnswerMapper.findSummaryByStudent(studentId);
        for (ExamResultDto result : examResults) {
            ExamSheetDto examSheet = fetchExamSheetSafely(result.getExamSheetId(), username);
            result.setExamSheetName(examSheet != null ? examSheet.getName() : "(삭제된 시험지)");
            result.setScore(calcScore(result.getCorrectCount(), result.getTotalCount()));
        }

        List<StudentAnswer> allAnswers = studentAnswerMapper.findAllByStudent(studentId);
        List<Long> problemIds = allAnswers.stream().map(StudentAnswer::getProblemId).distinct().toList();
        Map<Long, ProblemSummaryDto> problemById = fetchProblemsById(problemIds, username);

        Map<String, int[]> unitAgg = new LinkedHashMap<>();
        Map<String, int[]> diffAgg = new LinkedHashMap<>();
        for (StudentAnswer ans : allAnswers) {
            ProblemSummaryDto p = problemById.get(ans.getProblemId());
            if (p == null || p.getTagList() == null) continue;
            boolean correct = Boolean.TRUE.equals(ans.getIsCorrect());
            findTagValue(p.getTagList(), "UNIT").ifPresent(name -> accumulate(unitAgg, name, correct));
            findTagValue(p.getTagList(), "DIFFICULTY").ifPresent(name -> accumulate(diffAgg, name, correct));
        }

        List<UnitStatsDto> unitStats = unitAgg.entrySet().stream()
                .map(e -> new UnitStatsDto(e.getKey(), e.getValue()[0], e.getValue()[1], rate(e.getValue()[1], e.getValue()[0])))
                .toList();
        List<DifficultyStatsDto> difficultyStats = diffAgg.entrySet().stream()
                .map(e -> new DifficultyStatsDto(e.getKey(), e.getValue()[0], e.getValue()[1], rate(e.getValue()[1], e.getValue()[0])))
                .toList();

        StudentStatsDto dto = new StudentStatsDto();
        dto.setStudentId(student.getId());
        dto.setStudentName(student.getName());
        dto.setGrade(student.getGrade());
        dto.setExamResults(examResults);
        dto.setUnitStats(unitStats);
        dto.setDifficultyStats(difficultyStats);
        return dto;
    }

    public ExamResultDto getExamResult(Long studentId, Long examSheetId, String username) {
        requireStudent(studentId);
        ExamSheetDto examSheet = fetchExamSheet(examSheetId, username);

        ExamResultDto result = studentAnswerMapper.findSummaryByStudentAndExamSheet(studentId, examSheetId);
        if (result == null) {
            result = new ExamResultDto();
            result.setExamSheetId(examSheetId);
            result.setTotalCount(0);
            result.setCorrectCount(0);
        }
        result.setExamSheetName(examSheet.getName());
        result.setScore(calcScore(result.getCorrectCount(), result.getTotalCount()));
        return result;
    }

    private Student requireStudent(Long studentId) {
        Student student = studentMapper.findById(studentId);
        if (student == null) {
            throw new ResourceNotFoundException("학생을 찾을 수 없습니다: " + studentId);
        }
        return student;
    }

    private ExamSheetDto fetchExamSheet(Long examSheetId, String username) {
        try {
            return examSheetClient.getExamSheet(username, examSheetId).getData();
        } catch (FeignException e) {
            if (e.status() == 404) {
                throw new ResourceNotFoundException("시험지를 찾을 수 없습니다: " + examSheetId);
            }
            throw e;
        }
    }

    private ExamSheetDto fetchExamSheetSafely(Long examSheetId, String username) {
        try {
            return examSheetClient.getExamSheet(username, examSheetId).getData();
        } catch (FeignException e) {
            return null;
        }
    }

    private Map<Long, ProblemSummaryDto> fetchProblemsById(List<Long> ids, String username) {
        if (ids.isEmpty()) return Map.of();
        List<ProblemSummaryDto> problems = problemClient.getProblemsByIds(username, ids).getData();
        return problems.stream().collect(Collectors.toMap(ProblemSummaryDto::getId, p -> p));
    }

    private static Optional<String> findTagValue(List<TagDto> tags, String tagType) {
        return tags.stream().filter(t -> tagType.equals(t.getTagType())).map(TagDto::getTagValue).findFirst();
    }

    private static void accumulate(Map<String, int[]> agg, String key, boolean correct) {
        int[] counts = agg.computeIfAbsent(key, k -> new int[2]);
        counts[0]++;
        if (correct) counts[1]++;
    }

    private static double rate(int correct, int total) {
        return total == 0 ? 0.0 : Math.round(correct * 1000.0 / total) / 10.0;
    }

    private static int calcScore(Integer correct, Integer total) {
        if (total == null || total == 0) return 0;
        return Math.round(correct * 100f / total);
    }
}
