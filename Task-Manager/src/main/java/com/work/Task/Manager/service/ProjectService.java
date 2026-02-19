package com.work.Task.Manager.service;

import com.work.Task.Manager.DTO.ProjectCreateDto;
import com.work.Task.Manager.DTO.ProjectDto;
import com.work.Task.Manager.DTO.UserResponseDto;
import com.work.Task.Manager.entity.*;

import com.work.Task.Manager.repositories.ProjectRepository;
import com.work.Task.Manager.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;


    public ProjectDto getProjectById(Long id, User user) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Проект не найден"));

        if (user.getRole() != Role.ADMIN && !isProjectOwner(project, user) && !isProjectMember(project, user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нет доступа к проекту");
        }
        return mapToDto(project);
    }


    @Transactional
    public ProjectDto createProject(ProjectCreateDto dto, User owner) {

        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setOwner(owner);

        Project saved = projectRepository.save(project);
        return mapToDto(saved);
    }


    public List<ProjectDto> getUserProjects(User user) {
        List<Project> projects;

        if (user.getRole() == Role.ADMIN) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findProjectsByUserId(user.getId());
        }

        return projects.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    @Transactional
    public ProjectDto addMember(Long projectId, Long userId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Проект не найден"));

        if (currentUser.getRole() != Role.ADMIN && !isProjectOwner(project, currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только создатель проекта или администратор может добавлять участников");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        if (project.getMembers().contains(user)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Пользователь уже является участником проекта");
        }

        project.getMembers().add(user);
        Project saved = projectRepository.save(project);
        return mapToDto(saved);
    }

    @Transactional
    public ProjectDto updateProject(Long projectId, ProjectCreateDto updateDto, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Проект не найден"));

        if (currentUser.getRole() != Role.ADMIN && !isProjectOwner(project, currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только создатель проекта или администратор может изменять проект");
        }
        project.setName(updateDto.getName());
        project.setDescription(updateDto.getDescription());

        Project saved = projectRepository.save(project);
        return mapToDto(saved);
    }


    @Transactional
    public ProjectDto deleteMember(Long projectId, Long userId, User currentUser){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Проект не найден"));
        
        if (currentUser.getRole() != Role.ADMIN && !isProjectOwner(project, currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только владелец проекта или администратор может выполнять это действие");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        project.getMembers().remove(user);
        Project saved = projectRepository.save(project);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteProject(Long projectId, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Проект не найден"));

        if (user.getRole() != Role.ADMIN && !isProjectOwner(project, user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только владелец проекта или администратор может удалить проект");
        }
        projectRepository.delete(project);
    }

    private boolean isProjectMember(Project project, User user) {
        return project.getMembers()
                .stream()
                .anyMatch(u -> u.getId().equals(user.getId()));
    }

    private void checkIsProjectOwner(Project project, User user) {
        if (user.getRole() != Role.ADMIN && !isProjectOwner(project, user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только владелец проекта или администратор может выполнять это действие");
        }
    }

    private boolean isProjectOwner(Project project, User currentUser) {
        if (project.getOwner() == null) {
            return false;
        }
        return Objects.equals(project.getOwner().getId(), currentUser.getId());
    }


    private ProjectDto mapToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        if (project.getOwner() != null) {
            dto.setOwnerId(project.getOwner().getId());
            dto.setOwnerUsername(project.getOwner().getUsername());
        }

        Set<Long> ids = new HashSet<>();
        Set<UserResponseDto> memberDtos = new HashSet<>();
        if (project.getMembers() != null) {
            for (User u : project.getMembers()) {
                ids.add(u.getId());
                memberDtos.add(new UserResponseDto(u));
            }
        }
        dto.setMemberIds(ids);
        dto.setMembers(memberDtos);

        dto.setCreatedAt(project.getCreatedAt());

        return dto;
    }
}