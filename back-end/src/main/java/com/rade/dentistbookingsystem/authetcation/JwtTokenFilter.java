package com.rade.dentistbookingsystem.authetcation;

import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.domain.AccountDetail;
import com.rade.dentistbookingsystem.domain.Role;
import com.rade.dentistbookingsystem.jwt.JwtTokenUtil;
import com.rade.dentistbookingsystem.services.AccountService;
import com.rade.dentistbookingsystem.services.impl.AccountServiceImpl;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtUtil;




    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!hasAuthorizationBearer(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = getAccessToken(request);

        if (!jwtUtil.validateAccessToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        setAuthenticationContext(token, request);
        filterChain.doFilter(request, response);
    }

    private boolean hasAuthorizationBearer(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (ObjectUtils.isEmpty(header) || !header.startsWith("Bearer")) {
            return false;
        }

        return true;
    }

    private String getAccessToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = header.split(" ")[1].trim();
        return token;
    }


    private void setAuthenticationContext(String token, HttpServletRequest request) {
        UserDetails userDetails = getUserDetails(token);

        UsernamePasswordAuthenticationToken
                authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private UserDetails getUserDetails(String token) {
        Account account = new Account();

        Claims claims = jwtUtil.parseClaims(token);
        String claimRole = (String) claims.get("role");

        // vi json trả về có dạng collection nên sẽ replace toàn bộ dấu ngoặc thành blank
//        claimRole = claimRole.replace("[", "")
//               .replace("]","").replace("{","").replace("}","");
        Role role = new Role();
        role.setName(claimRole);
        account.setRole(role);
        AccountDetail accountDetail = new AccountDetail(account);
        //String subject = (String)claims.get(Claims.SUBJECT);
        String[] jwtSubject = jwtUtil.getSubject(token).split(",");

        account.setPhone(jwtSubject[0]);
        account.setPassword(jwtSubject[1]);
        System.out.println(account.getStatus());

        return accountDetail;
    }
}
