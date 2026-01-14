package com.giraudo.library.service;

import com.giraudo.library.dto.AutorRequestDTO;
import com.giraudo.library.dto.AutorResponseDTO;

import java.util.List;

public interface AutorService {
    AutorResponseDTO crearAutor(AutorRequestDTO autorDTO);

    List<AutorResponseDTO> listarAutores();

    AutorResponseDTO buscarPorId(Long id);

    AutorResponseDTO actualizarAutor(Long id, AutorRequestDTO autorDTO);

    AutorResponseDTO obtenerAutorPorId(Long id);

    void eliminarAutor(Long id);
}
