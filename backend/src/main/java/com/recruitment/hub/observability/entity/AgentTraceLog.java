package com.recruitment.hub.observability.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agent_trace_logs")
public class AgentTraceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String traceId;
    private String agentName; // ScreeningAgent, EvaluationAgent, InterviewAgent, HiringRecommendationAgent
    private String candidateName;
    private String jobTitle;
    private String actionType; // TOOL_CALL, REASONING, MATCH_SCORING, QUESTION_GENERATION, FINAL_DECISION
    
    @Column(length = 10000)
    private String promptOrInput;
    
    @Column(length = 20000)
    private String reasoningOutput;

    private String toolUsed; // parseResumeTool, scoreCandidateMatchTool, riskAnalyzerTool, scheduleInterviewTool
    private Integer confidenceScore; // 0-100%
    private Long executionTimeMs;
    private Integer tokensUsed;

    private LocalDateTime createdAt;

    public AgentTraceLog() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.confidenceScore == null) this.confidenceScore = 90;
        if (this.executionTimeMs == null) this.executionTimeMs = (long)(200 + Math.random() * 400);
        if (this.tokensUsed == null) this.tokensUsed = (int)(300 + Math.random() * 800);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTraceId() { return traceId; }
    public void setTraceId(String traceId) { this.traceId = traceId; }

    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getPromptOrInput() { return promptOrInput; }
    public void setPromptOrInput(String promptOrInput) { this.promptOrInput = promptOrInput; }

    public String getReasoningOutput() { return reasoningOutput; }
    public void setReasoningOutput(String reasoningOutput) { this.reasoningOutput = reasoningOutput; }

    public String getToolUsed() { return toolUsed; }
    public void setToolUsed(String toolUsed) { this.toolUsed = toolUsed; }

    public Integer getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }

    public Long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public Integer getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(Integer tokensUsed) { this.tokensUsed = tokensUsed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
