package com.work.Task.Manager.repositories;

import com.work.Task.Manager.entity.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @EntityGraph(attributePaths = {"owner", "members"})
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m WHERE p.owner.id = :userId OR m.id = :userId")
    List<Project> findProjectsByUserId(@Param("userId") Long userId);

    @Override
    @EntityGraph(attributePaths = {"owner", "members"})
    List<Project> findAll();

    @Override
    @EntityGraph(attributePaths = {"owner", "members"})
    Optional<Project> findById(Long id);
}