-- ====================================================================
-- AI RECRUITMENT INTELLIGENCE HUB - MYSQL DATABASE SETUP & DDL SCRIPT
-- Open MySQL Workbench or MySQL Command Line Client and execute these commands:
-- ====================================================================

-- Step 1: Create Main Database (Or Microservice Databases)
CREATE DATABASE IF NOT EXISTS recruitment_db;
USE recruitment_db;

-- (Optional: Dedicated Microservice Databases if splitting DB per service)
-- CREATE DATABASE IF NOT EXISTS recruitment_candidate_db;
-- CREATE DATABASE IF NOT EXISTS recruitment_job_db;
-- CREATE DATABASE IF NOT EXISTS recruitment_rag_db;
-- CREATE DATABASE IF NOT EXISTS recruitment_agent_db;
-- CREATE DATABASE IF NOT EXISTS recruitment_mcp_db;
-- CREATE DATABASE IF NOT EXISTS recruitment_observability_db;

-- --------------------------------------------------------------------
-- Step 2: Create DDL Tables in recruitment_db
-- --------------------------------------------------------------------

-- 1. Candidates Table (Candidate Management & Resume Storage)
CREATE TABLE IF NOT EXISTS candidates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    title VARCHAR(255),
    years_experience INT,
    primary_skills VARCHAR(500),
    status VARCHAR(50) DEFAULT 'SCREENED',
    ai_match_score INT DEFAULT 85,
    resume_summary TEXT,
    full_resume_text LONGTEXT,
    resume_file_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Job Requisitions Table (Job Requisition Management)
CREATE TABLE IF NOT EXISTS job_requisitions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(100),
    experience_level VARCHAR(100),
    salary_range VARCHAR(100),
    required_skills VARCHAR(500),
    status VARCHAR(50) DEFAULT 'OPEN',
    open_positions INT DEFAULT 1,
    description TEXT,
    key_responsibilities TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Scheduled Interviews Table (Interview Scheduling)
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT,
    candidate_name VARCHAR(255),
    job_id BIGINT,
    job_title VARCHAR(255),
    interviewer_name VARCHAR(255),
    interviewer_email VARCHAR(255),
    round_type VARCHAR(100),
    scheduled_time VARCHAR(100),
    meeting_link VARCHAR(500),
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. RAG Knowledge Documents Table (Phase 2 Knowledge Assistant)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doc_category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    content TEXT NOT NULL,
    keywords VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Multi-Agent Trace Log Table (Phase 5 Observability & Traceability)
CREATE TABLE IF NOT EXISTS agent_trace_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trace_id VARCHAR(100) NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    candidate_name VARCHAR(255),
    job_title VARCHAR(255),
    action_type VARCHAR(100),
    prompt_or_input TEXT,
    reasoning_output TEXT,
    tool_used VARCHAR(255),
    confidence_score INT DEFAULT 90,
    execution_time_ms BIGINT DEFAULT 300,
    tokens_used INT DEFAULT 400,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
