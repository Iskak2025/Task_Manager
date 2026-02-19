package com.work.Task.Manager.DTO;

import com.work.Task.Manager.entity.Priority;
import com.work.Task.Manager.entity.Status;
import com.work.Task.Manager.entity.Task;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponseDto {

    private Long id;
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDate dueDate;
    private Long projectId;
    private UserResponseDto assignee;
    private UserResponseDto creator;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskResponseDto(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.status = task.getStatus();
        this.priority = task.getPriority();
        this.dueDate = task.getDueDate();
        this.projectId = task.getProject().getId();
        this.createdAt = task.getCreatedAt();
        this.updatedAt = task.getUpdatedAt();
        
        if (task.getAssignee() != null) {
            this.assignee = new UserResponseDto(task.getAssignee());
        }
        
        if (task.getCreator() != null) {
            this.creator = new UserResponseDto(task.getCreator());
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public UserResponseDto getAssignee() {
        return assignee;
    }

    public void setAssignee(UserResponseDto assignee) {
        this.assignee = assignee;
    }

    public UserResponseDto getCreator() {
        return creator;
    }

    public void setCreator(UserResponseDto creator) {
        this.creator = creator;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
