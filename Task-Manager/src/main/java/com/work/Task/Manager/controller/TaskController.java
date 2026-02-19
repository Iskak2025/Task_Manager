package com.work.Task.Manager.controller;

import com.work.Task.Manager.DTO.TaskDto;
import com.work.Task.Manager.DTO.TaskResponseDto;
import com.work.Task.Manager.entity.Status;
import com.work.Task.Manager.entity.User;
import com.work.Task.Manager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
    public ResponseEntity<TaskResponseDto> create(
            @PathVariable Long projectId,
            @RequestBody TaskDto dto,
            @AuthenticationPrincipal User user) {

        TaskResponseDto created = taskService.createTask(projectId, dto, user);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/get_all")
    public ResponseEntity<List<TaskResponseDto>> listTasks(@PathVariable Long projectId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.getProjectTasks(projectId, user));
    }

    @PatchMapping("/update_status/{taskId}")
    public ResponseEntity<TaskResponseDto> updateStatus(
            @PathVariable Long taskId,
            @RequestBody Status status,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(taskService.updateStatus(taskId, status, user));
    }

    @PutMapping("/update/{taskId}")
    public ResponseEntity<TaskResponseDto> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.updateTask(taskId, dto, user));
    }

    @PatchMapping("/{taskId}/assignee/{userId}")
    public ResponseEntity<TaskResponseDto> assignAssignee(
            @PathVariable Long taskId,
            @PathVariable Long userId,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(taskService.assignAssignee(taskId, userId, user));
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<Void> delete(@PathVariable Long taskId, @AuthenticationPrincipal User user) {
        taskService.delete(taskId, user);
        return ResponseEntity.noContent().build();
    }
}
