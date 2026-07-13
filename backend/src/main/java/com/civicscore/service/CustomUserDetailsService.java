package com.civicscore.service;

import com.civicscore.entity.Citizen;
import com.civicscore.repository.CitizenRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CitizenRepository citizenRepository;

    public CustomUserDetailsService(CitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Citizen citizen = citizenRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new User(
                citizen.getUsername(),
                citizen.getPassword(),
                Collections.singletonList(() -> "ROLE_" + citizen.getRole().name()));
    }
}
