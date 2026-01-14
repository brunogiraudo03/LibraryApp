package com.giraudo.library.controller;

import com.giraudo.library.dto.LibroRequestDTO;
import com.giraudo.library.dto.LibroResponseDTO;
import com.giraudo.library.service.LibroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
@RequiredArgsConstructor
public class LibroController {

    private final LibroService libroService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<LibroResponseDTO> crearLibro(@RequestBody @Valid LibroRequestDTO libroDTO) {
        return ResponseEntity.ok(libroService.crearLibro(libroDTO));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO', 'USER')")
    public ResponseEntity<List<LibroResponseDTO>> listarLibros() {
        return ResponseEntity.ok(libroService.listarLibros());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO', 'USER')")
    public ResponseEntity<LibroResponseDTO> obtenerLibro(@PathVariable Long id) {
        return ResponseEntity.ok(libroService.obtenerLibroPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<LibroResponseDTO> actualizarLibro(@PathVariable Long id,
            @RequestBody @Valid LibroRequestDTO libroDTO) {
        return ResponseEntity.ok(libroService.actualizarLibro(id, libroDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        libroService.eliminarLibro(id);
        return ResponseEntity.noContent().build();
    }
}
