# Plan de Pruebas

Este plan cubre la estrategia de testing para el proyecto Gym Urquiza (API + Frontend).

## 1. Objetivos y alcance

- Validar funcionalidad de gestión de alumnos, profesores y horario.
- Verificar reglas de negocio de inscripción/desinscripción.
- Asegurar calidad de la interfaz, rendimiento básico y la integridad de datos.

Alcance:

- Backend (API REST): endpoints de users, teachers, schedule.
- Frontend (React): flujos de administración y home de alumnos.

No alcance:

- Pruebas de seguridad avanzadas (pentesting) y stress masivo.

## 2. Estrategia de pruebas

- Unitarias: funciones puras, servicios y utilidades del frontend; servicios de la API.
- Integración: controladores y repositorios con Mongo (o mocks); UI con componentes y fetch simulados.
- End-to-End (E2E): flujos críticos en navegador (Playwright/Cypress) contra una API de prueba.

## 3. Niveles y tipos

- Unit: Jest/Vitest en frontend; Jest/Supertest en API (servicios/hendpoints con mocks).
- Integration: Supertest para endpoints reales con DB de pruebas; React Testing Library para vistas con router.
- E2E: Playwright/Cypress cubriendo login por DNI, listar y CRUD de entidades, join/leave.
- Regresión: suites automatizadas tras cambios.

## 4. Ambientes

- Desarrollo: localhost (API en :7000, web Vite :5173).
- Pruebas: entorno aislado con base Mongo de staging.
- Datos: semillas controladas (usuarios, profesores, horario básico).

## 5. Datos de prueba

- Alumnos: DNIs válidos/ inválidos; con/ sin teléfono; expiración vacía/ pasada/ próxima.
- Profesores: combinaciones de clases asignadas.
- Horario: entradas sin profesor, con cupo completo, choca en mismo día/horario.

## 6. Criterios de entrada/salida

- Entrada: features completadas, endpoints estables, ambiente provisionado, datos semilla.
- Salida: 0 bloqueantes, 0 críticos, < 3 menores conocidos documentados; cobertura unitaria > 60% módulos clave.

## 7. Riesgos

- Dependencia externa de Mongo Atlas; latencia.
- Flujos de inscripción propensos a condiciones de carrera (join/leave simultáneo).
- Cambios de esquema.

## 8. Matriz de pruebas (resumen de casuística)

### API Users

- GET /users lista con y sin search → 200, shape { users: [] }
- GET /users/:id válido/ inválido → 200/400/404
- GET /users/country-id/:countryId existente/ inexistente → 200/404
- POST /users datos válidos → 201, conflicto countryId repetido → 409
- PUT /users/:id actualiza parcial/total → 200, inválido → 400/404
- DELETE /users/:id → 200/404

### API Teachers

- GET /teachers lista con/ sin search
- GET /teachers/:id → 200/400/404
- POST /teachers válido → 201; DNI repetido → 409
- PUT /teachers/:id → 200/400/404
- DELETE /teachers/:id → 200/404

### API Schedule

- GET /schedule → 200 [{ id, day, time, ... }]
- POST /schedule crea slot libre → 200; si existe (day,time) reemplaza → 200
- PUT /schedule con id existente → 200; choque (day,time) con otro id → 409
- DELETE /schedule/:id → 200/404
- POST /schedule/:id/join: ya unido → 409; clase llena → 409; otro horario mismo día → 409; ok → 200
- POST /schedule/:id/leave: no unido → 400; ok → 200

### Frontend Administración

- ListUsers: render columnas, búsqueda, navegación a edición, confirmación de borrado.
- CreateUser: validación, éxito, error conflicto DNI, mensaje de feedback.
- EditUser: carga inicial, edición, navegación de retorno.
- ListTeachers/ CreateTeacher/ EditTeacher: flujos análogos a usuarios.
- Schedule admin: crear/editar/ eliminar slots, validación HH:mm, colisiones (día+hora).

### Frontend Home (alumnos)

- Ingreso DNI válido/ inválido/ inexistente.
- Abrir horario, mostrar grilla, estado de cupos y botones.
- Unirse/Desanotarse con estados: ya anotado, cupo lleno, otra clase mismo día.

## 9. Pruebas automatizadas sugeridas (ejemplos)

- API: Supertest con seed; mocks de Mongo para unit (services).
- UI: React Testing Library para vistas; Playwright para E2E smoke.

## 10. Reporte y seguimiento

- Registrar casos, resultados y bugs en issues.
- Ejecutar CI en PRs con unit + integración.
