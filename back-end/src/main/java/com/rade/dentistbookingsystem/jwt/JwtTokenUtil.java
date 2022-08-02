package com.rade.dentistbookingsystem.jwt;


import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.AccountDetail;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenUtil {

    private static final long EXPIRE_DURATION = 60 * 60 * 1000 * 24;
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtTokenUtil.class);

    public String generateAccessToken(AccountDetail user) {
        return Jwts.builder()
                .setSubject(String.format("%s,%s", user.getUsername(), user.getPassword()))
                .claim("role", user.getAuthorities().stream().iterator().next().toString())
                .setIssuer("CodeJava")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION))
                .signWith(SignatureAlgorithm.HS512, Constant.SECRET_KEY)
                .compact();

    }

    public boolean validateAccessToken(String token) {
        try {
            Jwts.parser().setSigningKey(Constant.SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            LOGGER.error("JWT expired", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            LOGGER.error("Token is null, empty or only whitespace", ex.getMessage());
        } catch (MalformedJwtException ex) {
            LOGGER.error("JWT is invalid", ex);
        } catch (UnsupportedJwtException ex) {
            LOGGER.error("JWT is not supported", ex);
        } catch (SignatureException ex) {
            LOGGER.error("Signature validation failed");
        }

        return false;
    }

    public String getSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .setSigningKey(Constant.SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
