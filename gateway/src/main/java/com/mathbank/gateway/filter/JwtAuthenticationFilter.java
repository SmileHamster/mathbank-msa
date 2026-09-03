package com.mathbank.gateway.filter;

import com.mathbank.gateway.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    // 정적 경로뿐 아니라 {id} 같은 경로 변수가 섞인 패턴도 화이트리스트에 넣어야 해서
    // 단순 List.contains 대신 AntPathMatcher로 매칭한다.
    private static final List<String> WHITE_LIST = List.of(
            "/api/auth/login",
            "/api/auth/logout",
            "/api/problems/images/**",
            "/api/examsheets/*/pdf",
            "/api/examsheets/*/pdf/answer"
    );

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        if (WHITE_LIST.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, path))) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return unauthorized(exchange);
        }

        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header("X-Username", username)
                .header("X-Role", role)
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
