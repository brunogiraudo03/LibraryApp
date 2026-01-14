package com.giraudo.library.repository;

import com.giraudo.library.model.Multa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MultaRepository extends JpaRepository<Multa, Long> {
    List<Multa> findByUsuarioId(Long usuarioId);
}
