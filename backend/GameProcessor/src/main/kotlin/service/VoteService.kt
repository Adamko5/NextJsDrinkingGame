package com.example.service

import com.example.model.Vote
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

@Service
class VoteService (private val playerService: PlayerService){
    private val log = LoggerFactory.getLogger(VoteService::class.java)
    // map of playerID and his vote
    private val votes = ConcurrentHashMap<String, Vote>()

    fun addVote(byPlayer: String,
                binary: Boolean?,
                forPlayer: String?): Vote {
        log.info("Adding vote by player {} for binary {} for player {}", byPlayer, binary, forPlayer)
        val forPlayer = playerService.getPlayer(forPlayer) ?: throw IllegalArgumentException("Player not found")
        val vote = Vote (binary = binary, forPlayer = forPlayer)
        votes[byPlayer] = vote
        log.info("Added vote by player {}", byPlayer)
        return vote
    }

    fun getVotes(): ConcurrentHashMap<String, Vote> = votes

    fun clearVotes() {
        votes.clear()
        log.info("Cleared all votes")
    }

    fun getVoteByName(name: String): Vote? = votes[name]
}