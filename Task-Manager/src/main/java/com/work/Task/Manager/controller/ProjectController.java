package com.work.Task.Manager.controller;

import com.work.Task.Manager.DTO.ProjectCreateDto;
import com.work.Task.Manager.DTO.ProjectDto;
import com.work.Task.Manager.entity.Project;
import com.work.Task.Manager.entity.User;
import com.work.Task.Manager.service.CommentService;
import com.work.Task.Manager.service.ProjectService;
import com.work.Task.Manager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;


    @GetMapping("/get_project/{id}")
    public ProjectDto getProject(@PathVariable Long id,
                                 @AuthenticationPrincipal User user) {
        return projectService.getProjectById(id, user);
    }


    @GetMapping("/get_all")
    public List<ProjectDto> getAll(@AuthenticationPrincipal User user) {
        return projectService.getUserProjects(user);
    }

    @PostMapping("/create")
    public ProjectDto create(@Valid @RequestBody ProjectCreateDto dto,
                          @AuthenticationPrincipal User user) {
        return projectService.createProject(dto, user);
    }


    @PostMapping("/{projectId}/add_members/{userId}")
    public ProjectDto addMember(@PathVariable Long projectId, @PathVariable Long userId, @AuthenticationPrincipal User user) {
        return projectService.addMember(projectId, userId, user);
    }

    @PutMapping("/update/{projectId}")
    public ProjectDto updateProject(@PathVariable Long projectId,@Valid @RequestBody ProjectCreateDto update_project, @AuthenticationPrincipal User user) {
        return projectService.updateProject(projectId, update_project, user);
    }

    @DeleteMapping("/delete/{projectId}")
    public void deleteProject(@PathVariable Long projectId, @AuthenticationPrincipal User user) {
        projectService.deleteProject(projectId, user);
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ProjectDto deleteMember(@PathVariable Long projectId, @PathVariable Long userId, @AuthenticationPrincipal User user) {
        return projectService.deleteMember(projectId, userId, user);
    }
}