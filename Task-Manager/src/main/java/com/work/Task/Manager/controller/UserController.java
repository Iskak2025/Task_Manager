package com.work.Task.Manager.controller;

import com.work.Task.Manager.entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.work.Task.Manager.DTO.UserResponseDto;
import com.work.Task.Manager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public UserResponseDto getCurrentUser(@AuthenticationPrincipal User user){
        return new UserResponseDto(user);
    }

    @GetMapping("/get_all")
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(UserResponseDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserResponseDto getUserById(@PathVariable Long id) {
        return new UserResponseDto(userService.getUserById(id));
    }
}
