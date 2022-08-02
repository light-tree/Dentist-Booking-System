package com.rade.dentistbookingsystem.config;

import com.rade.dentistbookingsystem.authetcation.JwtTokenFilter;
import com.rade.dentistbookingsystem.services.impl.AccountDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletResponse;
import java.time.Duration;

@Configuration
@CrossOrigin
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        jsr250Enabled = true,
        prePostEnabled = true,
        securedEnabled = true
)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    JwtTokenFilter jwtTokenFilter;

    @Bean
    public UserDetailsService userDetailsService() {
        return new AccountDetailServiceImpl();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());


        return authProvider;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeRequests()
                .antMatchers("/rade/auth/login", "/rade/province",
                        "/rade/district/**").permitAll()
                .antMatchers(
                        "/rade/appointment",
                        "/rade/appointment/**",
                        "/rade/home",
                        "/rade/home/**",
                        "/rade/service/**",
                        "/rade/account/**",
                        "/rade/account",
                        "/rade/feedback",
                        "/rade/feedback/**",
                        "/rade/discount",
                        "/rade/discount/**").access("not( hasRole('ADMIN') ) and not( hasRole('STAFF') )")
                .antMatchers("/rade/admin/**").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/rade/patient/**").hasAuthority("ROLE_USER").
                antMatchers("/rade/staff/**").hasAuthority("ROLE_STAFF")
                .anyRequest().authenticated();
        http.exceptionHandling()
                .authenticationEntryPoint(
                        (request, response, ex) -> {
                            response.sendError(
                                    HttpServletResponse.SC_UNAUTHORIZED,
                                    ex.getMessage()
                            );
                        }
                );

        http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
        http.cors();
    }

}
