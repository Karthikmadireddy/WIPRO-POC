package com.recruitment.hub.agent.controller;

import com.recruitment.hub.agent.service.MultiAgentOrchestratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "*")
public class AgentController {

    @Autowired
    private MultiAgentOrchestratorService agentOrchestratorService;

    @PostMapping("/natural-search")
    public ResponseEntity<Map<String, Object>> searchTalent(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Query string is required"));
        }
        return ResponseEntity.ok(agentOrchestratorService.naturalLanguageTalentSearch(query));
    }

    @PostMapping("/execute-pipeline")
    public ResponseEntity<Map<String, Object>> executePipeline(@RequestBody Map<String, Long> request) {
        Long candidateId = request.get("candidateId");
        Long jobId = request.get("jobId");

        if (candidateId == null || jobId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "candidateId and jobId are required"));
        }

        Map<String, Object> response = agentOrchestratorService.executeFullMultiAgentPipeline(candidateId, jobId);
        return ResponseEntity.ok(response);
    }
}
