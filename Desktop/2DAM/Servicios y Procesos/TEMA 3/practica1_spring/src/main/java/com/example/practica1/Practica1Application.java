package com.example.practica1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;


@SpringBootApplication(scanBasePackages = {"com.example.practica1.config",
		"com.example.practica1.controller",
		"com.example.practica1.models",
		"com.example.practica1.services",
})
@EnableMongoRepositories(basePackages = "com.example.practica1.repositories")

public class Practica1Application {
	public static void main(String[] args) {
		SpringApplication.run(Practica1Application.class, args);
	}
}
