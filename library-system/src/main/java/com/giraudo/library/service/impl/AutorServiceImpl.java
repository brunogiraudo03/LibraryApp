package com.giraudo.library.service.impl;

import com.giraudo.library.dto.AutorRequestDTO;
import com.giraudo.library.dto.AutorResponseDTO;
import com.giraudo.library.model.Autor;
import com.giraudo.library.repository.AutorRepository;
import com.giraudo.library.service.AutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutorServiceImpl implements AutorService {

    private final AutorRepository autorRepository;

    @Override
    public AutorResponseDTO crearAutor(AutorRequestDTO autorDTO) {
        Autor autor = Autor.builder()
                .nombre(autorDTO.getNombre())
                .nacionalidad(autorDTO.getNacionalidad())
                .build();
        return mapToDTO(autorRepository.save(autor));
    }

    @Override
    public List<AutorResponseDTO> listarAutores() {
        return autorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AutorResponseDTO buscarPorId(Long id) {
        return autorRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));
    }

    @Override
    public AutorResponseDTO actualizarAutor(Long id, AutorRequestDTO autorDTO) {
        Autor autor = autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));

        autor.setNombre(autorDTO.getNombre());
        autor.setNacionalidad(autorDTO.getNacionalidad());

        return mapToDTO(autorRepository.save(autor));
    }

    @Override
    public void eliminarAutor(Long id) {
        if (!autorRepository.existsById(id)) {
            throw new RuntimeException("Autor no encontrado");
        }
        autorRepository.deleteById(id);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public AutorResponseDTO obtenerAutorPorId(Long id) {
        Autor autor = autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));
        return mapToDTO(autor);
    }

    private AutorResponseDTO mapToDTO(Autor autor) {
        return AutorResponseDTO.builder()
                .id(autor.getId())
                .nombre(autor.getNombre())
                .nacionalidad(autor.getNacionalidad())
                .build();
    }
}
