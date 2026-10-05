# 📡 Native Apache Kafka Setup & Commands (Without Docker)

This guide provides exact commands to run the **Apache Kafka Broker** directly on your local system without Docker Compose.

---

## 🪟 Windows Commands (Standard Kafka Binary Installation)

Run these commands from your Kafka installation directory (e.g. `C:\kafka_2.13-3.7.0`):

### **1. Start Zookeeper Service** (Terminal 1)
```cmd
.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
```

### **2. Start Kafka Broker Server** (Terminal 2 - Port 9092)
```cmd
.\bin\windows\kafka-server-start.bat .\config\server.properties
```

### **3. Create Microservice Kafka Topics** (Terminal 3)
```cmd
# Candidate Events Topic
.\bin\windows\kafka-topics.bat --create --topic recruitment.candidate.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# Job Requisition Events Topic
.\bin\windows\kafka-topics.bat --create --topic recruitment.job.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# Multi-Agent Trace Logs Topic
.\bin\windows\kafka-topics.bat --create --topic recruitment.agent.traces --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# MCP Events Topic
.\bin\windows\kafka-topics.bat --create --topic recruitment.mcp.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### **4. Stream & Consume Live Kafka Events in Terminal** (Terminal 4)
```cmd
.\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic recruitment.candidate.events --from-beginning
```

---

## 🐧 Linux / macOS / WSL Commands

From your Kafka installation folder:

### **1. Start Zookeeper**
```bash
./bin/zookeeper-server-start.sh ./config/zookeeper.properties
```

### **2. Start Kafka Broker**
```bash
./bin/kafka-server-start.sh ./config/server.properties
```

### **3. Create Topics**
```bash
./bin/kafka-topics.sh --create --topic recruitment.candidate.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
./bin/kafka-topics.sh --create --topic recruitment.job.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
./bin/kafka-topics.sh --create --topic recruitment.agent.traces --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
./bin/kafka-topics.sh --create --topic recruitment.mcp.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### **4. Stream Events**
```bash
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic recruitment.candidate.events --from-beginning
```

---

## 🚀 Alternative: Kafka KRaft Mode (Kafka without Zookeeper)

If you are using Kafka 3.x+ in KRaft mode (no Zookeeper needed):

```cmd
# 1. Generate Cluster ID
.\bin\windows\kafka-storage.bat random-cluster-id

# 2. Format Log Directories
.\bin\windows\kafka-storage.bat format -t <CLUSTER_ID> -c .\config\kraft\server.properties

# 3. Start Kafka Broker
.\bin\windows\kafka-server-start.bat .\config\kraft\server.properties
```
