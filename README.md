# 🚀 AI-Powered Recruitment Intelligence Hub

An AI-powered recruitment platform designed to assist recruiters and candidates with candidate management, job requisitions, applications, resume processing, interview scheduling, and recruitment workflows.

The project is built using Spring Boot, React/Vite, MySQL, Apache Kafka, JWT authentication, and Google Gemini AI.

---

## 🌟 Project Overview

The project is being developed in multiple phases.

### Phase 1: Working Full Stack Application

The current focus is completing the core recruitment platform.

- Candidate Management Portal
- Candidate profile creation and management
- Resume upload and processing
- Job requisition management
- Job browsing for candidates
- Candidate job applications
- Recruiter candidate pipeline
- Interview scheduling
- Recruiter dashboard
- Candidate dashboard
- JWT-based authentication and authorization
- MySQL database persistence
- Kafka event-based communication

### Phase 2: RAG Knowledge Assistant

Planned features:

- Recruitment policy knowledge base
- Job description knowledge base
- Semantic retrieval
- Gemini-powered recruitment Q&A
- Role-specific recruitment assistance

### Phase 3: Context-Aware Agents and Tool Calling

Planned features:

- Natural-language candidate search
- Resume and job-description matching
- Candidate screening agent
- Interview preparation agent
- Candidate evaluation agent
- Hiring recommendation agent

### Phase 4: MCP Server Integrations

Planned integrations include:

- ATS integration
- LinkedIn integration
- Outlook integration
- Microsoft Teams integration
- Calendar integration

### Phase 5: Multi-Agent Collaboration and Observability

Planned features:

- Agent workflow visualization
- Agent traceability
- Decision logs
- Kafka event monitoring
- Token usage monitoring
- Multi-agent collaboration

---

# 🏗️ Technology Stack

## Backend

- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT Authentication
- Maven
- Apache Kafka
- MySQL
- Google Gemini API

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router
- Recharts
- Lucide React
- React Hot Toast

## Infrastructure

- Apache Kafka
- Kafka KRaft mode
- MySQL
- Git / GitHub

---

# 📁 Project Structure

```text
WIPRO-POC/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── kafka-setup/
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 🗄️ Database Configuration

The application uses **MySQL** for persistent data storage.

## Recommended Database

```text
Database Name: recruitment_db
```

Create the database using MySQL:

```sql
CREATE DATABASE recruitment_db;
```

The Spring Boot application is configured to connect to:

```text
localhost:3306/recruitment_db
```

Hibernate is configured to automatically update the database schema:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

# 🔐 Environment Variables

Sensitive information should **not** be committed to GitHub.

The backend uses environment variables for secrets such as:

```text
DATABASE_PASSWORD
GEMINI_API_KEY
```

The application properties use placeholders such as:

```properties
spring.datasource.password=${DATABASE_PASSWORD}
gemini.api.key=${GEMINI_API_KEY}
```

## Windows PowerShell

Before starting the backend, configure the variables:

```powershell
$env:DATABASE_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Do not commit actual passwords or API keys to GitHub.

---

# 📨 Apache Kafka Setup

This project uses **Apache Kafka in KRaft mode**.

Docker and ZooKeeper are not required for the current setup.

Kafka is expected to run locally on:

```text
localhost:9092
```

The KRaft controller uses:

```text
localhost:9093
```

---

## Starting Kafka

The current Kafka installation is located at:

```text
C:\kafka
```

Open a terminal and run:

```powershell
cd C:\kafka
```

Start the Kafka broker:

```powershell
.\bin\windows\kafka-server-start.bat .\config\broker.properties
```

Keep this terminal running.

---

# 📡 Kafka Topics

The application uses the following Kafka topics:

```text
recruitment.candidate.events
recruitment.job.events
recruitment.agent.traces
recruitment.mcp.events
```

To list the available topics:

```powershell
cd C:\kafka

.\bin\windows\kafka-topics.bat --list --bootstrap-server localhost:9092
```

Expected topics include:

```text
__consumer_offsets
recruitment.agent.traces
recruitment.candidate.events
recruitment.job.events
recruitment.mcp.events
```

---

# ☕ Running the Backend

Open a terminal and navigate to the backend:

```powershell
cd "C:\Users\Karthik\Desktop\Wipro POC updated\backend"
```

Make sure MySQL and Kafka are running.

Set the required environment variables:

```powershell
$env:DATABASE_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Then start Spring Boot:

```powershell
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

API base URL:

```text
http://localhost:8080/api
```

---

# ⚛️ Running the Frontend

Open another terminal.

Navigate to the frontend:

```powershell
cd "C:\Users\Karthik\Desktop\Wipro POC updated\frontend"
```

Install dependencies if required:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🔑 Authentication

The application uses JWT-based authentication.

Different roles are supported for recruitment workflows, including:

- Candidate
- Recruiter

Authorization rules ensure that role-specific operations are protected.

