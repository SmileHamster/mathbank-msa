package com.mathbank.auth.config;

import com.mathbank.auth.domain.Member;
import com.mathbank.auth.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Value("${app.admin.init-password}")
    private String initPassword;

    @Bean
    public CommandLineRunner initAdmin(PasswordEncoder passwordEncoder, MemberMapper memberMapper) {
        return args -> {
            if (memberMapper.findByUsername("admin") == null) {
                Member member = Member.builder()
                        .username("admin")
                        .password(passwordEncoder.encode(initPassword))
                        .role("ADMIN")
                        .build();
                memberMapper.insert(member);
                System.out.println("=== ADMIN ACCOUNT CREATED ===");
            }
        };
    }
}
