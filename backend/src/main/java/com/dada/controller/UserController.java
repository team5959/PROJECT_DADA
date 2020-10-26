package com.dada.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dada.service.UserService;

import lombok.AllArgsConstructor;

@RequestMapping("users")
@RestController
@AllArgsConstructor
public class UserController {
	final UserService userService;
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@PostMapping(value = "login")
	ResponseEntity<?> login() { // TODO Add RequestBody (Kakao Login Token)
		logger.debug(String.format("login 호출 {Token : %s}"));
		// TODO Call userService.login
		return new ResponseEntity<>(HttpStatus.OK); // TODO Return jwt token
	}
}
