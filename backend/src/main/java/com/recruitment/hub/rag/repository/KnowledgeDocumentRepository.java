package com.recruitment.hub.rag.repository;

import com.recruitment.hub.rag.entity.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeDocumentRepository extends JpaRepository<KnowledgeDocument, Long> {
    List<KnowledgeDocument> findByDocCategory(String category);
    List<KnowledgeDocument> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrKeywordsContainingIgnoreCase(String title, String content, String keywords);
}
