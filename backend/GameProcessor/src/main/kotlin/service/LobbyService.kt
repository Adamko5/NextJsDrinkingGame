package com.example.service

import com.example.model.Lobby
import com.example.model.LobbyStatus
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class LobbyService {
    private val log = LoggerFactory.getLogger(LobbyService::class.java)
    private var currentLobby: Lobby? = null

    fun createLobby(): Lobby {
        if (currentLobby == null) {
            currentLobby = Lobby()
            log.info("Created lobby.")
        } else {
            throw IllegalStateException("Lobby already exists")
        }
        return currentLobby!!
    }
    
    fun getLobby(): Lobby? = currentLobby

    fun advancePhase(advanceBy: Int = 1) {
        currentLobby?.phase += advanceBy;
        log.info("Lobby advanced phase to {}", currentLobby?.phase)
    }

    fun startGame() {
        val lobby = getLobby() ?: throw IllegalStateException("Lobby does not exist")
        if (lobby.status == LobbyStatus.LOBBY) {
            lobby.status = LobbyStatus.PLAYING
            log.info("Lobby started playing")
        } else {
            throw IllegalStateException("Lobby is already in progress")
        }
    }
}