package com.mathbank.examsheet.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient problemServiceRestClient(@Value("${problem.service.url}") String problemServiceUrl) {
        return RestClient.create(problemServiceUrl);
    }
}
