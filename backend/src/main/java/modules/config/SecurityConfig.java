package modules.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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
                        .requestMatchers("/api/auth/**", "/api/users/register").permitAll()
                        // các request khác yêu cầu đăng nhập
                        .anyRequest().authenticated()
                )

                // tắt form login mặc định
                .formLogin(login -> login.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        //.allowedOrigins("http://localhost:5173") // ✅ chỉ định origin cụ thể
                        .allowedOriginPatterns("http://localhost:5173") // dùng patterns cho linh hoạt
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowCredentials(true)
                        .allowedHeaders("*");
            }
        };
    }
}

