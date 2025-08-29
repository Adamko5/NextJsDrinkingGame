package com.example.controller

import com.example.model.Snapshot
import com.example.service.SnapshotService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.CrossOrigin

@RestController
@RequestMapping("/api/snapshot")
class SnapshotController(private val snapshotService: SnapshotService) {

    @GetMapping
    fun getSnapshot(): ResponseEntity<Snapshot> {
        val snapshot = snapshotService.getSnapshot()
        return ResponseEntity.status(HttpStatus.OK).body(snapshot)
    }
}