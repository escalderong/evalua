# Curso + Estudiantes (NestJS + React)

Este proyecto implementa un sistema de gestión de curso y estudiantes, con un backend en **NestJS + TypeScript** y un frontend en **React + TypeScript**.  
Actualmente el backend está funcional (estoy terminando el front)

---

## Backend (NestJS)

### Tecnologías utilizadas
- **NestJS** como framework principal
- **PostgreSQL** con **TypeORM** para persistencia
- **class-validator** para validación de DTOs
- Arquitectura modular (módulo `Course` con controladores, servicios y entidades)
- **Interceptor/Filter** global para manejo consistente de errores

### Funcionalidad
- **Gestión del curso**  
  - `POST /course`: crea el curso (solo puede existir uno)  
  - `GET /course`: obtiene el curso y el índice de diversidad  
  - `PATCH /course`: actualiza el curso  
  - `DELETE /course`: elimina el curso y los estudiantes asociados  

- **Gestión de estudiantes**  
  - `POST /course/students`: añade un estudiante validando el cupo máximo  
  - `GET /course/students`: lista los estudiantes del curso  
  - `DELETE /course/students/:id`: elimina un estudiante del curso  

- **Índice de diversidad**  
  El backend calcula un índice en base a los dominios de email de los estudiantes: 
  dominios únicos / total estudiantes * 100

Este valor se devuelve en la respuesta de `GET /course`.

### Cómo correr el backend
### Docker
1. Asegúrate de tener **Docker** y **docker-compose** instalados.
2. En la raíz del backend, ejecutar:
   ```bash
   docker-compose up --build

tan pronto este completo el front, me asegurare de actualizar el docker-compose para incluir todo en un solo build