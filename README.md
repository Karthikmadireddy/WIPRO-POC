# 🚀 AI-Powered Recruitment Intelligence Hub

An autonomous multi-agent recruitment platform assisting hiring teams in talent discovery, profile analysis, candidate evaluation, interview preparation, and hiring decisions through collaboration between Spring Boot microservices, Kafka event streams, and Google Gemini AI.

---

## 🌟 Architecture & Phases Overview

### **Phase 1: Working Full Stack Application**
- **Candidate Management Portal**: Full candidate profile CRUD, resume upload, text extraction, match scoring.
- **Job Requisition Management**: Create, edit, and track engineering positions and required skill matrices.
- **Resume Upload & Storage**: PDF / TXT multipart resume parsing directly via Spring Boot backend API.
- **Interview Scheduling**: Schedule interview rounds, assign interviewers, auto-generate Microsoft Teams meeting links.
- **Recruiter Dashboard**: Visual KPIs, hiring pipeline funnel distribution (Recharts), and agent token activity metrics.

### **Phase 2: RAG Knowledge Assistant (Gemini API)**
- **Role-Specific & Policy QA**: Semantic retrieval over Job Descriptions, Recruitment Policies, and Interview Question Repositories.
- **Gemini 1.5 Flash Integration**: Real-time Generative QA using Google Gemini API.
- **Dynamic API Key Configuration**: Interactive UI Modal + `application.yml` setting.

### **Phase 3: Context-Aware Agents + Tool Calling**
- **Recruiter Natural Language Search**: Type criteria (e.g. *"Find candidates with 6+ years experience in Java and Spring Boot"*).
- **Screening Agent**: Performs resume-JD analysis via tool calling (`parseResumeTool`, `scoreCandidateMatchTool`).
- **Interview Preparation Agent**: Generates custom 3-stage technical evaluation plans.
- **Candidate Evaluation Agent**: Summarizes technical strengths, soft skills, and gap areas.
- **Hiring Recommendation Agent**: Synthesizes multi-agent outputs into final hiring decisions.

### **Phase 4: MCP Server Integrations (Model Context Protocol)**
- **ATS MCP Server**: Sync candidate status & external pipeline metrics (`/api/mcp/execute`).
- **LinkedIn MCP Server**: Search external profiles & verify employment credentials.
- **Outlook MCP Server**: Send automated invite emails & offer letters.
- **Teams MCP Server**: Post adaptive card feedback to hiring channels.
- **Calendar Integration MCP**: Free/busy slot checking & meeting slot booking.

### **Phase 5: Multi-Agent Collaboration Observability & Traceability**
- **Interactive Agent DAG Visualizer**: Flow diagram mapping handoffs between the 4 autonomous agents.
- **Decision Traceability Logs**: Step-by-step reasoning tree, prompt inputs, tool outputs, confidence scores, token usage.
- **Live Kafka Event Stream Feed**: Monitor real-time Kafka event streams (`recruitment.candidate.events`, `recruitment.job.events`, `recruitment.agent.traces`, `recruitment.mcp.events`).

---

## 🔑 1. Gemini API Key Configuration (Where to Paste)

You can configure your **Gemini API Key** in any of 3 ways:

1. **Interactive UI Modal (Easiest)**: Click the **"Paste Gemini Key"** button at the top-right of the web application (`http://localhost:5173`) and paste your `AIzaSy...` key.
2. **Spring Boot `application.yml`**: Open `backend/src/main/resources/application.yml` line 36 and edit:
   ```yaml
   gemini:
     api:
       key: YOUR_ACTUAL_GEMINI_API_KEY_HERE
   ```
3. **Environment Variable**: Set `GEMINI_API_KEY=AIzaSy...` before launching Spring Boot.

---

## 🗄️ 2. External Database Configuration & Names

By default, Spring Boot uses an **in-memory H2 database** so the portal runs 100% out of the box immediately. 

To connect your external **PostgreSQL** or **MySQL** database:

### Recommended Database Name:
- Database Name: `recruitment_db` (or microservice DBs `recruitment_candidate_db`, `recruitment_job_db`)
- DDL SQL Schema file provided at: `backend/src/main/resources/schema.sql`

### How to configure in `backend/src/main/resources/application.yml`:

#### **For PostgreSQL**:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/recruitment_db
    driver-class-name: org.postgresql.Driver
    username: postgres
    password: postgres_password
```

#### **For MySQL**:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/recruitment_db?useSSL=false
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: mysql_password
```

---

## 📡 3. Kafka Portal Setup & Commands

Run these terminal commands to spin up Apache Kafka, Zookeeper, Kafka UI Portal, and create all event topics:

### **A. Run Kafka & Kafka UI Portal via Docker Compose**:
```bash
docker-compose -f kafka-setup/docker-compose.yml up -d
```
*Kafka UI Portal will be available at:* `http://localhost:9080` (or `http://localhost:8080`)

### **B. Create Kafka Topics**:
```bash
# Candidate events topic
kafka-topics.sh --create --topic recruitment.candidate.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# Job events topic
kafka-topics.sh --create --topic recruitment.job.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# Agent traces topic
kafka-topics.sh --create --topic recruitment.agent.traces --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# MCP events topic
kafka-topics.sh --create --topic recruitment.mcp.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### **C. Stream Live Events in Console**:
```bash
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic recruitment.candidate.events --from-beginning
```

---

## 💻 4. Running the Application

### **Start Spring Boot Microservices Backend (Port 8080)**:
```bash
cd backend
mvn spring-boot:run
```
- API Base URL: `http://localhost:8080/api`
- H2 Console (if using H2): `http://localhost:8080/h2-console`

### **Start React Frontend (Port 5173)**:
```bash
cd frontend
npm run dev
```
- Open browser at: `http://localhost:5173`
