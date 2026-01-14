package com.giraudo.library.service.impl;

import com.giraudo.library.config.JwtUtil;
import com.giraudo.library.dto.AuthRequestDTO;
import com.giraudo.library.dto.AuthResponseDTO;
import com.giraudo.library.dto.UsuarioRequestDTO;
import com.giraudo.library.dto.UsuarioResponseDTO;
import com.giraudo.library.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO login(AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        UserDetails user = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(user);
        return AuthResponseDTO.builder().token(token).build();
    }

    public UsuarioResponseDTO register(UsuarioRequestDTO request) {
        request.setRole("USER"); // Force USER role for public registration
        return usuarioService.crearUsuario(request);
    }
}
