package com.giraudo.library.service.impl;

import com.giraudo.library.dto.LibroRequestDTO;
import com.giraudo.library.dto.LibroResponseDTO;
import com.giraudo.library.model.Autor;
import com.giraudo.library.model.Categoria;
import com.giraudo.library.model.Libro;
import com.giraudo.library.repository.AutorRepository;
import com.giraudo.library.repository.CategoriaRepository;
import com.giraudo.library.repository.LibroRepository;
import com.giraudo.library.service.LibroService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LibroServiceImpl implements LibroService {

    private final LibroRepository libroRepository;
    private final AutorRepository autorRepository;
    private final CategoriaRepository categoriaRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public LibroResponseDTO crearLibro(LibroRequestDTO libroDTO) {
        if (libroRepository.existsByIsbn(libroDTO.getIsbn())) {
            throw new RuntimeException("Ya existe un libro con ese ISBN");
        }

        Autor autor = autorRepository.findById(libroDTO.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));

        Categoria categoria = categoriaRepository.findById(libroDTO.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Libro libro = Libro.builder()
                .titulo(libroDTO.getTitulo())
                .isbn(libroDTO.getIsbn())
                .stock(libroDTO.getStock())
                .fechaPublicacion(LocalDate.now())
                .imagenUrl(libroDTO.getImagenUrl())
                .descripcion(libroDTO.getDescripcion())
                .autor(autor)
                .categoria(categoria)
                .build();

        Libro guardado = libroRepository.save(libro);
        return mapToDTO(guardado);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<LibroResponseDTO> listarLibros() {
        return libroRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public LibroResponseDTO actualizarLibro(Long id, LibroRequestDTO libroDTO) {
        Libro libro = libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        Autor autor = autorRepository.findById(libroDTO.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));

        Categoria categoria = categoriaRepository.findById(libroDTO.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        // Validar ISBN solo si cambió
        if (!libro.getIsbn().equals(libroDTO.getIsbn()) && libroRepository.existsByIsbn(libroDTO.getIsbn())) {
            throw new RuntimeException("Ya existe otro libro con ese ISBN");
        }

        libro.setTitulo(libroDTO.getTitulo());
        libro.setIsbn(libroDTO.getIsbn());
        libro.setStock(libroDTO.getStock());
        libro.setImagenUrl(libroDTO.getImagenUrl());
        libro.setDescripcion(libroDTO.getDescripcion());
        libro.setAutor(autor);
        libro.setCategoria(categoria);

        return mapToDTO(libroRepository.save(libro));
    }

    @Override
    public void eliminarLibro(Long id) {
        if (!libroRepository.existsById(id)) {
            throw new RuntimeException("Libro no encontrado");
        }
        libroRepository.deleteById(id);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public LibroResponseDTO obtenerLibroPorId(Long id) {
        Libro libro = libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        return mapToDTO(libro);
    }

    private LibroResponseDTO mapToDTO(Libro libro) {
        String estado = "DISPONIBLE";
        if (libro.getStock() <= 0)
            estado = "AGOTADO";
        // Si tuviera lógica de prestamos para definir estado, iría aquí.
        // Por ahora lo simplificamos:

        return LibroResponseDTO.builder()
                .id(libro.getId())
                .titulo(libro.getTitulo())
                .isbn(libro.getIsbn())
                .stock(libro.getStock())
                .disponible(libro.getStock() > 0)
                .imagenUrl(libro.getImagenUrl())
                .descripcion(libro.getDescripcion())
                .autorNombre(libro.getAutor() != null ? libro.getAutor().getNombre() : "Desconocido")
                .categoriaNombre(libro.getCategoria() != null ? libro.getCategoria().getNombre() : "Sin Categoría")
                .autorId(libro.getAutor() != null ? libro.getAutor().getId() : null)
                .categoriaId(libro.getCategoria() != null ? libro.getCategoria().getId() : null)
                .estado(libro.getStock() > 0 ? "DISPONIBLE" : "AGOTADO")
                .build();
    }
}
