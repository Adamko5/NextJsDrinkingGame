package com.example.service

import com.example.model.GameClass
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

        val gameClass = GameClass(gameClassName)
        val playerKey = UUID.randomUUID().toString().replace("-", "").substring(0, 8)
        val player = Player(name = name, gameClass = gameClass, playerKey = playerKey)
        players[name] = player
        log.info("Added player with name {} and gameClass {}", name, gameClass)
        return player
    }

fun getPlayers(): List<Player> { 
    val playerList = players.values.toList()
//    log.info("Retrieved {} players", playerList.size)
    return playerList
}

fun getPlayer(name: String?): Player? { 
    if (name == null) { 
        log.warn("Attempted to get a player with null name; returning null")
        return null
    }
    val player = players[name]
    if (player != null) {
        log.info("Player found for name {}: {}", name, player)
    } else {
        log.info("No player found for name {}", name)
    }
    return player
}
}