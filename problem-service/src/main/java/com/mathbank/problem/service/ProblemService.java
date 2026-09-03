package com.mathbank.problem.service;

import com.mathbank.problem.common.exception.ResourceNotFoundException;
import com.mathbank.problem.common.util.PageInfo;
import com.mathbank.problem.domain.Problem;
import com.mathbank.problem.dto.ProblemDetailDto;
import com.mathbank.problem.dto.ProblemFormDto;
import com.mathbank.problem.dto.ProblemListDto;
import com.mathbank.problem.dto.ProblemSearchDto;
import com.mathbank.problem.mapper.ProblemMapper;
import com.mathbank.problem.mapper.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemMapper problemMapper;
    private final TagMapper tagMapper;

    public Map<String, Object> getProblemList(ProblemSearchDto searchDto) {
        List<ProblemListDto> problems = problemMapper.search(searchDto);
        int totalCount = problemMapper.countSearch(searchDto);
        PageInfo pageInfo = new PageInfo(searchDto.getPage(), searchDto.getSize(), totalCount);

        Map<String, Object> result = new HashMap<>();
        result.put("problems", problems);
        result.put("pageInfo", pageInfo);
        return result;
    }

    public ProblemDetailDto getProblemDetail(Long id) {
        ProblemDetailDto detail = problemMapper.findDetailById(id);
        if (detail == null) {
            throw new ResourceNotFoundException("문제를 찾을 수 없습니다: " + id);
        }
        return detail;
    }

    private void validateSingleUnitTag(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return;
        Set<Long> unitTagIds = tagMapper.findByType("UNIT").stream()
                .map(tag -> tag.getId()).collect(Collectors.toSet());
        long unitCount = tagIds.stream().filter(unitTagIds::contains).count();
        if (unitCount > 1) {
            throw new IllegalArgumentException("대단원 태그는 하나만 선택할 수 있습니다.");
        }
    }

    @Transactional
    public Long createProblem(ProblemFormDto dto, String username) {
        validateSingleUnitTag(dto.getTagIds());
        Problem problem = Problem.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .answer(dto.getAnswer())
                .explanation(dto.getExplanation())
                .createdBy(username)
                .build();
        problemMapper.insert(problem);
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            problemMapper.insertTags(problem.getId(), dto.getTagIds());
        }
        return problem.getId();
    }

    @Transactional
    public void updateProblem(Long id, ProblemFormDto dto) {
        validateSingleUnitTag(dto.getTagIds());
        Problem problem = problemMapper.findById(id);
        if (problem == null) {
            throw new ResourceNotFoundException("문제를 찾을 수 없습니다: " + id);
        }
        problem.setTitle(dto.getTitle());
        problem.setContent(dto.getContent());
        problem.setAnswer(dto.getAnswer());
        problem.setExplanation(dto.getExplanation());

        problemMapper.update(problem);

        problemMapper.deleteTagsByProblemId(id);
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            problemMapper.insertTags(id, dto.getTagIds());
        }
    }

    @Transactional
    public void deleteProblem(Long id) {
        Problem problem = problemMapper.findById(id);
        if (problem == null) {
            throw new ResourceNotFoundException("문제를 찾을 수 없습니다: " + id);
        }
        problemMapper.deleteById(id);
    }
}
