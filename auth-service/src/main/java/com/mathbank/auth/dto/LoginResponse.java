package com.mathbank.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private String username;
    private String role;
}
