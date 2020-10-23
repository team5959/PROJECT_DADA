package com.dada.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.dada.entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
}
