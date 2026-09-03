package com.mathbank.problem.controller;

import com.mathbank.problem.common.auth.RequestContext;
import com.mathbank.problem.common.exception.ResourceNotFoundException;
import com.mathbank.problem.common.response.ApiResponse;
import com.mathbank.problem.domain.Tag;
import com.mathbank.problem.dto.ProblemConditionDto;
import com.mathbank.problem.dto.ProblemDetailDto;
import com.mathbank.problem.dto.ProblemFormDto;
import com.mathbank.problem.dto.ProblemSearchDto;
import com.mathbank.problem.service.ImageStorageService;
import com.mathbank.problem.service.ProblemService;
import com.mathbank.problem.service.TagService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Problem", description = "문제 관리 API")
public class ProblemController {

    private static final String USERNAME_DESC = "로그인 유저명 (Gateway가 JWT 검증 후 주입)";
    private static final String ROLE_DESC = "로그인 유저 권한 (Gateway가 JWT 검증 후 주입, 없을 수 있음)";

    private final ProblemService problemService;
    private final TagService tagService;
    private final ImageStorageService imageStorageService;

    @GetMapping
    @Operation(summary = "문제 목록 조회", description = "키워드/태그 조건으로 문제 목록을 페이지 단위로 조회한다.")
    public ApiResponse<Map<String, Object>> list(
            @ModelAttribute ProblemSearchDto searchDto,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader(value = "X-Role", required = false) String role) {
        RequestContext.of(username, role);
        return ApiResponse.success(problemService.getProblemList(searchDto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "문제 상세 조회")
    public ApiResponse<ProblemDetailDto> detail(
            @PathVariable Long id,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader(value = "X-Role", required = false) String role) {
        RequestContext.of(username, role);
        return ApiResponse.success(problemService.getProblemDetail(id));
    }

    @PostMapping
    @Operation(summary = "문제 등록")
    public ApiResponse<Long> create(
            @RequestBody @Valid ProblemFormDto form,
            @Parameter(description = USERNAME_DESC + " (등록자로 기록됨)") @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader(value = "X-Role", required = false) String role) {
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
            @Parameter(description = ROLE_DESC) @RequestHeader(value = "X-Role", required = false) String role) {
        RequestContext.of(username, role);
        problemService.updateProblem(id, form);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "문제 삭제")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader(value = "X-Role", required = false) String role) {
        RequestContext.of(username, role);
        problemService.deleteProblem(id);
        return ApiResponse.success(null);
    }

    @GetMapping("/tags")
    @Operation(summary = "태그 전체 목록 (분류축별 그룹핑)")
    public ApiResponse<Map<String, List<Tag>>> tags(
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username,
            @Parameter(description = ROLE_DESC) @RequestHeader(value = "X-Role", required = false) String role) {
        RequestContext.of(username, role);
        return ApiResponse.success(tagService.getTagsGroupedByType());
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "문제 이미지 업로드")
    public ApiResponse<String> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username) {
        String imagePath = problemService.uploadImage(id, image);
        return ApiResponse.success(imagePath);
    }

    @DeleteMapping("/{id}/image")
    @Operation(summary = "문제 이미지 삭제")
    public ApiResponse<Void> deleteImage(
            @PathVariable Long id,
            @Parameter(description = USERNAME_DESC) @RequestHeader("X-Username") String username) {
        problemService.deleteImage(id);
        return ApiResponse.success(null);
    }

    @GetMapping("/images/{*filename}")
    @Operation(summary = "문제 이미지 조회 (인증 불필요, Gateway 화이트리스트)")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
        // PathPatternParser의 {*filename} 캡처 변수는 선행 '/'를 포함해서 넘어온다.
        String relativePath = filename.startsWith("/") ? filename.substring(1) : filename;
        Path path = imageStorageService.resolve(relativePath);
        if (!Files.exists(path)) {
            throw new ResourceNotFoundException("이미지를 찾을 수 없습니다: " + relativePath);
        }
        String contentType = Files.probeContentType(path);
        return ResponseEntity.ok()
                .contentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM)
                .body(new FileSystemResource(path));
    }

    @PostMapping("/search-by-condition")
    @Hidden
    @Operation(summary = "조건별 문제 id 검색 (examsheet-service 내부 호출 전용)")
    public ApiResponse<List<Long>> searchByCondition(
            @RequestBody ProblemConditionDto condition,
            @RequestHeader("X-Username") String username) {
        return ApiResponse.success(problemService.searchByCondition(condition));
    }

    @PostMapping("/by-ids")
    @Hidden
    @Operation(summary = "id 목록으로 문제 상세 배치 조회 (examsheet-service 내부 호출 전용)")
    public ApiResponse<List<ProblemDetailDto>> byIds(
            @RequestBody List<Long> ids,
            @RequestHeader("X-Username") String username) {
        return ApiResponse.success(problemService.findByIds(ids));
    }
}
