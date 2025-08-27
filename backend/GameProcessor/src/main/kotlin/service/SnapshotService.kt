package com.example.service

import com.example.model.Snapshot
import org.springframework.stereotype.Service

@Service
class SnapshotService(
    private val playerService: PlayerService,
    private val lobbyService: LobbyService,
    private val voteService: VoteService
) {
    fun getSnapshot(): Snapshot {
        return Snapshot(
            players = playerService.getPlayers(),
            lobby = lobbyService.getLobby(),
            votes = voteService.getVotes()
        )
    }
}