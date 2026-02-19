package com.work.Task.Manager.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CommentDto {

    private Long id;

    @NotBlank
    private String text;

    private String authorUsername;

    private Long authorId;

    @NotNull
    private Long taskId;

    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank String getText() {
        return text;
    }

    public void setText(@NotBlank String text) {
        this.text = text;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public @NotNull Long getTaskId() {
        return taskId;
    }

    public void setTaskId(@NotNull Long taskId) {
        this.taskId = taskId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
