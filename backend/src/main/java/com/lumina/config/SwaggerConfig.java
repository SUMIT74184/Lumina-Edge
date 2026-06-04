package com.lumina.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI luminaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Lumina Edge API")
                        .description("REST API for Lumina Edge Performance Tracking System")
                        .version("v1.0"));
    }
}
