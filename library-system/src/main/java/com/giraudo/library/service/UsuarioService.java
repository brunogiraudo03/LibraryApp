package com.giraudo.library.service;

import com.giraudo.library.dto.UsuarioRequestDTO;
import com.giraudo.library.dto.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO crearUsuario(UsuarioRequestDTO usuarioDTO);

    List<UsuarioResponseDTO> listarUsuarios();

    UsuarioResponseDTO buscarPorEmail(String email);

    UsuarioResponseDTO actualizarUsuario(Long id, UsuarioRequestDTO usuarioDTO);

    UsuarioResponseDTO obtenerUsuarioPorId(Long id);

    void eliminarUsuario(Long id);
}
