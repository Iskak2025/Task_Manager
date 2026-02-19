package com.work.Task.Manager.service;

import com.work.Task.Manager.DTO.CommentDto;
import com.work.Task.Manager.entity.Comment;
import com.work.Task.Manager.entity.Project;
import com.work.Task.Manager.entity.Role;
import com.work.Task.Manager.entity.Task;
import com.work.Task.Manager.entity.User;
import com.work.Task.Manager.repositories.CommentRepository;
import com.work.Task.Manager.repositories.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Transactional
    public CommentDto createComment(CommentDto dto, User author) {

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Задача не найдена"));

        Project project = task.getProject();
        if (author.getRole() != Role.ADMIN && !isProjectOwner(project, author) && !isProjectMember(project, author)) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нет доступа к этой задаче");
        }

        Comment comment = new Comment();
        comment.setText(dto.getText());
        comment.setAuthor(author);
        comment.setTask(task);

        Comment saved = commentRepository.save(comment);

        CommentDto response = new CommentDto();
        response.setId(saved.getId());
        response.setText(saved.getText());
        response.setAuthorUsername(author.getUsername());
        response.setAuthorId(author.getId());
        response.setTaskId(saved.getTask().getId());
        response.setCreatedAt(saved.getCreatedAt());

        return response;
    }

    public List<CommentDto> getAllComments(Long taskId, User currentUser) {

        if (!taskRepository.existsById(taskId)) {
            throw new EntityNotFoundException("Задача не найдена");
        }
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Задача не найдена"));

        Project project = task.getProject();
        if (currentUser.getRole() != Role.ADMIN && !isProjectOwner(project, currentUser) && !isProjectMember(project, currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нет доступа к комментариям");
        }

        List<Comment> comments = commentRepository.findByTaskId(taskId);

        return comments.stream().map(c -> {
            CommentDto dto = new CommentDto();
            dto.setId(c.getId());
            dto.setText(c.getText());
            dto.setAuthorUsername(c.getAuthor().getUsername());
            dto.setAuthorId(c.getAuthor().getId());
            dto.setTaskId(c.getTask().getId());
            dto.setCreatedAt(c.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public CommentDto updateComment(Long commentId, CommentDto dto, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Комментарий не найден"));

        if (!comment.getAuthor().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Вы не можете редактировать чужой комментарий");
        }

        comment.setText(dto.getText());
        Comment saved = commentRepository.save(comment);

        CommentDto response = new CommentDto();
        response.setId(saved.getId());
        response.setText(saved.getText());
        response.setAuthorUsername(saved.getAuthor().getUsername());
        response.setAuthorId(saved.getAuthor().getId());
        response.setTaskId(saved.getTask().getId());
        response.setCreatedAt(saved.getCreatedAt());

        return response;
    }

    @Transactional
    public void deleteComment(Long commentId, User currentUser) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Комментарий не найден"));

        boolean isAuthor = comment.getAuthor().getId().equals(currentUser.getId());
        boolean isProjectOwner = isProjectOwner(comment.getTask().getProject(), currentUser);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isAuthor && !isProjectOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Вы не можете удалить чужой комментарий");
        }

        commentRepository.delete(comment);
    }

    private boolean isProjectMember(Project project, User user) {
        return project.getMembers().stream()
                .anyMatch(m -> m.getId().equals(user.getId()));
    }

    private boolean isProjectOwner(Project project, User user) {
        return project.getOwner() != null && project.getOwner().getId().equals(user.getId());
    }
}
