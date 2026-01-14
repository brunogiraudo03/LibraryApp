package com.giraudo.library.service.impl;

import com.giraudo.library.dto.PrestamoRequestDTO;
import com.giraudo.library.dto.PrestamoResponseDTO;
import com.giraudo.library.model.*; // Importando todo para incluir Multa y Entidades
import com.giraudo.library.repository.*;
import com.giraudo.library.service.PrestamoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrestamoServiceImpl implements PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LibroRepository libroRepository;
    private final MultaRepository multaRepository;

    @Override
    @Transactional
    public PrestamoResponseDTO registrarPrestamo(PrestamoRequestDTO prestamoDTO) {
        Usuario usuario = usuarioRepository.findById(prestamoDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Libro libro = libroRepository.findById(prestamoDTO.getLibroId())
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        if (libro.getStock() <= 0) {
            throw new RuntimeException("No hay stock disponible para este libro");
        }

        // Decrementar stock
        libro.setStock(libro.getStock() - 1);
        libroRepository.save(libro);

        Prestamo prestamo = Prestamo.builder()
                .usuario(usuario)
                .libro(libro)
                .fechaPrestamo(LocalDateTime.now())
                .fechaDevolucionPrevista(LocalDate.now().plusDays(prestamoDTO.getDiasPrestamo()))
                .estado(EstadoPrestamo.ACTIVO)
                .build();

        Prestamo guardado = prestamoRepository.save(prestamo);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public PrestamoResponseDTO registrarDevolucion(Long prestamoId) {
        Prestamo prestamo = prestamoRepository.findById(prestamoId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        if (prestamo.getEstado() == EstadoPrestamo.DEVUELTO) {
            throw new RuntimeException("El préstamo ya fue devuelto");
        }

        prestamo.setEstado(EstadoPrestamo.DEVUELTO);
        // prestamo.setFechaDevolucionReal(LocalDate.now()); // Campo no existe

        // Aumentar stock libro
        Libro libro = prestamo.getLibro();
        libro.setStock(libro.getStock() + 1);
        libroRepository.save(libro);

        // Calcular Multa (Simulada si se pasara, usando fecha actual como real)
        LocalDate fechaDevolucionReal = LocalDate.now();
        if (fechaDevolucionReal.isAfter(prestamo.getFechaDevolucionPrevista())) {
            long diasRetraso = ChronoUnit.DAYS.between(prestamo.getFechaDevolucionPrevista(), fechaDevolucionReal);
            double montoMulta = diasRetraso * 50.0; // $50 por día

            Multa multa = Multa.builder()
                    .usuario(prestamo.getUsuario())
                    .prestamo(prestamo)
                    .monto(montoMulta)
                    .fechaGeneracion(fechaDevolucionReal)
                    .pagada(false)
                    .build();
            multaRepository.save(multa);
        }

        return mapToDTO(prestamoRepository.save(prestamo));
    }

    @Override
    public PrestamoResponseDTO obtenerPrestamoPorId(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        return mapToDTO(prestamo);
    }

    @Override
    public List<PrestamoResponseDTO> listarPrestamosPorUsuario(Long usuarioId) {
        // Si usuarioId es null podríamos listar todos? El requerimiento dice opcional
        // buscar por usuario.
        if (usuarioId == null) {
            return prestamoRepository.findAll().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }
        return prestamoRepository.findByUsuarioIdAndEstado(usuarioId, EstadoPrestamo.ACTIVO).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PrestamoResponseDTO mapToDTO(Prestamo prestamo) {
        return PrestamoResponseDTO.builder()
                .id(prestamo.getId())
                .usuarioNombre(prestamo.getUsuario().getNombre())
                .libroTitulo(prestamo.getLibro().getTitulo())
                .fechaPrestamo(prestamo.getFechaPrestamo())
                .fechaDevolucion(prestamo.getFechaDevolucionPrevista())
                .estado(prestamo.getEstado())
                .build();
    }
}
