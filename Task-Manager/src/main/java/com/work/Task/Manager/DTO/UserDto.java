package com.work.Task.Manager.DTO;

import com.work.Task.Manager.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserDto {

    @NotNull
    private Long id;

    @NotBlank
    private String username;

    @Size(min = 8, message = "Пароль должен быть состоять как минимум из 8 символов")
    @NotBlank
    private String password;

    @Email
    @NotBlank
    private String email;

    @NotNull
    private Role role;

    public @NotNull Long getId() {
        return id;
    }

    public void setId(@NotNull Long id) {
        this.id = id;
    }

    public @NotBlank String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank String username) {
        this.username = username;
    }

    public @Size(min = 8, message = "Пароль должен быть состоять как минимум из 8 символов") @NotBlank String getPassword() {
        return password;
    }

    public void setPassword(@Size(min = 8, message = "Пароль должен быть состоять как минимум из 8 символов") @NotBlank String password) {
        this.password = password;
    }

    public @Email @NotBlank String getEmail() {
        return email;
    }

    public void setEmail(@Email @NotBlank String email) {
        this.email = email;
    }

    public @NotBlank Role getRole() {
        return role;
    }

    public void setRole(@NotBlank Role role) {
        this.role = role;
    }
}
