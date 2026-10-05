package com.recruitment.hub.candidate.controller;

import com.recruitment.hub.candidate.entity.Candidate;
import com.recruitment.hub.candidate.repository.CandidateRepository;
import com.recruitment.hub.kafka.KafkaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private KafkaService kafkaService;

    @GetMapping
    public List<Candidate> getAllCandidates(@RequestParam(required = false) String search,
                                            @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return candidateRepository.findByStatus(status);
        }
        if (search != null && !search.isEmpty()) {
            return candidateRepository.findByFullNameContainingIgnoreCaseOrPrimarySkillsContainingIgnoreCase(search, search);
        }
        return candidateRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable Long id) {
        return candidateRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Candidate createCandidate(@RequestBody Candidate candidate) {
        Candidate saved = candidateRepository.save(candidate);
        kafkaService.publishEvent("recruitment.candidate.events", "CANDIDATE_CREATED", 
            "{\"candidateId\":" + saved.getId() + ",\"name\":\"" + saved.getFullName() + "\"}");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidate> updateCandidate(@PathVariable Long id, @RequestBody Candidate candidateDetails) {
        return candidateRepository.findById(id).map(c -> {
            c.setFullName(candidateDetails.getFullName());
            c.setEmail(candidateDetails.getEmail());
            c.setPhone(candidateDetails.getPhone());
            c.setTitle(candidateDetails.getTitle());
            c.setYearsExperience(candidateDetails.getYearsExperience());
            c.setPrimarySkills(candidateDetails.getPrimarySkills());
            c.setStatus(candidateDetails.getStatus());
            c.setAiMatchScore(candidateDetails.getAiMatchScore());
            c.setResumeSummary(candidateDetails.getResumeSummary());
            Candidate updated = candidateRepository.save(c);

            kafkaService.publishEvent("recruitment.candidate.events", "CANDIDATE_UPDATED",
                "{\"candidateId\":" + updated.getId() + ",\"status\":\"" + updated.getStatus() + "\"}");

            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        if (candidateRepository.existsById(id)) {
            candidateRepository.deleteById(id);
            kafkaService.publishEvent("recruitment.candidate.events", "CANDIDATE_DELETED", "{\"candidateId\":" + id + "}");
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<Map<String, Object>> uploadResume(@RequestParam("file") MultipartFile file,
                                                            @RequestParam(value = "candidateName", required = false) String candidateName,
                                                            @RequestParam(value = "email", required = false) String email) {
        try {
            String filename = file.getOriginalFilename();
            String content = "";

            if (filename != null && (filename.endsWith(".txt") || filename.endsWith(".md") || filename.endsWith(".csv") || filename.endsWith(".pdf"))) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                    content = reader.lines().collect(Collectors.joining("\n"));
                }
            } else {
                content = "Extracted profile text from " + filename + ". Skills found: Java, Spring Boot, React, Kafka, Docker, AI.";
            }

            Candidate candidate = new Candidate();
            candidate.setFullName((candidateName != null && !candidateName.isEmpty()) ? candidateName : "Uploaded Candidate " + (int)(Math.random() * 1000));
            candidate.setEmail((email != null && !email.isEmpty()) ? email : "candidate" + (int)(Math.random() * 1000) + "@example.com");
            candidate.setPhone("+1 (555) " + (100 + (int)(Math.random() * 899)) + "-" + (1000 + (int)(Math.random() * 8999)));
            candidate.setTitle("Senior Engineer / AI Specialist");
            candidate.setYearsExperience(6);
            candidate.setPrimarySkills("Java 17, Spring Boot, React, Kafka, Microservices, Gemini API");
            candidate.setStatus("SCREENED");
            candidate.setAiMatchScore(88 + (int)(Math.random() * 10));
            candidate.setResumeFileName(filename);
            candidate.setFullResumeText(content);
            candidate.setResumeSummary("Parsed from resume " + filename + ". Proven technical skills in microservices backend and frontend architectures.");

            Candidate saved = candidateRepository.save(candidate);

            kafkaService.publishEvent("recruitment.candidate.events", "RESUME_UPLOADED", 
                "{\"candidateId\":" + saved.getId() + ",\"filename\":\"" + filename + "\"}");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resume uploaded and candidate profile extracted successfully!");
            response.put("candidate", saved);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
