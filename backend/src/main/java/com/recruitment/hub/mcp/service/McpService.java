package com.recruitment.hub.mcp.service;

import com.recruitment.hub.kafka.KafkaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class McpService {

    @Autowired
    private KafkaService kafkaService;

    public List<Map<String, Object>> getMcpServersStatus() {
        List<Map<String, Object>> servers = new ArrayList<>();

        servers.add(createMcpServerInfo(
            "ats-mcp-server",
            "ATS MCP Server",
            "v1.4.2",
            "CONNECTED",
            "Synchronizes candidate records, updates application stage, and fetches external funnel stats.",
            Arrays.asList("ats_sync_candidate", "ats_get_pipeline_stats", "ats_update_status")
        ));

        servers.add(createMcpServerInfo(
            "linkedin-mcp-server",
            "LinkedIn MCP Server",
            "v2.1.0",
            "CONNECTED",
            "Queries external profile details, verifies work experience, and triggers InMail candidate outreach.",
            Arrays.asList("linkedin_search_profile", "linkedin_verify_experience", "linkedin_send_inmail")
        ));

        servers.add(createMcpServerInfo(
            "outlook-mcp-server",
            "Outlook MCP Server",
            "v1.0.8",
            "CONNECTED",
            "Dispatches candidate invitation emails, sends offer letters, and syncs email threads.",
            Arrays.asList("outlook_send_email", "outlook_fetch_thread", "outlook_send_offer_letter")
        ));

        servers.add(createMcpServerInfo(
            "teams-mcp-server",
            "Teams MCP Server",
            "v2.0.4",
            "CONNECTED",
            "Posts real-time interview notifications and candidate feedback cards to Microsoft Teams channels.",
            Arrays.asList("teams_post_channel_message", "teams_send_adaptive_card", "teams_notify_interviewer")
        ));

        servers.add(createMcpServerInfo(
            "calendar-mcp-server",
            "Calendar Integration MCP",
            "v1.3.1",
            "CONNECTED",
            "Checks interviewer free/busy slots across Outlook & Google Calendar and creates meeting invites.",
            Arrays.asList("calendar_get_free_slots", "calendar_create_invite", "calendar_reschedule")
        ));

        return servers;
    }

    public Map<String, Object> executeMcpTool(String serverId, String toolName, Map<String, Object> parameters) {
        String executionId = "MCP-EXEC-" + UUID.randomUUID().toString().substring(0, 8);
        Map<String, Object> response = new HashMap<>();
        response.put("executionId", executionId);
        response.put("serverId", serverId);
        response.put("toolName", toolName);
        response.put("executedAt", LocalDateTime.now().toString());
        response.put("protocolVersion", "2024-11-05 (MCP Standard)");

        Map<String, Object> payloadResult = new HashMap<>();

        switch (toolName) {
            case "ats_sync_candidate":
                payloadResult.put("atsCandidateId", "ATS-88492");
                payloadResult.put("syncedStage", "INTERVIEW_STAGE");
                payloadResult.put("status", "SUCCESS");
                break;
            case "linkedin_search_profile":
                payloadResult.put("linkedinProfileUrl", "https://linkedin.com/in/sample-candidate");
                payloadResult.put("verifiedCompany", "Tech Corp Global");
                payloadResult.put("connectionsCount", "500+");
                payloadResult.put("status", "VERIFIED");
                break;
            case "outlook_send_email":
                payloadResult.put("messageId", "<msg-" + UUID.randomUUID().toString() + "@outlook.com>");
                payloadResult.put("deliveryStatus", "DELIVERED_TO_INBOX");
                payloadResult.put("recipient", parameters.getOrDefault("email", "candidate@example.com"));
                break;
            case "teams_post_channel_message":
                payloadResult.put("channelId", "19:recruitment-hiring-channel@thread.tacv2");
                payloadResult.put("adaptiveCardPosted", true);
                payloadResult.put("status", "NOTIFIED");
                break;
            case "calendar_get_free_slots":
                payloadResult.put("availableSlots", Arrays.asList("2026-10-08 14:00 EST", "2026-10-08 16:30 EST", "2026-10-09 11:00 EST"));
                payloadResult.put("conflictFound", false);
                break;
            default:
                payloadResult.put("status", "EXECUTED");
                payloadResult.put("info", "Executed " + toolName + " via JSON-RPC 2.0 protocol");
        }

        response.put("result", payloadResult);

        // Publish to Kafka stream
        kafkaService.publishEvent("recruitment.mcp.events", "MCP_TOOL_EXECUTED", 
            "{\"serverId\":\"" + serverId + "\",\"toolName\":\"" + toolName + "\",\"executionId\":\"" + executionId + "\"}");

        return response;
    }

    private Map<String, Object> createMcpServerInfo(String id, String name, String version, String status, String desc, List<String> tools) {
        Map<String, Object> server = new HashMap<>();
        server.put("id", id);
        server.put("name", name);
        server.put("version", version);
        server.put("status", status);
        server.put("description", desc);
        server.put("tools", tools);
        server.put("lastHeartbeat", LocalDateTime.now().toString());
        return server;
    }
}
