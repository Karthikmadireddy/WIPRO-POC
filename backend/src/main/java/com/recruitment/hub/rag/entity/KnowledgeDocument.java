package com.recruitment.hub.rag.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "knowledge_documents")
public class KnowledgeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String docCategory; // JOB_DESCRIPTION, POLICY_GUIDELINE, INTERVIEW_QUESTION_REPOSITORY
    private String title;
    private String targetRole; // e.g. All Roles, Backend Engineer, Product Manager
    
    @Column(length = 20000)
    private String content;

    private String keywords;
    private LocalDateTime createdAt;

    public KnowledgeDocument() {}

    public KnowledgeDocument(String docCategory, String title, String targetRole, String content, String keywords) {
        this.docCategory = docCategory;
        this.title = title;
        this.targetRole = targetRole;
        this.content = content;
        this.keywords = keywords;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDocCategory() { return docCategory; }
    public void setDocCategory(String docCategory) { this.docCategory = docCategory; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
