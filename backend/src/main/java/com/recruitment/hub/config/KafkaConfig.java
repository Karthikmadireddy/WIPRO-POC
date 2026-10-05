package com.recruitment.hub.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {

    public static final String TOPIC_CANDIDATE_EVENTS = "recruitment.candidate.events";
    public static final String TOPIC_JOB_EVENTS = "recruitment.job.events";
    public static final String TOPIC_AGENT_TRACES = "recruitment.agent.traces";
    public static final String TOPIC_MCP_EVENTS = "recruitment.mcp.events";

    // Kafka topics will be created externally by Kafka admin commands or docker-compose
    // so Spring Boot context startup won't block if Kafka broker is temporarily offline.
}
