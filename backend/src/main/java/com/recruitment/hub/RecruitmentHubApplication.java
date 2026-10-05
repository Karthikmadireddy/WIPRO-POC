package com.recruitment.hub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RecruitmentHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecruitmentHubApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("🚀 AI-Powered Recruitment Intelligence Hub Backend Started!");
        System.out.println("👉 API Base URL: http://localhost:8080/api");
        System.out.println("👉 H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("=======================================================\n");
    }
}
