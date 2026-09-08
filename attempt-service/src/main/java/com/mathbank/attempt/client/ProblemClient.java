package com.mathbank.attempt.client;

import com.mathbank.attempt.common.response.ApiResponse;
import com.mathbank.attempt.dto.ProblemDetailDto;
import com.mathbank.attempt.dto.ProblemSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "problem-client", url = "${problem.service.url:http://localhost:8082}")
public interface ProblemClient {

    @GetMapping("/api/problems/{id}")
    ApiResponse<ProblemDetailDto> getProblem(@RequestHeader("X-Username") String username,
                                              @PathVariable Long id);

    @PostMapping("/api/problems/by-ids")
    ApiResponse<List<ProblemSummaryDto>> getProblemsByIds(@RequestHeader("X-Username") String username,
                                                           @RequestBody List<Long> ids);
}
