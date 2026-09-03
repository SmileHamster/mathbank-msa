package com.mathbank.examsheet.controller;

import com.mathbank.examsheet.common.response.ApiResponse;
import com.mathbank.examsheet.dto.ExamSheetCreateDto;
import com.mathbank.examsheet.dto.ExamSheetDetailDto;
import com.mathbank.examsheet.dto.ExamSheetListDto;
import com.mathbank.examsheet.dto.TagDto;
import com.mathbank.examsheet.service.ExamSheetService;
import com.mathbank.examsheet.service.PdfService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/examsheets")
@RequiredArgsConstructor
public class ExamSheetController {

    /**
     * PDF 엔드포인트는 브라우저가 직접 새 탭/iframe으로 열 수 있어야 해서
     * Gateway JWT 화이트리스트에 들어가 있다(Authorization 헤더를 못 붙이는 네비게이션 대응).
     * 그래서 X-Username이 주입되지 않는데, problem-service 내부 API 호출에는
     * 사용자 식별자가 필요하므로 이 경로에서만 고정 시스템 식별자를 사용한다.
     */
    private static final String PDF_SYSTEM_USER = "examsheet-service";

    private final ExamSheetService examSheetService;
    private final PdfService pdfService;

    @GetMapping
    public ApiResponse<List<ExamSheetListDto>> list(@RequestHeader("X-Username") String username) {
        return ApiResponse.success(examSheetService.getExamSheetList(username));
    }

    /**
     * problem-service 태그 목록을 그대로 프록시한다.
     * 지시문 스펙(2-6)에는 없지만, 테스트 시나리오(3)가 서비스 간 통신(OpenFeign) 확인용으로
     * 명시적으로 요구하는 엔드포인트라 추가했다.
     */
    @GetMapping("/tags")
    public ApiResponse<Map<String, List<TagDto>>> tags(@RequestHeader("X-Username") String username) {
        return ApiResponse.success(examSheetService.getTags(username));
    }

    @GetMapping("/{id}")
    public ApiResponse<ExamSheetDetailDto> detail(@PathVariable Long id,
                                                   @RequestHeader("X-Username") String username) {
        return ApiResponse.success(examSheetService.getExamSheetDetail(id, username));
    }

    @PostMapping
    public ApiResponse<Long> create(@RequestBody @Valid ExamSheetCreateDto dto,
                                     @RequestHeader("X-Username") String username) {
        Long id = examSheetService.createExamSheet(dto, username);
        return ApiResponse.success(id);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        examSheetService.deleteExamSheet(id);
        return ApiResponse.success(null);
    }

    @GetMapping("/{id}/pdf")
    public void pdf(@PathVariable Long id, HttpServletResponse response) throws Exception {
        pdfService.generateExamPdf(id, PDF_SYSTEM_USER, response, false);
    }

    @GetMapping("/{id}/pdf/answer")
    public void pdfAnswer(@PathVariable Long id, HttpServletResponse response) throws Exception {
        pdfService.generateExamPdf(id, PDF_SYSTEM_USER, response, true);
    }
}
