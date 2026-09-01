package com.mathbank.auth.controller;

import com.mathbank.auth.common.response.ApiResponse;
import com.mathbank.auth.dto.LoginRequest;
import com.mathbank.auth.dto.LoginResponse;
import com.mathbank.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "회원 인증 API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "아이디/비밀번호로 로그인하고 JWT 액세스 토큰을 발급받는다.")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "서버는 상태를 갖지 않으므로 토큰 폐기는 클라이언트가 처리한다.")
    public ApiResponse<Map<String, String>> logout() {
        return ApiResponse.success(Map.of("message", "로그아웃 되었습니다"));
    }
}
