package modules.service;

import modules.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAll();

    User findById(String id);
}
