package com.recruitment.hub.interview.controller;

import com.recruitment.hub.interview.entity.Interview;
import com.recruitment.hub.interview.repository.InterviewRepository;
import com.recruitment.hub.kafka.KafkaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*")
public class InterviewController {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private KafkaService kafkaService;

    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    @GetMapping("/candidate/{candidateId}")
    public List<Interview> getInterviewsByCandidate(@PathVariable Long candidateId) {
        return interviewRepository.findByCandidateId(candidateId);
    }

    @PostMapping
    public Interview scheduleInterview(@RequestBody Interview interview) {
        Interview saved = interviewRepository.save(interview);
        kafkaService.publishEvent("recruitment.candidate.events", "INTERVIEW_SCHEDULED", 
            "{\"interviewId\":" + saved.getId() + ",\"candidateName\":\"" + saved.getCandidateName() + "\",\"time\":\"" + saved.getScheduledTime() + "\"}");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interview> updateInterview(@PathVariable Long id, @RequestBody Interview details) {
        return interviewRepository.findById(id).map(i -> {
            i.setInterviewerName(details.getInterviewerName());
            i.setInterviewerEmail(details.getInterviewerEmail());
            i.setRoundType(details.getRoundType());
            i.setScheduledTime(details.getScheduledTime());
            i.setMeetingLink(details.getMeetingLink());
            i.setStatus(details.getStatus());
            i.setNotes(details.getNotes());
            Interview updated = interviewRepository.save(i);

            kafkaService.publishEvent("recruitment.candidate.events", "INTERVIEW_UPDATED", "{\"interviewId\":" + updated.getId() + "}");
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelInterview(@PathVariable Long id) {
        if (interviewRepository.existsById(id)) {
            interviewRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
