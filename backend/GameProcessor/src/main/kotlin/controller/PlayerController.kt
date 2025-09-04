package com.example.controller

import com.example.model.Player
import com.example.service.PlayerService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.awt.Color

@RestController
@RequestMapping("/api/players")
class PlayerController(private val playerService: PlayerService) {

    private val log = LoggerFactory.getLogger(PlayerController::class.java)

    @PostMapping
    fun addPlayer(@RequestBody req: AddPlayerRequest): ResponseEntity<Player> {
        val player = playerService.addPlayer(req.name, req.gameClassName)
        return ResponseEntity.status(HttpStatus.CREATED).body(player)
    }

    @GetMapping
    fun getPlayers(): ResponseEntity<List<Player>> {
        val players = playerService.getPlayers()
        return ResponseEntity.ok(players)
    }

    @GetMapping("/{playerName}")
    fun getPlayer(@PathVariable playerName: String): ResponseEntity<Player> {
        val player = playerService.getPlayer(playerName)
        return if (player != null) ResponseEntity.ok(player)
               else ResponseEntity.notFound().build()
    }

    data class AddPlayerRequest(val name: String, val gameClassName: String, val color: String)
}