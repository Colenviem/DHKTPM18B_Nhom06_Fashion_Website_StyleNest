package modules.config;

import modules.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/api/accounts/login") ||
                requestURI.startsWith("/api/accounts") ||
                requestURI.startsWith("/api/accounts/verify") ||
                requestURI.startsWith("/api/accounts/forgot-password") ||
                requestURI.startsWith("/api/accounts/reset-password")) {
            chain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;
        String userId = null;
        String role = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(jwt);
                userId = jwtUtil.extractUserId(jwt);
                role = jwtUtil.extractRole(jwt);
                logger.debug("Extracted email: {}, userId: {}, role: {}", email, userId, role);
            } catch (Exception e) {
                logger.error("Error extracting from token: {}", e.getMessage());
                chain.doFilter(request, response);
                return;
            }
        } else {
            logger.warn("No Authorization header or invalid format: {}", authorizationHeader);
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(jwt, email)) {
                    UserDetails userDetails = new CustomUserDetails(email, userId, role);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Authenticated user: {} with role: {}, userId: {}", email, role, userId);
                } else {
                    logger.warn("Token validation failed for email: {}", email);
                }
            } catch (Exception e) {
                logger.error("Error validating token: {}", e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}

class CustomUserDetails implements UserDetails {
    private final String email;
    private final String userId;
    private final String role;

    public CustomUserDetails(String email, String userId, String role) {
        this.email = email;
        this.userId = userId;
        this.role = role;
    }

    public String getUserId() {
        return userId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}