package com.giraudo.library.dto;

import com.giraudo.library.model.EstadoPrestamo;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PrestamoResponseDTO {
    private Long id;
    private String usuarioNombre;
    private String libroTitulo;
    private LocalDateTime fechaPrestamo;
    private LocalDate fechaDevolucion;
    private EstadoPrestamo estado;
}
