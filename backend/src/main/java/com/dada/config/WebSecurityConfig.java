package com.dada.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			// 아래의 corsConfigurationSource 사용
			.cors().and()
			// rest api 이므로 기본설정 사용안함. 기본설정은 비인증시 로그인폼 화면으로 리다이렉트 된다.
			.httpBasic().disable()
			// rest api이므로 csrf 보안은 필요 없음
			.csrf().disable()
			// form 기반 로그인 비활성화
			.formLogin().disable()
			// jwt token으로 인증하므로 세션은 필요 없음
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			.and()
			.authorizeRequests() // 다음 리퀘스트에 대한 사용권한 체크
			.antMatchers("/users/login").permitAll() // 가입 및 인증 주소는 누구나 접근가능
			.anyRequest().authenticated() // 그외 나머지 요청은 모두 인증된 회원만 접근 가능
		;
	}

	// 참고 : https://stackoverflow.com/a/43559288/14211919
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		final CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Collections.singletonList("*"));
		configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE"));

		// setAllowCredentials(true) is important, otherwise:
		// The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*'
		// when the request's credentials mode is 'include'.
		configuration.setAllowCredentials(true);

		// setAllowedHeaders is important!
		// Without it, OPTIONS preflight request will fail with 403 Invalid CORS request
		configuration.setAllowedHeaders(Arrays.asList("X-AUTH-TOKEN", "Cache-Control", "Content-Type"));

		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
