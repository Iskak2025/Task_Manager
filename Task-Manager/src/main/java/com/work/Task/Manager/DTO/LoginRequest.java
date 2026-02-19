package com.work.Task.Manager.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank
    private String username;


    @Size(min = 8, message = "Пароль должен содержать минимум 8 символов")
    private String password;

    public @NotBlank String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank String username) {
        this.username = username;
    }

    public @Size(min = 8, message = "Пароль должен содержать минимум 8 символов") String getPassword() {
        return password;
    }

    public void setPassword(@Size(min = 8, message = "Пароль должен содержать минимум 8 символов") String password) {
        this.password = password;
    }
}
