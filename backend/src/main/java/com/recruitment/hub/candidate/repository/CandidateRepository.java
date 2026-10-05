package com.recruitment.hub.candidate.repository;

import com.recruitment.hub.candidate.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByStatus(String status);
    List<Candidate> findByFullNameContainingIgnoreCaseOrPrimarySkillsContainingIgnoreCase(String name, String skills);
}
