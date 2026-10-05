package com.recruitment.hub.job.controller;

import com.recruitment.hub.job.entity.JobRequisition;
import com.recruitment.hub.job.repository.JobRequisitionRepository;
import com.recruitment.hub.kafka.KafkaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobRequisitionController {

    @Autowired
    private JobRequisitionRepository jobRepository;

    @Autowired
    private KafkaService kafkaService;

    @GetMapping
    public List<JobRequisition> getAllJobs(@RequestParam(required = false) String search,
                                           @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return jobRepository.findByStatus(status);
        }
        if (search != null && !search.isEmpty()) {
            return jobRepository.findByTitleContainingIgnoreCaseOrRequiredSkillsContainingIgnoreCase(search, search);
        }
        return jobRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobRequisition> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public JobRequisition createJob(@RequestBody JobRequisition job) {
        JobRequisition saved = jobRepository.save(job);
        kafkaService.publishEvent("recruitment.job.events", "JOB_CREATED", 
            "{\"jobId\":" + saved.getId() + ",\"jobCode\":\"" + saved.getJobCode() + "\",\"title\":\"" + saved.getTitle() + "\"}");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobRequisition> updateJob(@PathVariable Long id, @RequestBody JobRequisition jobDetails) {
        return jobRepository.findById(id).map(j -> {
            j.setTitle(jobDetails.getTitle());
            j.setDepartment(jobDetails.getDepartment());
            j.setLocation(jobDetails.getLocation());
            j.setExperienceLevel(jobDetails.getExperienceLevel());
            j.setSalaryRange(jobDetails.getSalaryRange());
            j.setRequiredSkills(jobDetails.getRequiredSkills());
            j.setStatus(jobDetails.getStatus());
            j.setOpenPositions(jobDetails.getOpenPositions());
            j.setDescription(jobDetails.getDescription());
            j.setKeyResponsibilities(jobDetails.getKeyResponsibilities());
            JobRequisition updated = jobRepository.save(j);

            kafkaService.publishEvent("recruitment.job.events", "JOB_UPDATED", "{\"jobId\":" + updated.getId() + "}");
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        if (jobRepository.existsById(id)) {
            jobRepository.deleteById(id);
            kafkaService.publishEvent("recruitment.job.events", "JOB_DELETED", "{\"jobId\":" + id + "}");
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
