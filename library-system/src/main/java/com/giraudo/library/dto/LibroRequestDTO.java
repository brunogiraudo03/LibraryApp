package com.giraudo.library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LibroRequestDTO {
    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "El ISBN es obligatorio")
    private String isbn;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @NotNull(message = "El ID del autor es obligatorio")
    private Long autorId;

    @NotNull(message = "El ID de la categoría es obligatorio")
    private Long categoriaId;

    private String imagenUrl;
    private String descripcion;
}
