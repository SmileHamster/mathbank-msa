package com.mathbank.examsheet.common.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class ApiResponse<T> {
    private final boolean success;
    private final String message;
    private final T data;

    @JsonCreator
    private ApiResponse(@JsonProperty("success") boolean success,
                         @JsonProperty("message") String message,
                         @JsonProperty("data") T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
