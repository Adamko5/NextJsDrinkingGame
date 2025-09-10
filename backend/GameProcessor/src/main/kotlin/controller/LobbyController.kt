package com.example.controller

import com.example.model.Lobby
import com.example.service.LobbyService
import com.example.service.VoteService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/lobby")
class LobbyController(private val lobbyService: LobbyService, private val voteService: VoteService) {

    @GetMapping
    fun getLobby(): ResponseEntity<Lobby> {
        val lobby = lobbyService.getLobby()
        return ResponseEntity.status(HttpStatus.OK).body(lobby)
    }

    @PostMapping("/start")
    fun startLobby(): ResponseEntity<String> {
        lobbyService.startGame()
        return ResponseEntity.status(HttpStatus.OK).body("Lobby created.")
    }

    @PostMapping("/advancePhase")
    fun advancePhase(): ResponseEntity<String> {
        lobbyService.advancePhase()
        return ResponseEntity.status(HttpStatus.OK).body("Phase advanced.")
    }

    @PostMapping("/advancePhaseBy")
    fun advancePhase(@RequestParam("advanceBy") advanceBy: Int): ResponseEntity<String> {
        lobbyService.advancePhase(advanceBy)
        return ResponseEntity.status(HttpStatus.OK).body("Phase advanced by $advanceBy.")
    }

    @PostMapping("/setPhaseAndClean")
    fun setPhaseTo(@RequestParam("setPhaseTo") setPhaseTo: Int): ResponseEntity<String> {
        voteService.clearVotes()
        lobbyService.setPhaseTo(setPhaseTo)
        return ResponseEntity.status(HttpStatus.OK).body("Phase set to $setPhaseTo.")
    }

}