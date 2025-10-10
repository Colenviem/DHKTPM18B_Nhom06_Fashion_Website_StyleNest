package com.example.backend;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // tắt CSRF (để frontend React có thể gọi API dễ hơn)
                .csrf(csrf -> csrf.disable())

                // cấu hình quyền truy cập
                .authorizeHttpRequests(auth -> auth
                        // cho phép truy cập không cần đăng nhập
                        .requestMatchers("/api/auth/**").permitAll()
                        // các request khác yêu cầu đăng nhập
                        .anyRequest().authenticated()
                )

                // tắt form login mặc định
                .formLogin(login -> login.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}

