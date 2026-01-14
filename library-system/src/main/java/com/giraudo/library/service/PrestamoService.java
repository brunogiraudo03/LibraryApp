package com.giraudo.library.service;

import com.giraudo.library.dto.PrestamoRequestDTO;
import com.giraudo.library.dto.PrestamoResponseDTO;

import java.util.List;

public interface PrestamoService {
    PrestamoResponseDTO registrarPrestamo(PrestamoRequestDTO prestamoDTO);

    List<PrestamoResponseDTO> listarPrestamosPorUsuario(Long usuarioId);

    PrestamoResponseDTO obtenerPrestamoPorId(Long id);

    PrestamoResponseDTO registrarDevolucion(Long prestamoId);
}
