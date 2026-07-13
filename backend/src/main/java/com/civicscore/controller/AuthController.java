package com.civicscore.controller;

import com.civicscore.dto.LoginRequest;
import com.civicscore.dto.LoginResponse;
import com.civicscore.dto.RegisterRequest;
import com.civicscore.entity.Citizen;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.security.JwtUtil;
import com.civicscore.service.CitizenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final CitizenRepository citizenRepository;
        private final CitizenService citizenService;

        public AuthController(AuthenticationManager authenticationManager,
                        CitizenRepository citizenRepository,
                        CitizenService citizenService) {
                this.authenticationManager = authenticationManager;
                this.citizenRepository = citizenRepository;
                this.citizenService = citizenService;
        }

        @PostMapping("/register")
        public Citizen register(@RequestBody RegisterRequest request) {
                return citizenService.createCitizen(request.getName(), request.getEmail(), request.getPassword());
        }

        @PostMapping("/login")
        public LoginResponse login(@RequestBody LoginRequest request) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                String role = authentication.getAuthorities()
                                .iterator()
                                .next()
                                .getAuthority()
                                .replace("ROLE_", "");

                String accessToken = JwtUtil.generateAccessToken(
                                request.getUsername(), role);

                String refreshToken = JwtUtil.generateRefreshToken(
                                request.getUsername());

                String citizenId = null;
                if ("CITIZEN".equals(role)) {
                        citizenId = citizenRepository.findByUsername(request.getUsername())
                                        .map(c -> c.getCitizenId().toString())
                                        .orElse(null);
                }

                return new LoginResponse(accessToken, refreshToken, citizenId);
        }
}
