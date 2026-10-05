package com.recruitment.hub.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class KafkaService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaService.class);

    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;

    private final List<KafkaEventMessage> inMemoryEventStream = Collections.synchronizedList(new ArrayList<>());

    public static class KafkaEventMessage {
        private String id;
        private String topic;
        private String key;
        private String payload;
        private String timestamp;

        public KafkaEventMessage(String topic, String key, String payload) {
            this.id = "evt-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
            this.topic = topic;
            this.key = key;
            this.payload = payload;
            this.timestamp = LocalDateTime.now().toString();
        }

        public String getId() { return id; }
        public String getTopic() { return topic; }
        public String getKey() { return key; }
        public String getPayload() { return payload; }
        public String getTimestamp() { return timestamp; }
    }

    public void publishEvent(String topic, String key, String payload) {
        KafkaEventMessage message = new KafkaEventMessage(topic, key, payload);
        inMemoryEventStream.add(0, message); // add to top
        if (inMemoryEventStream.size() > 100) {
            inMemoryEventStream.remove(inMemoryEventStream.size() - 1);
        }

        logger.info("[Kafka Event Published] Topic: {}, Key: {}, Message: {}", topic, key, payload);

        if (kafkaTemplate != null) {
            try {
                kafkaTemplate.send(topic, key, payload);
            } catch (Exception e) {
                logger.warn("Kafka broker not reachable. Event stored in internal stream trace. Reason: {}", e.getMessage());
            }
        }
    }

    @KafkaListener(topics = {"recruitment.candidate.events", "recruitment.job.events", "recruitment.agent.traces", "recruitment.mcp.events"}, groupId = "recruitment-hub-group")
    public void listen(String message) {
        logger.info("[Kafka Consumer Received] Payload: {}", message);
    }

    public List<KafkaEventMessage> getRecentEvents() {
        return new ArrayList<>(inMemoryEventStream);
    }
}
