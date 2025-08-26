package com.example.service

import org.springframework.stereotype.Service

@Service
class BasicService {
    fun getPlaceholderText(): String {
        return "Hello, this is a placeholder text."
    }
}