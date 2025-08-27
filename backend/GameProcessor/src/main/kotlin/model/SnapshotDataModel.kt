package com.example.model

data class Snapshot(
    val players: List<Player>,
    val lobby: Lobby?,
    val votes: List<Vote>
)