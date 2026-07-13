package com.civicscore.dto;

public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private String citizenId;

    public LoginResponse(String accessToken, String refreshToken, String citizenId) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.citizenId = citizenId;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getCitizenId() {
        return citizenId;
    }
}
