# 📚 Sistema de Gestión de Bibliotecas (Library System)

Bienvenido a **Library System**, una solución profesional y completa para la gestión eficiente de bibliotecas. Este proyecto Full-Stack implementa una arquitectura robusta, segura y escalable, diseñada para gestionar libros, autores, categorías, usuarios y préstamos con roles diferenciados.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg) ![Angular](https://img.shields.io/badge/Angular-17+-red.svg)

---

## ✨ Características Principales

*   **Gestión Documental**: CRUD completo para Libros, Autores y Categorías.
*   **Gestión de Préstamos**: Flujo completo de solicitud (Empleados) y estado de stock en tiempo real.
*   **Roles y Seguridad (RBAC)**:
    *   🛡️ **ADMIN**: Acceso total al sistema.
    *   👷 **EMPLEADO**: Gestión de préstamos y catálogos (sin permisos de administración de usuarios).
    *   👤 **USUARIO**: Catálogo de solo lectura y visualización de disponibilidad.
*   **UX/UI Premium**: Interfaz moderna, responsiva y estética construida con Angular, TailwindCSS y DaisyUI. Fallback inteligente de imágenes y modo oscuro elegante.
*   **Validaciones Robustas**: Control de stock automático, validaciones de formularios reactivos y manejo de errores centralizado.

---

## 🛠️ Stack Tecnológico

### Backend (API REST)
*   **Java 17**
*   **Spring Boot 3**: Framework principal.
*   **Spring Security + JWT**: Autenticación y autorización segura.
*   **Spring Data JPA (Hibernate)**: Persistencia de datos.
*   **H2 Database**: Base de datos en memoria (fácilmente migraable a MySQL/PostgreSQL).
*   **Maven**: Gestión de dependencias.

### Frontend (SPA)
*   **Angular 17+**: Framework reactivo basado en Signals.
*   **TailwindCSS**: Utilidades de estilo.
*   **DaisyUI**: Componentes UI modernos.
*   **Reactive Forms**: Manejo robusto de entradas de usuario.

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos
*   **Java JDK 17** o superior.
*   **Node.js 18** o superior (y npm).
*   **Git**.

### 1️⃣ Configuración del Backend

1.  Navega al directorio del backend:
    ```bash
    cd library-system
    ```
2.  Ejecuta la aplicación con Maven:
    ```bash
    ./mvnw spring-boot:run
    ```
    *El servidor iniciará en `http://localhost:8080`.*
    *(La base de datos se poblará automáticamente con datos de prueba gracias al `DataSeeder`).*

### 2️⃣ Configuración del Frontend

1.  Navega al directorio del frontend:
    ```bash
    cd library-frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm start
    ```
    *La aplicación estará disponible en `http://localhost:4200`.*

---

## 🔑 Credenciales de Acceso (Demo)

El sistema viene precargado con los siguientes usuarios para probar los diferentes roles:

| Rol | Email | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `bruno@libreria.com` | `admin123` | Control Total |
| **EMPLEADO** | `empleado@libreria.com` | `empleado123` | Gestión de Libros y Préstamos |
| **USUARIO** | `usuario@libreria.com` | `usuario123` | Ver Catálogo |

---

## 📂 Estructura del Proyecto

```
/
├── library-system/       # Código Fuente Backend (Spring Boot)
│   ├── src/main/java/    # Controladores, Servicios, Modelos, Repositorios
│   └── src/main/resources/ # Configuración (application.properties)
│
└── library-frontend/     # Código Fuente Frontend (Angular)
    ├── src/app/
    │   ├── components/   # Componentes reutilizables (Sidebar, Navbar)
    │   ├── pages/        # Vistas principales (Dashboard, Users, Books)
    │   ├── services/     # Comunicación con API (HTTP Client)
    │   └── guards/       # Protección de rutas (AuthGuard, RoleGuard)
```

---

## 🛡️ Notas Adicionales

*   **Imágenes**: El sistema utiliza URLs de imágenes. Si una imagen falla, el frontend tiene un sistema de fallback automático.
*   **Base de Datos**: Por defecto usa H2 (en memoria). Reiniciar el backend reseteará los datos a menos que cambies la configuración en `application.properties`.

---
⚡ *Desarrollado con pasión y altos estándares de calidad.*
