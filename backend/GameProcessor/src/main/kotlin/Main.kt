package com.example

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class GameProcessorApplication

fun main(args: Array<String>) {
    runApplication<GameProcessorApplication>(*args)
}