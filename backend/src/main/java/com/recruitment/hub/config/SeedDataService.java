package com.recruitment.hub.config;

import com.recruitment.hub.candidate.entity.Candidate;
import com.recruitment.hub.candidate.repository.CandidateRepository;
import com.recruitment.hub.job.entity.JobRequisition;
import com.recruitment.hub.job.repository.JobRequisitionRepository;
import com.recruitment.hub.interview.entity.Interview;
import com.recruitment.hub.interview.repository.InterviewRepository;
import com.recruitment.hub.rag.entity.KnowledgeDocument;
import com.recruitment.hub.rag.repository.KnowledgeDocumentRepository;
import com.recruitment.hub.observability.entity.AgentTraceLog;
import com.recruitment.hub.observability.repository.AgentTraceLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SeedDataService implements CommandLineRunner {

    @Autowired private CandidateRepository candidateRepository;
    @Autowired private JobRequisitionRepository jobRepository;
    @Autowired private InterviewRepository interviewRepository;
    @Autowired private KnowledgeDocumentRepository knowledgeRepository;
    @Autowired private AgentTraceLogRepository traceRepository;

    @Override
    public void run(String... args) throws Exception {
        if (jobRepository.count() == 0) {
            seedJobRequisitions();
        }
        if (candidateRepository.count() == 0) {
            seedCandidates();
        }
        if (interviewRepository.count() == 0) {
            seedInterviews();
        }
        if (knowledgeRepository.count() == 0) {
            seedKnowledgeBase();
        }
        if (traceRepository.count() == 0) {
            seedAgentTraces();
        }
    }

    private void seedJobRequisitions() {
        JobRequisition job1 = new JobRequisition();
        job1.setJobCode("REQ-101");
        job1.setTitle("Senior Full Stack Java & React Engineer");
        job1.setDepartment("Engineering - Core Platform");
        job1.setLocation("Remote / Hybrid (New York)");
        job1.setExperienceLevel("Senior (6+ Years)");
        job1.setSalaryRange("$140,000 - $175,000 USD");
        job1.setRequiredSkills("Java 17, Spring Boot, Microservices, React, Kafka, PostgreSQL, Docker");
        job1.setStatus("OPEN");
        job1.setOpenPositions(3);
        job1.setDescription("We are seeking an exceptional Senior Full Stack Engineer to lead the modernization of our distributed recruitment and talent management platform. You will build high-throughput microservices in Spring Boot and modern frontend applications in React.");
        job1.setKeyResponsibilities("Architect microservices backend with Spring Cloud and Kafka event streaming; Develop responsive React micro-frontends; Ensure 99.99% system availability and high performance.");
        jobRepository.save(job1);

        JobRequisition job2 = new JobRequisition();
        job2.setJobCode("REQ-102");
        job2.setTitle("AI / ML Lead - Generative AI & RAG Specialist");
        job2.setDepartment("AI Innovation & Research");
        job2.setLocation("San Francisco, CA");
        job2.setExperienceLevel("Lead / Principal (8+ Years)");
        job2.setSalaryRange("$180,000 - $220,000 USD");
        job2.setRequiredSkills("Python, PyTorch, Gemini API, RAG Architectures, Vector DBs, LangChain, MCP");
        job2.setStatus("OPEN");
        job2.setOpenPositions(2);
        job2.setDescription("Lead our AI Agent research team in delivering next-gen autonomous LLM agents, vector RAG search pipelines, and Model Context Protocol (MCP) integrations for enterprise hiring intelligence.");
        job2.setKeyResponsibilities("Design multi-agent orchestration frameworks; Implement RAG pipelines using embeddings and Gemini API; Build enterprise MCP server connectors.");
        jobRepository.save(job2);

        JobRequisition job3 = new JobRequisition();
        job3.setJobCode("REQ-103");
        job3.setTitle("DevOps & Cloud Infrastructure Architect");
        job3.setDepartment("Cloud Operations");
        job3.setLocation("Austin, TX");
        job3.setExperienceLevel("Senior (5+ Years)");
        job3.setSalaryRange("$135,000 - $160,000 USD");
        job3.setRequiredSkills("Kubernetes, Terraform, Kafka Operations, AWS, CI/CD, Prometheus");
        job3.setStatus("IN_PROGRESS");
        job3.setOpenPositions(1);
        job3.setDescription("Responsible for managing zero-downtime deployment pipelines, Kafka cluster management, and AWS cloud security.");
        job3.setKeyResponsibilities("Deploy microservice infrastructure on EKS; Optimize Kafka cluster performance; Automate terraform infrastructure as code.");
        jobRepository.save(job3);
    }

    private void seedCandidates() {
        Candidate c1 = new Candidate();
        c1.setFullName("Sarah Jenkins");
        c1.setEmail("sarah.jenkins@example.com");
        c1.setPhone("+1 (555) 234-8901");
        c1.setTitle("Senior Full Stack Java Developer");
        c1.setYearsExperience(7);
        c1.setPrimarySkills("Java 17, Spring Boot, React, Kafka, Microservices, PostgreSQL");
        c1.setStatus("INTERVIEW_SCHEDULED");
        c1.setAiMatchScore(94);
        c1.setResumeSummary("7+ years building enterprise SaaS platforms using Spring Boot microservices, Kafka event-driven messaging, and modern React interfaces. Led team of 5 engineers at TechCorp.");
        c1.setFullResumeText("SARAH JENKINS\nSenior Java & React Engineer\nExperience: 7 Years\nSkills: Java 17, Spring Boot, Microservices, Kafka, React.js, Redux, PostgreSQL, Docker, Kubernetes.\n\nPROFESSIONAL SUMMARY:\nSeasoned engineer with extensive background in building resilient cloud-native applications. Designed event-driven architectures with Apache Kafka handling 2M+ daily requests. Built frontend portals in React with Tailwind CSS.");
        c1.setResumeFileName("Sarah_Jenkins_Resume.pdf");
        candidateRepository.save(c1);

        Candidate c2 = new Candidate();
        c2.setFullName("Alex Rivera");
        c2.setEmail("alex.rivera@example.com");
        c2.setPhone("+1 (555) 876-5432");
        c2.setTitle("AI Solutions Architect & LLM Engineer");
        c2.setYearsExperience(8);
        c2.setPrimarySkills("Python, Gemini API, RAG, LangChain, Vector Databases, Spring Boot, MCP");
        c2.setStatus("EVALUATED");
        c2.setAiMatchScore(97);
        c2.setResumeSummary("AI Architect specializing in Generative AI, RAG knowledge graph retrieval, autonomous agent tooling, and Model Context Protocol (MCP) server design.");
        c2.setFullResumeText("ALEX RIVERA\nAI Solutions Architect\nExperience: 8 Years\nSkills: Gemini API, OpenAI, RAG, Pinecone, ChromaDB, Spring Boot, Python, FastApi, Model Context Protocol (MCP).\n\nCAREER HIGHLIGHTS:\n- Designed multi-agent collaboration systems for automated document analysis.\n- Created RAG pipeline utilizing Google Gemini embedding models and semantic chunking.");
        c2.setResumeFileName("Alex_Rivera_AI_CV.pdf");
        candidateRepository.save(c2);

        Candidate c3 = new Candidate();
        c3.setFullName("David Miller");
        c3.setEmail("david.miller@example.com");
        c3.setPhone("+1 (555) 345-6789");
        c3.setTitle("Backend Microservices Engineer");
        c3.setYearsExperience(5);
        c3.setPrimarySkills("Java, Spring Boot, Docker, REST APIs, MySQL, Redis");
        c3.setStatus("SCREENED");
        c3.setAiMatchScore(82);
        c3.setResumeSummary("5 years experience developing REST APIs and microservice applications. Solid Java foundation with working knowledge of Spring Boot and SQL optimization.");
        c3.setFullResumeText("DAVID MILLER\nSoftware Engineer\nExperience: 5 Years\nSkills: Java, Spring Boot, REST APIs, Docker, MySQL, Redis.\n\nSUMMARY:\nFocused Java backend engineer who loves clean code, unit testing with JUnit/Mockito, and standard CI/CD pipelines.");
        c3.setResumeFileName("David_Miller_Resume.pdf");
        candidateRepository.save(c3);
    }

    private void seedInterviews() {
        Interview i1 = new Interview();
        i1.setCandidateId(1L);
        i1.setCandidateName("Sarah Jenkins");
        i1.setJobId(1L);
        i1.setJobTitle("Senior Full Stack Java & React Engineer");
        i1.setInterviewerName("Michael Scott (Lead Architect)");
        i1.setInterviewerEmail("mscott@wipro-poc.com");
        i1.setRoundType("TECHNICAL_ROUND_1");
        i1.setScheduledTime("2026-10-08 14:00 EST");
        i1.setMeetingLink("https://teams.microsoft.com/l/meetup-join/recruitment-hub-01");
        i1.setStatus("SCHEDULED");
        i1.setNotes("Focus on Spring Boot microservices design patterns, Kafka partition strategy, and React state management.");
        interviewRepository.save(i1);

        Interview i2 = new Interview();
        i2.setCandidateId(2L);
        i2.setCandidateName("Alex Rivera");
        i2.setJobId(2L);
        i2.setJobTitle("AI / ML Lead - Generative AI & RAG Specialist");
        i2.setInterviewerName("Dr. Elena Vance (VP of AI)");
        i2.setInterviewerEmail("evance@wipro-poc.com");
        i2.setRoundType("SYSTEM_DESIGN");
        i2.setScheduledTime("2026-10-09 11:30 EST");
        i2.setMeetingLink("https://teams.microsoft.com/l/meetup-join/recruitment-hub-02");
        i2.setStatus("SCHEDULED");
        i2.setNotes("Deep dive into RAG vector indexing, Gemini API latency optimization, and MCP protocol specs.");
        interviewRepository.save(i2);
    }

    private void seedKnowledgeBase() {
        knowledgeRepository.save(new KnowledgeDocument(
            "RECRUITMENT_POLICY",
            "Global Engineering Hiring & EEO Guidelines",
            "All Roles",
            "Wipro POC Recruitment Policy v4.2:\n1. All candidates must go through structured interviews based on predefined core technical skill rubrics.\n2. Equal Employment Opportunity (EEO): Evaluation is based strictly on merit, technical assessments, and collaborative aptitude.\n3. Offer approval chain: Recruiter -> Hiring Manager -> Finance Lead -> HR Director.\n4. Remote work policy: Employees receive a $1,000 home office stipend upon joining.",
            "policy, hiring guidelines, eeo, remote stipend, offer process"
        ));

        knowledgeRepository.save(new KnowledgeDocument(
            "INTERVIEW_QUESTION_REPOSITORY",
            "Senior Java & Spring Boot Microservices Question Bank",
            "Senior Full Stack Java & React Engineer",
            "Top Technical Questions for Java/Spring Candidates:\n1. Explain the internal working of Spring Boot Auto-Configuration and custom Starter creation.\n2. How do you ensure idempotent event processing when consuming Kafka messages?\n3. Describe the difference between @Transactional isolation levels READ_COMMITTED and REPEATABLE_READ.\n4. How do you handle distributed transactions across multiple microservices (Saga pattern vs 2PC)?",
            "java, spring boot, kafka, saga pattern, microservices questions"
        ));

        knowledgeRepository.save(new KnowledgeDocument(
            "INTERVIEW_QUESTION_REPOSITORY",
            "Generative AI & RAG Architecture Question Bank",
            "AI / ML Lead",
            "Generative AI & RAG Interview Questions:\n1. How do you prevent hallucination in Gemini API powered search systems?\n2. Compare hybrid search (BM25 + Dense Vector Embeddings) versus standalone vector search.\n3. How do Model Context Protocol (MCP) servers standardize tool execution for LLMs?\n4. What chunking strategies do you recommend for large code repositories and technical documents?",
            "rag, gemini, vector embeddings, mcp, chunking strategies"
        ));
    }

    private void seedAgentTraces() {
        String traceId = "TRACE-" + UUID.randomUUID().toString().substring(0, 8);

        AgentTraceLog log1 = new AgentTraceLog();
        log1.setTraceId(traceId);
        log1.setAgentName("ScreeningAgent");
        log1.setCandidateName("Sarah Jenkins");
        log1.setJobTitle("Senior Full Stack Java & React Engineer");
        log1.setActionType("MATCH_SCORING");
        log1.setPromptOrInput("Analyze candidate Sarah Jenkins for REQ-101 (Senior Full Stack Java & React Engineer)");
        log1.setReasoningOutput("Invoked parseResumeTool. Candidate has 7 years experience (req: 6+). Required skills match: Java 17 (100%), Spring Boot (100%), Kafka (100%), React (100%). Match rating calculated at 94%.");
        log1.setToolUsed("scoreCandidateMatchTool");
        log1.setConfidenceScore(95);
        log1.setExecutionTimeMs(340L);
        log1.setTokensUsed(420);
        traceRepository.save(log1);

        AgentTraceLog log2 = new AgentTraceLog();
        log2.setTraceId(traceId);
        log2.setAgentName("InterviewAgent");
        log2.setCandidateName("Sarah Jenkins");
        log2.setJobTitle("Senior Full Stack Java & React Engineer");
        log2.setActionType("QUESTION_GENERATION");
        log2.setPromptOrInput("Generate tailored 4-question technical evaluation plan for Sarah Jenkins");
        log2.setReasoningOutput("Generated questions focusing on Kafka consumer rebalancing, Spring Boot microservices transactions, and React micro-frontends.");
        log2.setToolUsed("generateInterviewPlanTool");
        log2.setConfidenceScore(92);
        log2.setExecutionTimeMs(480L);
        log2.setTokensUsed(650);
        traceRepository.save(log2);

        AgentTraceLog log3 = new AgentTraceLog();
        log3.setTraceId(traceId);
        log3.setAgentName("HiringRecommendationAgent");
        log3.setCandidateName("Sarah Jenkins");
        log3.setJobTitle("Senior Full Stack Java & React Engineer");
        log3.setActionType("FINAL_DECISION");
        log3.setPromptOrInput("Synthesize outputs from ScreeningAgent, EvaluationAgent, and InterviewAgent.");
        log3.setReasoningOutput("RECOMMENDATION: STRONG HIRE. Candidate exceeds technical bar. Low risk profile. High fit for Core Engineering Platform team.");
        log3.setToolUsed("hiringDecisionMatrixTool");
        log3.setConfidenceScore(96);
        log3.setExecutionTimeMs(290L);
        log3.setTokensUsed(380);
        traceRepository.save(log3);
    }
}
