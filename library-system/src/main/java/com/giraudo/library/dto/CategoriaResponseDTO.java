package com.giraudo.library.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoriaResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
}
