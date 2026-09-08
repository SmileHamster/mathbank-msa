package com.mathbank.attempt.client;

import com.mathbank.attempt.common.response.ApiResponse;
import com.mathbank.attempt.dto.ExamSheetDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "examsheet-client", url = "${examsheet.service.url:http://localhost:8083}")
public interface ExamSheetClient {

    @GetMapping("/api/examsheets/{id}")
    ApiResponse<ExamSheetDto> getExamSheet(@RequestHeader("X-Username") String username,
                                            @PathVariable Long id);
}
