package com.recruitment.hub.mcp.controller;

import com.recruitment.hub.mcp.service.McpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mcp")
@CrossOrigin(origins = "*")
public class McpController {

    @Autowired
    private McpService mcpService;

    @GetMapping("/servers")
    public List<Map<String, Object>> getMcpServers() {
        return mcpService.getMcpServersStatus();
    }

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeTool(@RequestBody Map<String, Object> request) {
        String serverId = (String) request.get("serverId");
        String toolName = (String) request.get("toolName");
        @SuppressWarnings("unchecked")
        Map<String, Object> params = (Map<String, Object>) request.get("parameters");

        if (serverId == null || toolName == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "serverId and toolName parameters are required"));
        }

        if (params == null) params = Map.of();

        Map<String, Object> result = mcpService.executeMcpTool(serverId, toolName, params);
        return ResponseEntity.ok(result);
    }
}
