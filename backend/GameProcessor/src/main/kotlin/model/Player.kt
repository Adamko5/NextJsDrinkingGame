package com.example.model

data class Player(
    var name: String,
    var gameClass: GameClass,
    var connected: Boolean = true,
    val playerKey: String
)