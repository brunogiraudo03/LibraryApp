package com.giraudo.library.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LibroResponseDTO {
    private Long id;
    private String titulo;
    private String isbn;
    private Integer stock;
    private boolean disponible;
    private String autorNombre;
    private String categoriaNombre;
    private String imagenUrl;
    private String descripcion;

    // Nuevos campos para el frontend
    private Long autorId;
    private Long categoriaId;
    private String estado;
}
