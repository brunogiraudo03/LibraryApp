package com.giraudo.library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PrestamoRequestDTO {
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @NotNull(message = "El ID del libro es obligatorio")
    private Long libroId;

    @NotNull(message = "Los días de préstamo son obligatorios")
    @Min(value = 1, message = "El préstamo debe ser por al menos 1 día")
    private Integer diasPrestamo;
}
