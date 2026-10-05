package com.recruitment.hub.observability.repository;

import com.recruitment.hub.observability.entity.AgentTraceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentTraceLogRepository extends JpaRepository<AgentTraceLog, Long> {
    List<AgentTraceLog> findByTraceId(String traceId);
    List<AgentTraceLog> findByAgentName(String agentName);
}
