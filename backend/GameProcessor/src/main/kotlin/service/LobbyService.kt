package com.example.service

import com.example.model.Lobby
import com.example.model.LobbyStatus
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class LobbyService {
    private val log = LoggerFactory.getLogger(LobbyService::class.java)

    private var currentLobby: Lobby = Lobby()
    
    fun getLobby(): Lobby? = currentLobby

    fun advancePhase(advanceBy: Int = 1) {
        currentLobby?.phase += advanceBy;
        log.info("Lobby advanced phase to {}", currentLobby?.phase)
    }

    fun setPhaseTo(setPhaseTo: Int) {
        currentLobby?.phase = setPhaseTo;
        log.info("Lobby phase set to {}", currentLobby?.phase)
    }

    fun startGame() {
        val lobby = getLobby() ?: throw IllegalStateException("Lobby does not exist")
        if (lobby.status == LobbyStatus.LOBBY) {
            lobby.status = LobbyStatus.PLAYING
            advancePhase()
            log.info("Lobby started playing")
        } else {
            log.info("Error when starting lobby")
            throw IllegalStateException("Lobby is already in progress")
        }
    }
}