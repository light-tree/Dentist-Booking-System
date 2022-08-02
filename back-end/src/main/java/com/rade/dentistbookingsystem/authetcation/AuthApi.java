package com.rade.dentistbookingsystem.authetcation;


import com.rade.dentistbookingsystem.domain.AccountDetail;
import com.rade.dentistbookingsystem.jwt.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@CrossOrigin
public class AuthApi {

    @Autowired
    AuthenticationManager authManager;
    @Autowired
    JwtTokenUtil jwtUtil;

    @PostMapping(value = "/rade/auth/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getPhone(), request.getPassword())
                    );
            AccountDetail account = (AccountDetail) authentication.getPrincipal();
            String accessToken = jwtUtil.generateAccessToken(account);
            AuthResponse response = new AuthResponse(account.getUsername(), accessToken, account.getRoleName());
            return ResponseEntity.ok().body(response);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
