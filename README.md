# 📚 Sistema de Gestión de Bibliotecas (Library System)

> **Portfolio Project**: Una solución Full-Stack moderna diseñada para demostrar la implementación de arquitecturas escalables, seguridad robusta y UX de alto nivel.

![Angular](https://img.shields.io/badge/Angular-17%2B-dd0031?style=for-the-badge&logo=angular&logoColor=white) 
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6db33f?style=for-the-badge&logo=spring&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Security](https://img.shields.io/badge/Spring_Security-RBAC-green?style=for-the-badge)

---

## 👨‍💻 Sobre este Proyecto (Highlights Técnicos)

Este sistema fue construido con el objetivo de **resolver problemas reales de negocio** (gestión de inventario y préstamos) utilizando las mejores prácticas de la industria en 2024-2025.

### 🌟 Competencias Demostradas
*   **Arquitectura Limpia & Modular**: Separación estricta de responsabilidades (Controller-Service-Repository) en el Backend y componentes inteligentes/tontos en el Frontend.
*   **Modern Frontend con Angular 17+**:
    *   Uso extensivo de **Signals** para gestión de estado reactivo (fine-grained reactivity).
    *   **Control Flow Syntax** (`@if`, `@for`) para templates más limpios y performantes.
    *   Arquitectura basada en **Standalone Components**.
*   **Seguridad Empresarial**:
    *   Implementación de **JWT (JSON Web Tokens)** para autenticación stateless.
    *   **RBAC (Role-Based Access Control)** estricto: El sistema discrimina a nivel de endpoint y de UI qué puede hacer cada rol (Admin vs Empleado vs Usuario).
*   **UX/UI Design**:
    *   Interfaz sofisticada con **TailwindCSS** y **DaisyUI**.
    *   Feedback al usuario en tiempo real (Spinners de carga, validaciones reactivas, manejo de errores amigable).
    *   **Fallback Strategies**: Manejo robusto de errores de carga de imágenes (Directivas y eventos `onerror`).

---

## 📋 Casos de Uso Implementados (Business Logic)

El sistema soporta flujos de negocio completos que demuestran la interacción compleja entre entidades:

### 1. 🔄 Ciclo de Vida del Préstamo (Loan Lifecycle)
*   **Actor**: Empleado (Employee).
*   **Flujo**:
    1.  El empleado busca un libro para un usuario.
    2.  Verifica visualmente el badge de stock (Verde: Disponible / Rojo: Agotado).
    3.  Inicia la solicitud: Selecciona al usuario desde un dropdown dinámico y define los días.
    4.  **Confirmación**: Al guardar, el backend realiza una transacción atómica que:
        *   Crea el registro del préstamo.
        *   **Decrementa el stock** del libro automáticamente.
        *   Calcula la fecha de devolución esperada.

### 2. 🛡️ Administración de Catálogo Seguro
*   **Actor**: Administrador (Admin).
*   **Flujo**:
    1.  Gestión total de Libros, Autores y Categorías.
    2.  **Validaciones de Integridad**: El sistema impide eliminar un Autor si este tiene libros asociados, devolviendo errores descriptivos al frontend para guiar al usuario.
    3.  Carga de metadatos enriquecidos (URL de imagen, descripción, ISBN).

### 3. 🔍 Consulta Pública Reactiva
*   **Actor**: Usuario Final (User).
*   **Flujo**:
    1.  Acceso al Dashboard en modo "Solo Lectura".
    2.  Uso de filtros reactivos (Signals) para buscar libros por Categoría o Autor instantáneamente.
    3.  **Visualización**: Puede ver detalles pero los botones de acción (Editar/Prestar) están ocultos y protegidos a nivel de código.

---

## 🛠️ Stack Tecnológico Detallado

| Área | Tecnología | Uso/Patrón |
| :--- | :--- | :--- |
| **Backend** | **Java 17 + Spring Boot 3** | Core Framework |
| **Persistencia** | **Spring Data JPA (Hibernate)** | ORM & Repository Pattern |
| **Base de Datos** | **H2 (In-Memory)** | Demo / Testing (Migrable a MySQL) |
| **Seguridad** | **Spring Security 6** | Auth Filters & JWT Providers |
| **Frontend** | **Angular 17** | SPA Framework |
| **Estilos** | **TailwindCSS** | Utility-First CSS |
| **Cliente HTTP** | **HttpClient** | Consumo de API RESTful |
| **Control de Versiones** | **Git** | Workflow profesional |

---

## 🚀 Cómo Ejecutar el Proyecto

El proyecto está diseñado para levantarse en minutos ("Clone & Run").

### Prerrequisitos
*   Java JDK 17+
*   Node.js 18+

### 1️⃣ Backend (API)
```bash
cd library-system
./mvnw spring-boot:run
```
*El servidor inyectará datos de prueba automáticamente (`DataSeeder`) para que no arranques con la DB vacía.*

### 2️⃣ Frontend (Cliente)
```bash
cd library-frontend
npm install
npm start
```
Abrir navegador en: `http://localhost:4200`

---

## 🧪 Credenciales de Demo

Para ver la seguridad en acción, prueba estos usuarios precargados:

| Rol | Usuario (Email) | Contraseña | Capacidades |
| :--- | :--- | :--- | :--- |
| 🛡️ **ADMIN** | `bruno@libreria.com` | `admin123` | **Acceso Total**: Puede crear usuarios, editar todo y ver métricas. |
| 👷 **EMPLEADO** | `empleado@libreria.com` | `empleado123` | **Operativo**: Puede prestar libros y gestionar catálogo, pero no admin usuarios. |
| 👤 **USUARIO** | `usuario@libreria.com` | `usuario123` | **Lectura**: Solo puede ver el catálogo y disponibilidad. |

---

> *Este proyecto demuestra la pasión por la calidad de software, desde la arquitectura del backend hasta el pixel-perfect del frontend.*
> desarrollado por bruno giraudo
