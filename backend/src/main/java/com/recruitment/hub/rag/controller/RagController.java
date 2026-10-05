package com.recruitment.hub.rag.controller;

import com.recruitment.hub.rag.entity.KnowledgeDocument;
import com.recruitment.hub.rag.repository.KnowledgeDocumentRepository;
import com.recruitment.hub.rag.service.RagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rag")
@CrossOrigin(origins = "*")
public class RagController {

    @Autowired
    private KnowledgeDocumentRepository knowledgeRepository;

    @Autowired
    private RagService ragService;

    @GetMapping("/documents")
    public List<KnowledgeDocument> getDocuments(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return knowledgeRepository.findByDocCategory(category);
        }
        return knowledgeRepository.findAll();
    }

    @PostMapping("/documents")
    public KnowledgeDocument addDocument(@RequestBody KnowledgeDocument doc) {
        return knowledgeRepository.save(doc);
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        if (knowledgeRepository.existsById(id)) {
            knowledgeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> queryKnowledgeBase(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String targetRole = request.get("targetRole");

        if (question == null || question.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Question parameter is required.");
            return ResponseEntity.badRequest().body(error);
        }

        Map<String, Object> response = ragService.answerQuestion(question, targetRole);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/set-key")
    public ResponseEntity<Map<String, Object>> setGeminiKey(@RequestBody Map<String, String> request) {
        String apiKey = request.get("apiKey");
        if (apiKey != null) {
            ragService.setGeminiApiKey(apiKey.trim());
        }
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Gemini API Key updated successfully for RAG Knowledge Assistant!");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/key-status")
    public ResponseEntity<Map<String, Object>> getKeyStatus() {
        String key = ragService.getGeminiApiKey();
        boolean isConfigured = (key != null && !key.isEmpty() && !key.equals("YOUR_GEMINI_API_KEY_HERE"));
        
        Map<String, Object> res = new HashMap<>();
        res.put("configured", isConfigured);
        res.put("maskedKey", isConfigured ? (key.substring(0, Math.min(6, key.length())) + "****************") : "Not Set");
        return ResponseEntity.ok(res);
    }
}
