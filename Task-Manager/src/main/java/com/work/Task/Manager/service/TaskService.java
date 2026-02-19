package com.work.Task.Manager.service;

import com.work.Task.Manager.DTO.TaskDto;
import com.work.Task.Manager.DTO.TaskResponseDto;
import com.work.Task.Manager.entity.*;
import com.work.Task.Manager.repositories.ProjectRepository;
import com.work.Task.Manager.repositories.TaskRepository;
import com.work.Task.Manager.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public TaskResponseDto createTask(Long projectId, TaskDto dto, User creator) {

        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Проект не найден: " + projectId));

        checkProjectAccess(project, creator);

        if(creator.getRole() != Role.ADMIN && !isProjectOwner(project, creator)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только владелец задачи может создавать задачу");
        }

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setProject(project);
        task.setCreator(creator);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        
        task.setStatus(dto.getStatus() == null ? Status.TODO : dto.getStatus());
        task.setPriority(dto.getPriority() == null ? Priority.MEDIUM : dto.getPriority());
        task.setDueDate(dto.getDueDate());

        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Исполнитель не найден"));

            if (!isProjectMember(project, assignee) && !isProjectOwner(project, assignee)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Исполнителем может быть только участник или владелец проекта");
            }
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);
        return new TaskResponseDto(savedTask);
    }

    public List<TaskResponseDto> getProjectTasks(Long projectId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Проект не найден: " + projectId));
        
        checkProjectAccess(project, currentUser);
        
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream()
                .map(TaskResponseDto::new)
                .toList();
    }

    @Transactional
    public TaskResponseDto updateStatus(Long taskId, Status status, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Задача не найдена: " + taskId));

        checkTaskAccess(task, currentUser);
        checkTaskMutationAccess(task, currentUser);

        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());
        Task savedTask = taskRepository.save(task);
        return new TaskResponseDto(savedTask);
    }

    @Transactional
    public void delete(Long taskId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Задача не найдена: " + taskId));

        checkTaskMutationAccess(task, currentUser);
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponseDto updateTask(Long taskId, TaskDto dto, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Задача не найдена: " + taskId));

        checkTaskMutationAccess(task, currentUser);

        if (dto.getTitle() != null) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getDueDate() != null) task.setDueDate(dto.getDueDate());

        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));
            if (!isProjectMember(task.getProject(), assignee) && !isProjectOwner(task.getProject(), assignee)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Исполнителем может быть только участник или владелец проекта");
            }
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        checkTaskMutationAccess(task, currentUser);

        task.setUpdatedAt(LocalDateTime.now());
        return new TaskResponseDto(taskRepository.save(task));
    }

    @Transactional
    public TaskResponseDto assignAssignee(Long taskId, Long assigneeId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Задача не найдена"));

        Project project = task.getProject();
        if (currentUser.getRole() != Role.ADMIN && !isProjectOwner(project, currentUser) && !isProjectMember(project, currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нет доступа к проекту");
        }

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        if (!isProjectMember(project, assignee) && !isProjectOwner(project, assignee)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Исполнителем может быть только участник или владелец проекта");
        }

        boolean isCreator = task.getCreator() != null && task.getCreator().getId().equals(currentUser.getId());
        boolean isOwner = isProjectOwner(task.getProject(), currentUser);

        if (!isCreator && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только создатель задачи или владелец проекта может изменять/удалять задачу");
        }

        task.setAssignee(assignee);
        task.setUpdatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);
        return new TaskResponseDto(savedTask);
    }


    private void checkTaskAccess(Task task, User user) {
        if (user.getRole() == Role.ADMIN) return;

        Project project = task.getProject();
        if (!isProjectMember(project, user) && !isProjectOwner(project, user)) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нет доступа к задаче");
        }
    }

    private void checkTaskMutationAccess(Task task, User user) {
        if (user.getRole() == Role.ADMIN) return;
        
        boolean isCreator = task.getCreator() != null && task.getCreator().getId().equals(user.getId());
        boolean isOwner = isProjectOwner(task.getProject(), user);
        
        if (!isCreator && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Только создатель задачи или владелец проекта может изменять/удалять задачу");
        }
    }

    private boolean isProjectMember(Project project, User user) {
        return project.getMembers().stream()
                .anyMatch(m -> m.getId().equals(user.getId()));
    }

    private boolean isProjectOwner(Project project, User user) {
        return project.getOwner() != null && project.getOwner().getId().equals(user.getId());
    }

    private void checkProjectAccess(Project project, User user) {
        if (user.getRole() == Role.ADMIN) return;

        if (!isProjectMember(project, user) && !isProjectOwner(project, user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нет доступа к проекту");
        }
    }
}
