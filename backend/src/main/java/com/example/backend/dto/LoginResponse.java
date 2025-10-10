package com.example.backend.dto;

import com.example.backend.entity.User;

public class LoginResponse {
    private String status;
    private User user;

    public LoginResponse(String status, User user) {
        this.status = status;
        this.user = user;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
