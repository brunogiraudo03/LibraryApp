package com.giraudo.library.service;

import com.giraudo.library.dto.CategoriaRequestDTO;
import com.giraudo.library.dto.CategoriaResponseDTO;

import java.util.List;

public interface CategoriaService {
    CategoriaResponseDTO crearCategoria(CategoriaRequestDTO categoriaDTO);

    List<CategoriaResponseDTO> listarCategorias();

    CategoriaResponseDTO buscarPorId(Long id);

    CategoriaResponseDTO actualizarCategoria(Long id, CategoriaRequestDTO categoriaDTO);

    CategoriaResponseDTO obtenerCategoriaPorId(Long id);

    void eliminarCategoria(Long id);
}
