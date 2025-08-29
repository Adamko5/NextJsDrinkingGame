package com.example.config

import jakarta.servlet.Filter
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class CorsLoggingFilter : Filter {
    private val logger = LoggerFactory.getLogger(CorsLoggingFilter::class.java)

    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val httpRequest = request as HttpServletRequest
        val httpResponse = response as HttpServletResponse

        val origin = httpRequest.getHeader("Origin")
//        if (origin != null) {
//            logger.info("CORS Request from origin: $origin, method: ${httpRequest.method}, path: ${httpRequest.requestURI}")
//        }

        val corsResponseListener = object : HttpServletResponse by httpResponse {
            override fun setStatus(sc: Int) {
                if (origin != null && sc == HttpServletResponse.SC_FORBIDDEN) {
                    logger.error("CORS ERROR: Request from origin $origin was rejected with status $sc")
                    logger.error("Request headers: ${logHeaders(httpRequest)}")
                }
                httpResponse.setStatus(sc)
            }
        }

        chain.doFilter(request, corsResponseListener)
    }

    private fun logHeaders(request: HttpServletRequest): String {
        val headers = StringBuilder()
        val headerNames = request.headerNames
        while (headerNames.hasMoreElements()) {
            val headerName = headerNames.nextElement()
            headers.append("$headerName: ${request.getHeader(headerName)}, ")
        }
        return headers.toString()
    }
}
