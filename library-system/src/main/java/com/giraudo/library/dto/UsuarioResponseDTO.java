package com.giraudo.library.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private LocalDate fechaRegistro;
    private String role;
}
