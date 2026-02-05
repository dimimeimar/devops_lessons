package gr.hua.ds.appointments.service;

import gr.hua.ds.appointments.entity.User;

import java.util.List;

public interface UserService {
    User register(User user);
    User save(User user);
    User findByUsername(String username);
    User findByEmail(String email);
    User findById(Long id);
    List<User> findAll();
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    void deleteById(Long id);
}