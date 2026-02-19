package com.work.Task.Manager.DTO;

import com.work.Task.Manager.entity.Status;

public class TaskStatusDto {
    private Status status;

    public TaskStatusDto(Status status) {
        this.status = status;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
