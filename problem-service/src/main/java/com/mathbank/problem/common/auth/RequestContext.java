package com.mathbank.problem.common.auth;

public record RequestContext(String username, String role) {
    public static RequestContext of(String username, String role) {
        return new RequestContext(username, role);
    }
}
