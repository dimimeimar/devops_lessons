package gr.hua.ds.appointments.controller;

import gr.hua.ds.appointments.dto.LoginRequest;
import gr.hua.ds.appointments.entity.User;
import gr.hua.ds.appointments.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        try {
            User user = userService.findByUsername(loginRequest.getUsername());

            if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("username", user.getUsername());
                responseBody.put("email", user.getEmail());
                responseBody.put("role", user.getRole());
                responseBody.put("message", "Login successful");

                HttpSession session = request.getSession(true);
                session.setAttribute("USER_ID", user.getId());
                session.setAttribute("USER_ROLE", user.getRole());

                return ResponseEntity.ok().body(responseBody);
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error during login"));
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(HttpSession session) {
        String userRole = (String) session.getAttribute("USER_ROLE");
        if (!"ROLE_ADMIN".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id, HttpSession session) {
        String userRole = (String) session.getAttribute("USER_ROLE");
        if (!"ROLE_ADMIN".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (userService.existsByUsername(user.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Username already exists"));
            }

            if (userService.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email already exists"));
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("ROLE_PATIENT");
            }

            User savedUser = userService.register(user);
            return ResponseEntity.ok().body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error during registration"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user, HttpSession session) {
        String userRole = (String) session.getAttribute("USER_ROLE");
        if (!"ROLE_ADMIN".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            User existingUser = userService.findById(id);
            user.setId(id);

            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            User updatedUser = userService.save(user);
            return ResponseEntity.ok().body(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating user"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpSession session) {
        String userRole = (String) session.getAttribute("USER_ROLE");
        if (!"ROLE_ADMIN".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            userService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting user"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        return ResponseEntity.ok().body(Map.of("message", "Logged out successfully"));
    }
}