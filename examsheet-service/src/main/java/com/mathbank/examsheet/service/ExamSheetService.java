package com.mathbank.examsheet.service;

import com.mathbank.examsheet.client.ProblemClient;
import com.mathbank.examsheet.common.exception.ExamSheetException;
import com.mathbank.examsheet.common.exception.ResourceNotFoundException;
import com.mathbank.examsheet.domain.ExamSheet;
import com.mathbank.examsheet.domain.ExamSheetProblem;
import com.mathbank.examsheet.dto.*;
import com.mathbank.examsheet.mapper.ExamSheetMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamSheetService {

    private final ExamSheetMapper examSheetMapper;
    private final ProblemClient problemClient;

    public Map<String, List<TagDto>> getTags(String username) {
        return problemClient.getTags(username).getData();
    }

    @Transactional
    public Long createExamSheet(ExamSheetCreateDto dto, String username) {
        int total = dto.getTotalCount();
        if (total <= 0) {
            throw new ExamSheetException("문제 수를 1개 이상 입력하세요.");
        }

        Map<String, List<TagDto>> tagGroups = problemClient.getTags(username).getData();
        Map<Long, String> difficultyNames = tagGroups.getOrDefault("DIFFICULTY", List.of()).stream()
                .collect(Collectors.toMap(TagDto::getId, TagDto::getTagValue));
        Map<Long, String> unitNames = tagGroups.getOrDefault("UNIT", List.of()).stream()
                .collect(Collectors.toMap(TagDto::getId, TagDto::getTagValue));

        List<ExamSheetProblem> selected = new ArrayList<>();
        int sortOrder = 1;

        for (Map.Entry<Long, Integer> entry : dto.getDifficultyDistribution().entrySet()) {
            Long difficultyTagId = entry.getKey();
            int count = entry.getValue() != null ? entry.getValue() : 0;
            if (count <= 0) continue;

            List<Long> candidates = problemClient.findIdsByCondition(username,
                    new ProblemConditionDto(dto.getGradeTagId(), dto.getSemesterTagId(),
                            dto.getUnitTagIds(), difficultyTagId)).getData();

            if (candidates.size() < count) {
                String diffName = difficultyNames.getOrDefault(difficultyTagId, "난이도 " + difficultyTagId);
                String breakdown = buildUnitBreakdown(dto, difficultyTagId, unitNames, username);
                throw new ExamSheetException(
                        "'" + diffName + "' 난이도 문제가 부족합니다. " +
                        "(필요 " + count + "문제, 보유 " + candidates.size() + "문제" + breakdown + ")");
            }

            Collections.shuffle(candidates);
            for (int i = 0; i < count; i++) {
                selected.add(new ExamSheetProblem(null, candidates.get(i), sortOrder++));
            }
        }

        Collections.shuffle(selected);
        for (int i = 0; i < selected.size(); i++) {
            selected.set(i, new ExamSheetProblem(null, selected.get(i).getProblemId(), i + 1));
        }

        ExamSheet examSheet = ExamSheet.builder()
                .name(dto.getName())
                .gradeTagId(dto.getGradeTagId())
                .totalCount(selected.size())
                .createdBy(username)
                .build();
        examSheetMapper.insertExamSheet(examSheet);
        examSheetMapper.insertExamSheetProblems(examSheet.getId(), selected);

        return examSheet.getId();
    }

    public List<ExamSheetListDto> getExamSheetList(String username) {
        List<ExamSheetListDto> list = examSheetMapper.findAll(username);
        Map<Long, String> gradeNames = problemClient.getTags(username).getData()
                .getOrDefault("GRADE", List.of()).stream()
                .collect(Collectors.toMap(TagDto::getId, TagDto::getTagValue));
        list.forEach(item -> item.setGradeName(gradeNames.get(item.getGradeTagId())));
        return list;
    }

    public ExamSheetDetailDto getExamSheetDetail(Long id, String username) {
        ExamSheet examSheet = examSheetMapper.findById(id);
        if (examSheet == null) {
            throw new ResourceNotFoundException("시험지를 찾을 수 없습니다: " + id);
        }
        List<ExamSheetProblem> mappings = examSheetMapper.findProblemsByExamSheetId(id);
        List<Long> problemIds = mappings.stream().map(ExamSheetProblem::getProblemId).toList();
        List<ProblemDto> problemDetails = problemClient.findByIds(username, problemIds).getData();
        Map<Long, ProblemDto> byId = problemDetails.stream()
                .collect(Collectors.toMap(ProblemDto::getId, p -> p));

        List<ExamSheetProblemDto> problems = mappings.stream()
                .map(mapping -> {
                    ProblemDto p = byId.get(mapping.getProblemId());
                    ExamSheetProblemDto dto = new ExamSheetProblemDto();
                    dto.setSortOrder(mapping.getSortOrder());
                    dto.setProblemId(mapping.getProblemId());
                    if (p != null) {
                        dto.setTitle(p.getTitle());
                        dto.setContent(p.getContent());
                        dto.setImagePath(p.getImagePath());
                        dto.setAnswer(p.getAnswer());
                        dto.setExplanation(p.getExplanation());
                        dto.setTagList(p.getTagList());
                    }
                    return dto;
                })
                .sorted(Comparator.comparing(ExamSheetProblemDto::getSortOrder))
                .toList();

        ExamSheetDetailDto detail = new ExamSheetDetailDto();
        detail.setId(examSheet.getId());
        detail.setName(examSheet.getName());
        detail.setTotalCount(examSheet.getTotalCount());
        detail.setCreatedAt(examSheet.getCreatedAt());
        detail.setProblems(problems);
        return detail;
    }

    private String buildUnitBreakdown(ExamSheetCreateDto dto, Long difficultyTagId,
                                      Map<Long, String> unitNames, String username) {
        List<Long> unitTagIds = dto.getUnitTagIds();
        if (unitTagIds == null || unitTagIds.size() <= 1) return "";

        StringBuilder sb = new StringBuilder(" / 단원별: ");
        for (int i = 0; i < unitTagIds.size(); i++) {
            Long unitId = unitTagIds.get(i);
            int cnt = problemClient.findIdsByCondition(username,
                    new ProblemConditionDto(dto.getGradeTagId(), dto.getSemesterTagId(),
                            List.of(unitId), difficultyTagId)).getData().size();
            sb.append(unitNames.getOrDefault(unitId, "단원 " + unitId))
              .append(" ").append(cnt).append("문제");
            if (i < unitTagIds.size() - 1) sb.append(", ");
        }
        return sb.toString();
    }

    @Transactional
    public void deleteExamSheet(Long id) {
        ExamSheet examSheet = examSheetMapper.findById(id);
        if (examSheet == null) {
            throw new ResourceNotFoundException("시험지를 찾을 수 없습니다: " + id);
        }
        examSheetMapper.deleteProblemsById(id);
        examSheetMapper.deleteById(id);
    }
}
