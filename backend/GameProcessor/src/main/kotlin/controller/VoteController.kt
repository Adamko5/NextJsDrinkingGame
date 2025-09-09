package com.example.controller

import com.example.model.Vote
import com.example.service.VoteService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.concurrent.ConcurrentHashMap

@RestController
@RequestMapping("/api/votes")
class VoteController(private val voteService: VoteService) {

    private val log = LoggerFactory.getLogger(VoteController::class.java)

    @PostMapping
    fun addVote(@RequestBody req: AddVoteRequest): ResponseEntity<Vote> {
        val vote = voteService.addVote(
            req.byPlayer,
            req.binary,
            req.forPlayer,
            req.forOption
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(vote)
    }

    @GetMapping
    fun getVotes(): ResponseEntity<ConcurrentHashMap<String, Vote>?> {
        return ResponseEntity.ok(voteService.getVotes())
    }

    @GetMapping("/{name}")
    fun getVote(@PathVariable name: String): ResponseEntity<Vote> {
        val vote = voteService.getVoteByName(name)
        return if (vote != null) ResponseEntity.ok(vote)
               else ResponseEntity.notFound().build()
    }

    data class AddVoteRequest(val byPlayer: String,
                              val binary: Boolean?,
                              val forPlayer: String?,
                              val forOption: String?
    )

}