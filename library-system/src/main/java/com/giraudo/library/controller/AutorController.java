package com.giraudo.library.controller;

import com.giraudo.library.dto.AutorRequestDTO;
import com.giraudo.library.dto.AutorResponseDTO;
import com.giraudo.library.service.AutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/autores")
@RequiredArgsConstructor
public class AutorController {

    private final AutorService autorService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<AutorResponseDTO> crearAutor(@RequestBody @Valid AutorRequestDTO autorDTO) {
        return ResponseEntity.ok(autorService.crearAutor(autorDTO));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO', 'USER')")
    public ResponseEntity<List<AutorResponseDTO>> listarAutores() {
        return ResponseEntity.ok(autorService.listarAutores());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO', 'USER')")
    public ResponseEntity<AutorResponseDTO> obtenerAutor(@PathVariable Long id) {
        return ResponseEntity.ok(autorService.obtenerAutorPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<AutorResponseDTO> actualizarAutor(@PathVariable Long id,
            @RequestBody @Valid AutorRequestDTO autorDTO) {
        return ResponseEntity.ok(autorService.actualizarAutor(id, autorDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarAutor(@PathVariable Long id) {
        autorService.eliminarAutor(id);
        return ResponseEntity.noContent().build();
    }
}
