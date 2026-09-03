package com.mathbank.problem.controller;

import com.mathbank.problem.common.auth.RequestContext;
import com.mathbank.problem.common.response.ApiResponse;
import com.mathbank.problem.domain.Tag;
import com.mathbank.problem.dto.ProblemDetailDto;
import com.mathbank.problem.dto.ProblemFormDto;
import com.mathbank.problem.dto.ProblemSearchDto;
import com.mathbank.problem.service.ProblemService;
import com.mathbank.problem.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Problem", description = "문제 관리 API")
public class ProblemController {

    private static final String USERNAME_DESC = "로그인 유저명 (Gateway가 JWT 검증 후 주입)";
    private static final String ROLE_DESC = "로그인 유저 권한 (Gateway가 JWT 검증 후 주입)";

    private final ProblemService problemService;
    private final TagService tagService;

    @GetMapping
    @Operation(summary = "문제 목록 조회", description = "키워드/태그 조건으로 문제 목록을 페이지 단위로 조회한다.")
    public ApiResponse<Map<String, Object>> list(
            @ModelAttribute ProblemSearchDto searchDto,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader("X-Role") String role) {
        RequestContext.of(username, role);
        return ApiResponse.success(problemService.getProblemList(searchDto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "문제 상세 조회")
    public ApiResponse<ProblemDetailDto> detail(
            @PathVariable Long id,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader("X-Role") String role) {
        RequestContext.of(username, role);
        return ApiResponse.success(problemService.getProblemDetail(id));
    }

    @PostMapping
    @Operation(summary = "문제 등록")
    public ApiResponse<Long> create(
            @RequestBody @Valid ProblemFormDto form,
            @Parameter(description = USERNAME_DESC + " (등록자로 기록됨)") @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader("X-Role") String role) {
        RequestContext context = RequestContext.of(username, role);
        Long id = problemService.createProblem(form, context.username());
        return ApiResponse.success(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "문제 수정")
    public ApiResponse<Void> update(
            @PathVariable Long id,
            @RequestBody @Valid ProblemFormDto form,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader("X-Role") String role) {
        RequestContext.of(username, role);
        problemService.updateProblem(id, form);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "문제 삭제")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader("X-Role") String role) {
        RequestContext.of(username, role);
        problemService.deleteProblem(id);
        return ApiResponse.success(null);
    }

    @GetMapping("/tags")
    @Operation(summary = "태그 전체 목록 (분류축별 그룹핑)")
    public ApiResponse<Map<String, List<Tag>>> tags(
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader("X-Role") String role) {
        RequestContext.of(username, role);
        return ApiResponse.success(tagService.getTagsGroupedByType());
    }
}
