package com.giraudo.library.controller;

import com.giraudo.library.dto.PrestamoRequestDTO;
import com.giraudo.library.dto.PrestamoResponseDTO;
import com.giraudo.library.service.PrestamoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestamos")
@RequiredArgsConstructor
public class PrestamoController {

    private final PrestamoService prestamoService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<PrestamoResponseDTO> registrarPrestamo(@Valid @RequestBody PrestamoRequestDTO prestamoDTO) {
        return new ResponseEntity<>(prestamoService.registrarPrestamo(prestamoDTO), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/devolucion")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<PrestamoResponseDTO> registrarDevolucion(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.registrarDevolucion(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<List<PrestamoResponseDTO>> listarPrestamos(@RequestParam(required = false) Long usuarioId) {
        return ResponseEntity.ok(prestamoService.listarPrestamosPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<PrestamoResponseDTO> obtenerPrestamo(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.obtenerPrestamoPorId(id));
    }
}
