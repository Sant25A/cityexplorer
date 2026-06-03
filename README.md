# 🌍 CityExplorer

Aplicación web para explorar, guardar y reseñar lugares de interés mediante una experiencia moderna e intuitiva.

<p align="center">
  <img src="docs/banner.png" alt="CityExplorer Banner" width="100%">
</p>

## Estado del proyecto

✅ Completado

### Funcionalidades implementadas

- Autenticación JWT
- Gestión de lugares
- Sistema de reseñas
- Favoritos
- Subida de imágenes
- Filtros y búsqueda
- Despliegue en producción

## Problema

Encontrar lugares interesantes suele requerir consultar múltiples fuentes y aplicaciones.

CityExplorer centraliza la exploración, almacenamiento y compartición de lugares de interés en una sola plataforma.

## Objetivos

- Permitir descubrir lugares de interés.
- Compartir experiencias mediante reseñas.
- Guardar lugares favoritos.
- Aplicar buenas prácticas de desarrollo Full Stack.
- Implementar una arquitectura cliente-servidor escalable.

## Tecnologías

### Frontend
- Angular
- TypeScript
- Tailwind CSS
- DaisyUI

### Backend
- Node.js
- Express.js

### Base de datos y almacenamiento
- MongoDB Atlas
- Cloudinary

### Despliegue
- Vercel
- Render

```mermaid
flowchart TD

A[Angular Frontend] --> B[Express API]

B --> C[(MongoDB Atlas)]

B --> D[Cloudinary]

E[Usuario] --> A
```

## Capturas

### Pantalla de inicio

<p align="center">
  <img src="docs/home.png" alt="CityExplorer Home" width="400">
</p>

### Explorar lugares

<p align="center">
  <img src="docs/places.png" alt="CityExplorer Places" width="400">
</p>

### Detalles de lugar

<p align="center">
  <img src="docs/place-detail.png" alt="CityExplorer PlaceDetail" width="400">
</p>

### Favoritos

<p align="center">
  <img src="docs/favorites.png" alt="CityExplorer Favorites" width="400">
</p>

### Creación de lugar

<p align="center">
  <img src="docs/create.png" alt="CityExplorer Creación de Lugar" width="400">
</p>

### Modo oscuro

<p align="center">
  <img src="docs/darkMode.png" alt="CityExplorer DarkMode" width="400">
</p>

## Características técnicas

### Seguridad

- JWT Authentication
- Hash de contraseñas con bcrypt
- Middleware de autorización
- Validación de datos
- Helmet
- Rate Limiting
- CORS restringido

### Backend

- API REST
- Arquitectura por capas
- Controladores
- Middleware personalizado

### Base de datos

- MongoDB Atlas
- Modelado con Mongoose

## Estructura del proyecto

frontend/angular-app

* src
* core
* features
* layout
* shared
* environments


backend

* controllers
* routes
* middleware
* models
* config
* utils


## Instalación

### Clonar repositorio

git clone ...

### Frontend

cd frontend
npm install
npm start

### Backend

cd backend
npm install
npm run dev


## Retos técnicos

Durante el desarrollo se abordaron desafíos como:

- Integración entre Angular y Express.
- Gestión segura de autenticación mediante JWT.
- Almacenamiento de imágenes con Cloudinary.
- Diseño de filtros dinámicos.
- Despliegue distribuido en Vercel y Render.

## Demo en producción

🌐 Aplicación:
https://cityexplorer-gamma.vercel.app/

### Usuario de prueba

Correo:
front@test.com

Contraseña:
Solicitar acceso o crear cuenta propia.