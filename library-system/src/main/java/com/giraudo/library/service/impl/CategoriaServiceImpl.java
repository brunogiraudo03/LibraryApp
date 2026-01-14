package com.giraudo.library.service.impl;

import com.giraudo.library.dto.CategoriaRequestDTO;
import com.giraudo.library.dto.CategoriaResponseDTO;
import com.giraudo.library.model.Categoria;
import com.giraudo.library.repository.CategoriaRepository;
import com.giraudo.library.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Override
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO categoriaDTO) {
        Categoria categoria = Categoria.builder()
                .nombre(categoriaDTO.getNombre())
                .descripcion(categoriaDTO.getDescripcion())
                .build();
        return mapToDTO(categoriaRepository.save(categoria));
    }

    @Override
    public List<CategoriaResponseDTO> listarCategorias() {
        return categoriaRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaResponseDTO buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    @Override
    public CategoriaResponseDTO actualizarCategoria(Long id, CategoriaRequestDTO categoriaDTO) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setDescripcion(categoriaDTO.getDescripcion());

        return mapToDTO(categoriaRepository.save(categoria));
    }

    @Override
    public void eliminarCategoria(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public CategoriaResponseDTO obtenerCategoriaPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        return mapToDTO(categoria);
    }

    private CategoriaResponseDTO mapToDTO(Categoria categoria) {
        return CategoriaResponseDTO.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .descripcion(categoria.getDescripcion())
                .build();
    }
}
