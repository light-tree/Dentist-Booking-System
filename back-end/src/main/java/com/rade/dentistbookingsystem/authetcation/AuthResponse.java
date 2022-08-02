package com.rade.dentistbookingsystem.authetcation;

public class AuthResponse {
    private String phone;
    private String accessToken;

    private String roleName;

    public AuthResponse() {
    }

    public AuthResponse(String phone, String accessToken, String roleName) {
        this.phone = phone;
        this.accessToken = accessToken;
        this.roleName = roleName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
