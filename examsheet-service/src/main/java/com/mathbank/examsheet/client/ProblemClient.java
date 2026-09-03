package com.mathbank.examsheet.client;

import com.mathbank.examsheet.common.response.ApiResponse;
import com.mathbank.examsheet.dto.ProblemConditionDto;
import com.mathbank.examsheet.dto.ProblemDto;
import com.mathbank.examsheet.dto.TagDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.Map;

@FeignClient(name = "problem-service", url = "${problem.service.url:http://localhost:8082}")
public interface ProblemClient {

    @GetMapping("/api/problems/tags")
    ApiResponse<Map<String, List<TagDto>>> getTags(@RequestHeader("X-Username") String username);

    @PostMapping("/api/problems/search-by-condition")
    ApiResponse<List<Long>> findIdsByCondition(@RequestHeader("X-Username") String username,
                                                @RequestBody ProblemConditionDto condition);

    @PostMapping("/api/problems/by-ids")
    ApiResponse<List<ProblemDto>> findByIds(@RequestHeader("X-Username") String username,
                                             @RequestBody List<Long> ids);
}
