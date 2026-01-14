package com.giraudo.library.repository;

import com.giraudo.library.model.EstadoPrestamo;
import com.giraudo.library.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {
    List<Prestamo> findByUsuarioIdAndEstado(Long usuarioId, EstadoPrestamo estado);
}
