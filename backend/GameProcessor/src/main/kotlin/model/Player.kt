package com.example.model

import java.awt.Color

data class Player(
    var name: String,
    var gameClass: GameClass,
    var connected: Boolean = true,
    val playerKey: String,
    val color: String
)