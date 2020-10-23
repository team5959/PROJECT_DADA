package com.dada.service;

import org.springframework.stereotype.Service;

import com.dada.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
	final UserRepository userRepository;
}
