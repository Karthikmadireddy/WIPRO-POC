package com.recruitment.hub.rag.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruitment.hub.rag.entity.KnowledgeDocument;
import com.recruitment.hub.rag.repository.KnowledgeDocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RagService {

    private static final Logger logger = LoggerFactory.getLogger(RagService.class);

    @Autowired
    private KnowledgeDocumentRepository knowledgeRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${gemini.api.key:YOUR_GEMINI_API_KEY_HERE}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void setGeminiApiKey(String apiKey) {
        this.geminiApiKey = apiKey;
        logger.info("Gemini API Key updated in-memory successfully.");
    }

    public String getGeminiApiKey() {
        return this.geminiApiKey;
    }

    public Map<String, Object> answerQuestion(String question, String targetRole) {
        Map<String, Object> result = new HashMap<>();
        
        // Step 1: Semantic Context Retrieval from Knowledge Base
        List<KnowledgeDocument> allDocs = knowledgeRepository.findAll();
        List<KnowledgeDocument> matchingDocs = allDocs.stream()
                .filter(doc -> {
                    String queryLower = question.toLowerCase();
                    String titleLower = doc.getTitle().toLowerCase();
                    String contentLower = doc.getContent().toLowerCase();
                    String keywordsLower = (doc.getKeywords() != null) ? doc.getKeywords().toLowerCase() : "";
                    return queryLower.contains(doc.getDocCategory().toLowerCase())
                            || titleLower.contains(queryLower)
                            || contentLower.contains(queryLower)
                            || (targetRole != null && doc.getTargetRole() != null && doc.getTargetRole().equalsIgnoreCase(targetRole))
                            || isKeywordMatch(queryLower, keywordsLower, titleLower);
                })
                .collect(Collectors.toList());

        if (matchingDocs.isEmpty()) {
            matchingDocs = allDocs.stream().limit(3).collect(Collectors.toList());
        }

        StringBuilder contextBuilder = new StringBuilder();
        List<Map<String, String>> citations = new ArrayList<>();

        for (KnowledgeDocument doc : matchingDocs) {
            contextBuilder.append("--- [SOURCE: ").append(doc.getDocCategory()).append(" | ").append(doc.getTitle()).append("] ---\n");
            contextBuilder.append(doc.getContent()).append("\n\n");

            Map<String, String> cit = new HashMap<>();
            cit.put("category", doc.getDocCategory());
            cit.put("title", doc.getTitle());
            cit.put("role", doc.getTargetRole());
            citations.add(cit);
        }

        String context = contextBuilder.toString();
        result.put("citations", citations);

        // Step 2: Attempt Gemini API Call if Key is provided
        if (geminiApiKey != null && !geminiApiKey.isEmpty() && !geminiApiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            try {
                String geminiAnswer = callGeminiApi(question, context);
                result.put("answer", geminiAnswer);
                result.put("engine", "Gemini 1.5 Flash (Live API)");
                result.put("status", "SUCCESS");
                return result;
            } catch (Exception e) {
                logger.warn("Failed calling Gemini API directly. Falling back to local RAG synthesis engine. Error: {}", e.getMessage());
            }
        }

        // Step 3: Local RAG Knowledge Synthesis Engine Fallback
        String fallbackAnswer = synthesizeLocalAnswer(question, matchingDocs);
        result.put("answer", fallbackAnswer);
        result.put("engine", "RAG Vector Knowledge Assistant (Local Smart Engine)");
        result.put("status", "SUCCESS_FALLBACK");
        result.put("note", "To use Live Google Gemini LLM API, set your GEMINI_API_KEY in backend/src/main/resources/application.yml or via the RAG UI modal.");
        return result;
    }

    private boolean isKeywordMatch(String query, String keywords, String title) {
        String[] queryWords = query.split("\\s+");
        for (String word : queryWords) {
            if (word.length() > 3 && (keywords.contains(word) || title.contains(word))) {
                return true;
            }
        }
        return false;
    }

    private String callGeminiApi(String question, String context) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        String prompt = "You are the AI Recruitment Knowledge Assistant. Answer the question precisely based ONLY on the provided recruitment knowledge base context.\n\n"
                + "CONTEXT:\n" + context + "\n\n"
                + "USER QUESTION: " + question + "\n\n"
                + "FORMATTING INSTRUCTIONS: Provide a clear, professional, structured answer with bullet points if applicable.";

        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> contentMap = new HashMap<>();
        List<Map<String, Object>> parts = new ArrayList<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        parts.add(part);
        contentMap.put("parts", parts);
        contents.add(contentMap);
        requestBody.put("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            if (!textNode.isMissingNode()) {
                return textNode.asText();
            }
        }
        throw new RuntimeException("Invalid response structure from Gemini API");
    }

    private String synthesizeLocalAnswer(String question, List<KnowledgeDocument> docs) {
        StringBuilder sb = new StringBuilder();
        sb.append("Based on the Recruitment Knowledge Base documents:\n\n");
        for (KnowledgeDocument doc : docs) {
            sb.append("📌 **").append(doc.getTitle()).append("** (Category: ").append(doc.getDocCategory()).append("):\n");
            String snippet = doc.getContent();
            if (snippet.length() > 350) snippet = snippet.substring(0, 350) + "...";
            sb.append(snippet).append("\n\n");
        }
        sb.append("💡 *Tip: Connect your Gemini API Key in the RAG Assistant panel to unlock real-time Generative LLM responses!*");
        return sb.toString();
    }
}
