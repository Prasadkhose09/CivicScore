package com.civicscore.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final Key key =
            Keys.hmacShaKeyFor("civicscore-secret-key-should-be-long".getBytes());

    // ⏱️ Short-lived access token
    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // 15 min

    // ⏱️ Long-lived refresh token
    private static final long REFRESH_TOKEN_EXPIRATION =
            1000L * 60 * 60 * 24 * 7; // 7 days

    public static String generateAccessToken(String username, String role) {

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("type", "ACCESS")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String generateRefreshToken(String username) {

        return Jwts.builder()
                .setSubject(username)
                .claim("type", "REFRESH")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public static Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
