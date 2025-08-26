package com.example.controller

import com.example.service.BasicService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class BasicController(private val basicService: BasicService) {

    @GetMapping("/message")
    fun getMessage(): String {
        return basicService.getPlaceholderText()
    }
}