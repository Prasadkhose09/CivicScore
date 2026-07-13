package com.civicscore.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // 1️⃣ Skip JWT check for auth endpoints
        String path = httpRequest.getServletPath();
        if (path.startsWith("/auth")) {
            chain.doFilter(request, response);
            return;
        }

        // 2️⃣ Read Authorization header
        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                Claims claims = JwtUtil.validateToken(token);

                // 3️⃣ VERY IMPORTANT CHECK (Step 10.5)
                // Allow ONLY ACCESS tokens
                String tokenType = claims.get("type", String.class);
                if (!"ACCESS".equals(tokenType)) {
                    chain.doFilter(request, response);
                    return;
                }

                // 4️⃣ Extract role and set authentication
                String role = claims.get("role", String.class);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                claims.getSubject(),
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            } catch (Exception e) {
                // Invalid or expired token → ignore, let Spring handle 401
            }
        }

        // 5️⃣ Continue filter chain
        chain.doFilter(request, response);
    }
}

