package com.recruitment.hub.job.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_requisitions")
public class JobRequisition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobCode;
    private String title;
    private String department;
    private String location;
    private String experienceLevel; // e.g. Senior (5-8 yrs)
    private String salaryRange;
    private String requiredSkills;
    private String status; // OPEN, IN_PROGRESS, FILLED, DRAFT
    private Integer openPositions;

    @Column(length = 20000)
    private String description;

    @Column(length = 10000)
    private String keyResponsibilities;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JobRequisition() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = "OPEN";
        if (this.openPositions == null) this.openPositions = 1;
        if (this.jobCode == null) this.jobCode = "REQ-" + (100 + (int)(Math.random() * 900));
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJobCode() { return jobCode; }
    public void setJobCode(String jobCode) { this.jobCode = jobCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getOpenPositions() { return openPositions; }
    public void setOpenPositions(Integer openPositions) { this.openPositions = openPositions; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getKeyResponsibilities() { return keyResponsibilities; }
    public void setKeyResponsibilities(String keyResponsibilities) { this.keyResponsibilities = keyResponsibilities; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
