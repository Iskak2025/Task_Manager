package com.work.Task.Manager.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Set;

public class ProjectDto {

    @NotNull
    private Long id;

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Long ownerId;

    @NotNull
    private Set<Long> memberIds;

    private Set<UserResponseDto> members;

    private String ownerUsername;

    private LocalDateTime createdAt;

    public @NotNull Long getId() {
        return id;
    }

    public void setId(@NotNull Long id) {
        this.id = id;
    }

    public @NotBlank String getName() {
        return name;
    }

    public void setName(@NotBlank String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public @NotNull Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(@NotNull Long ownerId) {
        this.ownerId = ownerId;
    }

    public @NotNull Set<Long> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(@NotNull Set<Long> memberIds) {
        this.memberIds = memberIds;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public Set<UserResponseDto> getMembers() {
        return members;
    }

    public void setMembers(Set<UserResponseDto> members) {
        this.members = members;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
