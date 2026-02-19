package com.work.Task.Manager.controller;

import com.work.Task.Manager.DTO.CommentDto;
import com.work.Task.Manager.entity.User;
import com.work.Task.Manager.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CommentDto dto,
            @AuthenticationPrincipal User user) {

        dto.setTaskId(taskId);
        CommentDto created = commentService.createComment(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/get_all")
    public ResponseEntity<List<CommentDto>> getAllComments(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(commentService.getAllComments(taskId, user));
    }

    @PutMapping("/update/{commentId}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentDto dto,
            @AuthenticationPrincipal User user){

        return ResponseEntity.ok(commentService.updateComment(commentId, dto, user));
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal User user) {

        commentService.deleteComment(commentId, user);
        return ResponseEntity.noContent().build();
    }
}
