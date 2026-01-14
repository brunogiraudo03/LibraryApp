package com.giraudo.library.service;

import com.giraudo.library.dto.LibroRequestDTO;
import com.giraudo.library.dto.LibroResponseDTO;

import java.util.List;

public interface LibroService {
    LibroResponseDTO crearLibro(LibroRequestDTO libroDTO);

    List<LibroResponseDTO> listarLibros();

    LibroResponseDTO actualizarLibro(Long id, LibroRequestDTO libroDTO);

    LibroResponseDTO obtenerLibroPorId(Long id);

    void eliminarLibro(Long id);
}
