package com.mathbank.auth.service;

import com.mathbank.auth.domain.Member;
import com.mathbank.auth.dto.LoginRequest;
import com.mathbank.auth.dto.LoginResponse;
import com.mathbank.auth.mapper.MemberMapper;
import com.mathbank.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Member member = memberMapper.findByUsername(request.getUsername());
        if (member == null || !passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다");
        }

        String token = jwtUtil.generateToken(member.getUsername(), member.getRole());

        return LoginResponse.builder()
                .accessToken(token)
                .username(member.getUsername())
                .role(member.getRole())
                .build();
    }
}
