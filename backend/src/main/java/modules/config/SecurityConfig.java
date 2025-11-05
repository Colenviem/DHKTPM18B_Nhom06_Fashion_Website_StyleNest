package modules.config;

import modules.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired; // <-- THÊM IMPORT NÀY
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // <-- THÊM IMPORT NÀY
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; // <-- THÊM IMPORT NÀY
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // <-- THÊM IMPORT NÀY
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // <--- Dòng này kích hoạt @PreAuthorize
public class SecurityConfig {

    // --- PHẦN NÀY THÊM VÀO ---
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired // Tự động tiêm JwtAuthenticationFilter đã tạo ở file kia
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
    // --- KẾT THÚC PHẦN THÊM ---


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authProvider(AccountService accountService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(accountService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // (Giữ nguyên, không đổi)
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider authProvider) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authenticationProvider(authProvider)

                // --- PHẦN QUAN TRỌNG NHẤT BỊ THIẾU ---
                // Thêm bộ lọc JWT vào TRƯỚC bộ lọc UsernamePassword
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Báo cho Spring Security không tạo session (vì ta dùng token)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // --- KẾT THÚC PHẦN THÊM ---

                .authorizeHttpRequests(authz -> authz
                        // Cho phép các API đăng nhập, đăng ký, quên mật khẩu...
                        .requestMatchers(
                                "/api/accounts/login",
                                "/api/accounts/verify",
                                "/api/accounts/forgot-password",
                                "/api/accounts/reset-password",
                                "/api/accounts" // Cho phép POST để tạo tài khoản
                        ).permitAll()

                        // Cho phép xem sản phẩm, thương hiệu... (API public)
                        .requestMatchers(HttpMethod.GET,
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/brands/**"
                        ).permitAll()

                        // Tất cả các request khác đều phải được xác thực
                        .anyRequest().authenticated()
                )

                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .logout(logout -> logout.disable());

        return http.build();
    }
}