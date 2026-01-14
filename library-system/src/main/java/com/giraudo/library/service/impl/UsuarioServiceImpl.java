package com.giraudo.library.service.impl;

import com.giraudo.library.dto.UsuarioRequestDTO;
import com.giraudo.library.dto.UsuarioResponseDTO;
import com.giraudo.library.model.Usuario;
import com.giraudo.library.repository.UsuarioRepository;
import com.giraudo.library.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO usuarioDTO) {
        // Validar permisos si el creador es EMPLEADO
        validarPermisosDeEscritura(formatRole(usuarioDTO.getRole()));

        if (usuarioRepository.findByEmail(usuarioDTO.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(usuarioDTO.getNombre())
                .email(usuarioDTO.getEmail())
                .password(passwordEncoder.encode(usuarioDTO.getPassword()))
                .fechaRegistro(LocalDate.now())
                .role(formatRole(usuarioDTO.getRole()))
                .build();

        Usuario guardado = usuarioRepository.save(usuario);
        return mapToDTO(guardado);
    }

    private void validarPermisosDeEscritura(String targetRole) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_EMPLEADO"))) {
            if (targetRole.equals("ROLE_ADMIN") || targetRole.equals("ROLE_EMPLEADO")) {
                throw new RuntimeException("No tienes permisos para crear o eliminar administradores ni empleados.");
            }
        }
    }

    private String formatRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            return "ROLE_USER";
        }
        role = role.toUpperCase().trim();
        if (!role.startsWith("ROLE_")) {
            return "ROLE_" + role;
        }
        return role;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        return mapToDTO(usuario);
    }

    @Override
    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioRequestDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar email duplicado si cambió
        if (!usuario.getEmail().equals(usuarioDTO.getEmail())
                && usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setEmail(usuarioDTO.getEmail());
        if (usuarioDTO.getPassword() != null && !usuarioDTO.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));
        }
        // Rol: Si se permite cambiar rol en el DTO
        // Por ahora asumimos que el rol viene en el DTO como String ROLE_USER etc.
        // O si no viene, no lo cambiamos.
        // Dado el DTO simple, asumimos update basico.

        return mapToDTO(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioResponseDTO obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mapToDTO(usuario);
    }

    @Override
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        validarPermisosDeEscritura(usuario.getRole());

        usuarioRepository.deleteById(id);
    }

    private UsuarioResponseDTO mapToDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .fechaRegistro(usuario.getFechaRegistro())
                .role(usuario.getRole())
                .build();
    }
}
