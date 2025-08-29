package com.example.config

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration(proxyBeanMethods = false)
class GlobalCorsConfig : WebMvcConfigurer {
    private val logger = LoggerFactory.getLogger(GlobalCorsConfig::class.java)

    override fun addCorsMappings(registry: CorsRegistry) {
        logger.info("Configuring CORS with all origins allowed")
        registry.addMapping("/**")
            // Allow all origins by using a wildcard pattern.
            .allowedOriginPatterns("*")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("*") // Expose all headers to the client
            .allowCredentials(true) // Allow credentials like cookies
            .maxAge(3600) // Cache preflight requests for 1 hour
    }
}