For example:

- Candidates can browse jobs and apply for jobs.
- Recruiters can create and manage job requisitions.
- Recruiters can view candidate applications through the recruitment pipeline.

---

# 👤 Candidate Features

Candidates can:

- Register and log in
- Create and manage their profile
- Upload resumes
- Browse available jobs
- View job details
- Apply directly to jobs
- View their applications
- Track application information
- Access their candidate dashboard

---

# 🧑‍💼 Recruiter Features

Recruiters can:

- Register and log in
- Create job requisitions
- Manage job information
- View candidate applications
- View candidate information
- Manage the recruitment pipeline
- Schedule interviews
- Access recruiter dashboard information

---

# 📄 Resume Management

The application supports resume upload and processing.

Supported resume formats include:

```text
PDF
TXT
```

Resume information can be processed by the backend for candidate management and future AI-based candidate matching.

---

# 📅 Interview Scheduling

The platform supports interview scheduling as part of the recruitment workflow.

Recruiters can schedule interview information for candidates as part of the hiring process.

Future versions can extend this functionality with calendar, Outlook, and Microsoft Teams integrations.

---

# 🤖 Google Gemini Integration

Google Gemini is used/planned for AI-powered recruitment functionality.

The API key must be provided through an environment variable:

```text
GEMINI_API_KEY
```

Example in PowerShell:

```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

**Never commit the actual Gemini API key to GitHub.**

---

# 📊 Kafka Event Architecture

Kafka is used for event-driven communication and observability.

The main event topics are:

```text
Candidate Events
    ↓
recruitment.candidate.events

Job Events
    ↓
recruitment.job.events

Agent Traces
    ↓
recruitment.agent.traces

MCP Events
    ↓
recruitment.mcp.events
```

This event-driven architecture provides a foundation for future microservice and multi-agent functionality.

---

# 🔧 Prerequisites

Install the following before running the project:

### Java

Verify:

```powershell
java -version
```

### Maven

Verify:

```powershell
mvn -version
```

### Node.js

Verify:

```powershell
node -v
```

### npm

Verify:

```powershell
npm -v
```

### MySQL

Make sure the MySQL server is running.

### Apache Kafka

Make sure the Kafka broker is running on:

```text
localhost:9092
```

---

# ▶️ Quick Start

## 1. Start MySQL

Make sure MySQL is running and create the database:

```sql
CREATE DATABASE recruitment_db;
```

## 2. Start Kafka

```powershell
cd C:\kafka

.\bin\windows\kafka-server-start.bat .\config\broker.properties
```

## 3. Configure environment variables

```powershell
$env:DATABASE_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

## 4. Start Backend

```powershell
cd "C:\Users\Karthik\Desktop\Wipro POC updated\backend"

mvn spring-boot:run
```

## 5. Start Frontend

Open another terminal:

```powershell
cd "C:\Users\Karthik\Desktop\Wipro POC updated\frontend"

npm install
npm run dev
```

## 6. Open the Application

```text
http://localhost:5173
```

---

# 🧪 Testing

Backend APIs can be tested using:

- Postman
- Browser
- Swagger UI, if enabled

The frontend communicates with the backend through the configured API endpoints.

---

# 🔒 Security

The following information must never be committed to the repository:

- MySQL passwords
- Gemini API keys
- JWT secrets
- `.env` files
- Other credentials

Use environment variables instead.

The repository `.gitignore` excludes common generated files and environment files such as:

```text
.env
.env.*
node_modules/
target/
dist/
.idea/
.vscode/
```

---

# 🛠️ Troubleshooting

## Kafka connection error

Make sure Kafka is running:

```powershell
cd C:\kafka

.\bin\windows\kafka-server-start.bat .\config\broker.properties
```

Verify the broker:

```powershell
.\bin\windows\kafka-topics.bat --list --bootstrap-server localhost:9092
```

---

## MySQL connection error

Verify:

1. MySQL server is running.
2. `recruitment_db` exists.
3. `DATABASE_PASSWORD` is correct.
4. MySQL is running on port `3306`.

---

## Frontend dependency error

Run:

```powershell
cd frontend
npm install
```

Then:

```powershell
npm run dev
```

---

## Maven command not recognized

Verify Maven:

```powershell
mvn -version
```

If Maven is not recognized, configure Maven and its `bin` directory in the Windows PATH.

---

# 🚀 Future Development

The project roadmap includes:

- RAG-based recruitment knowledge assistant
- Context-aware AI agents
- Tool calling
- MCP integrations
- Multi-agent collaboration
- Agent observability
- Recruitment decision traceability
- Advanced candidate-job matching
- External recruitment platform integrations

---

# 👨‍💻 Project

**WIPRO-POC**

AI-Powered Recruitment Intelligence Hub

Built using:

```text
Spring Boot
React
Vite
MySQL
Apache Kafka
JWT
Google Gemini
```
