package com.work.Task.Manager.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @Size(min = 8, message = "Пароль должен содержать минимум 8 символов")
    @NotBlank(message = "Пароль не может быть пустым")
    private String password;

    @NotBlank(message = "Имя не может быть пустым")
    private String username;

    @Email(message = "Электронная почта должна быть корректной")
    @NotBlank(message = "Электронная почта не может быть пустой")
    private String email;


    private String adminCode;

    public @Size(min = 8, message = "Пароль должен содержать минимум 8 символов")
    @NotBlank(message = "Пароль не может быть пустым") String getPassword() {
        return password;
    }

    public void setPassword(@Size(min = 8, message = "Пароль должен содержать минимум 8 символов")
                            @NotBlank(message = "Пароль не может быть пустым") String password) {
        this.password = password;
    }

    public @NotBlank(message = "Имя не может быть пустым") String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "Имя не может быть пустым") String username) {
        this.username = username;
    }

    public @Email(message = "Электронная почта должна быть корректной")
    @NotBlank(message = "Электронная почта не может быть пустой") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Электронная почта должна быть корректной")
                         @NotBlank(message = "Электронная почта не может быть пустой") String email) {
        this.email = email;
    }

    public String getAdminCode() {
        return adminCode;
    }

    public void setAdminCode(String adminCode) {
        this.adminCode = adminCode;
    }
}
