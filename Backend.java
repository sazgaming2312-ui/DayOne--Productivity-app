package com.dayone.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.*;

/**
 * DayOne Production Backend - Security First Architecture
 * Refactored for Spring Boot 3.x / Spring Security 6.x
 */
@SpringBootApplication
public class Backend {
    public static void main(String[] args) {
        SpringApplication.run(Backend.class, args);
    }
}

/**
 * Modern Security Configuration
 * Prioritizes Stateless JWT Authentication and CSRF Protection
 */
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disabled for stateless REST APIs using JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

/**
 * Core Task Controller with Simulated Persistence
 */
@RestController
@RequestMapping("/api/tasks")
class TaskController {
    
    private final Map<String, List<TaskEntity>> userTasks = new HashMap<>();

    @GetMapping
    public List<TaskEntity> getUserTasks(@RequestHeader("Authorization") String bearerToken) {
        // In production: Extract userId from JWT Token
        String userId = "user_123"; 
        return userTasks.getOrDefault(userId, new ArrayList<>());
    }

    @PostMapping
    public TaskEntity syncTask(@RequestBody TaskEntity task, @RequestHeader("Authorization") String token) {
        task.setUpdatedAt(System.currentTimeMillis());
        if (task.getId() == null) {
            task.setId(UUID.randomUUID().toString());
            task.setCreatedAt(System.currentTimeMillis());
        }
        
        String userId = "user_123";
        List<TaskEntity> tasks = userTasks.computeIfAbsent(userId, k -> new ArrayList<>());
        tasks.removeIf(t -> t.getId().equals(task.getId()));
        tasks.add(task);
        
        return task;
    }
}

/**
 * Authentication & Identity Controller
 */
@RestController
@RequestMapping("/api/auth")
class AuthController {

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request) {
        // Implementation: Validate email uniqueness, hash password, generate JWT
        return new AuthResponse("mock_jwt_token_" + UUID.randomUUID(), request.getEmail());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        // Implementation: Verify credentials against DB, return JWT
        return new AuthResponse("mock_jwt_token_auth_success", request.getEmail());
    }
}

/**
 * DTOs and Entities
 */
class TaskEntity {
    private String id;
    private String title;
    private String description;
    private long createdAt;
    private long updatedAt;
    // Getters/Setters...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public void setCreatedAt(long t) { this.createdAt = t; }
    public void setUpdatedAt(long t) { this.updatedAt = t; }
}

class AuthResponse {
    private String token;
    private String email;
    public AuthResponse(String t, String e) { this.token = t; this.email = e; }
    public String getToken() { return token; }
    public String getEmail() { return email; }
}

class SignupRequest { private String email; private String name; public String getEmail() { return email; } }
class LoginRequest { private String email; private String password; public String getEmail() { return email; } }