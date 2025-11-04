package modules.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.entity.Account;
import modules.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /** Những API không cần token */
    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/accounts/login",
            "/api/accounts/register",
            "/api/accounts/verify",
            "/api/accounts/forgot-password",
            "/api/accounts/reset-password"
    };

    private boolean isPublic(String uri) {
        for (String path : PUBLIC_ENDPOINTS) {
            if (uri.startsWith(path)) return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        if (isPublic(uri)) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            String email = jwtUtil.extractEmail(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                if (!jwtUtil.validateToken(token, email)) {
                    logger.warn("Token invalid for {}", email);
                    chain.doFilter(request, response);
                    return;
                }

                Account userDetails = jwtUtil.extractAccount(token);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);

                logger.info("Authenticated: {} (role: {})", email, userDetails.getRole());
            }

        } catch (Exception e) {
            logger.error("JWT Auth error: {}", e.getMessage());
        }

        chain.doFilter(request, response);
    }
}