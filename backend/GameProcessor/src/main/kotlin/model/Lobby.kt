package com.example.model

data class Lobby(
    var status: LobbyStatus = LobbyStatus.LOBBY,
    var phase: Int = 1
)