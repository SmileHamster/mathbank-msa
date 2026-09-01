package com.mathbank.examsheet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ExamsheetServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExamsheetServiceApplication.class, args);
    }
}
