package com.recruitment.hub.job.repository;

import com.recruitment.hub.job.entity.JobRequisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRequisitionRepository extends JpaRepository<JobRequisition, Long> {
    List<JobRequisition> findByStatus(String status);
    List<JobRequisition> findByTitleContainingIgnoreCaseOrRequiredSkillsContainingIgnoreCase(String title, String skills);
}
