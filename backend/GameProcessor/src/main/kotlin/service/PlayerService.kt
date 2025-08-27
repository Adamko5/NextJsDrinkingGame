package com.example.service

import com.example.constants.GameClasses
import com.example.model.Player
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Service
class PlayerService {
    private val log = LoggerFactory.getLogger(PlayerService::class.java)
    private val players = ConcurrentHashMap<String, Player>()

    fun addPlayer(name: String, gameClassName: String): Player {
        if (players.containsKey(name)) {
            throw IllegalArgumentException("Player with name $name already exists")
        }

        val gameClass = GameClasses.getClassByName(gameClassName) ?: throw IllegalArgumentException("Game class not found")
        val playerKey = UUID.randomUUID().toString().replace("-", "").substring(0, 8)
        val player = Player(name = name, gameClass = gameClass, playerKey = playerKey)
        players[name] = player
        log.info("Added player with name {} and gameClass {}", name, gameClass)
        return player
    }

    fun getPlayers(): List<Player> = players.values.toList()

    fun getPlayer(name: String?): Player? = players[name]
}