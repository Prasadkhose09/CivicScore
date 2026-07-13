package com.civicscore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.civicscore")
public class CivicscoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(CivicscoreApplication.class, args);
	}

}
