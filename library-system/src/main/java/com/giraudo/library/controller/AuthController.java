package com.giraudo.library.controller;

import com.giraudo.library.dto.AuthRequestDTO;
import com.giraudo.library.dto.AuthResponseDTO;
import com.giraudo.library.dto.UsuarioRequestDTO;
import com.giraudo.library.dto.UsuarioResponseDTO;
import com.giraudo.library.service.impl.AuthServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> register(@RequestBody UsuarioRequestDTO request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
