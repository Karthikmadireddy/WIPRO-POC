package com.recruitment.hub.observability.controller;

import com.recruitment.hub.kafka.KafkaService;
import com.recruitment.hub.observability.entity.AgentTraceLog;
import com.recruitment.hub.observability.service.ObservabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/observability")
@CrossOrigin(origins = "*")
public class ObservabilityController {

    @Autowired
    private ObservabilityService observabilityService;

    @GetMapping("/traces")
    public List<AgentTraceLog> getAllTraces() {
        return observabilityService.getAllTraces();
    }

    @GetMapping("/traces/{traceId}")
    public List<AgentTraceLog> getTraceById(@PathVariable String traceId) {
        return observabilityService.getTracesByTraceId(traceId);
    }

    @GetMapping("/metrics")
    public Map<String, Object> getMetrics() {
        return observabilityService.getSystemMetrics();
    }

    @GetMapping("/kafka-stream")
    public List<KafkaService.KafkaEventMessage> getKafkaStream() {
        return observabilityService.getKafkaStreamEvents();
    }
}
