package com.example.model

import java.util.concurrent.ConcurrentHashMap

data class Snapshot(
    val players: List<Player>,
    val lobby: Lobby?,
    val votes: ConcurrentHashMap<String, Vote>
)