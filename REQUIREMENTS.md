# Requerimientos del Sistema

## 1. Funcionales

1. Gestión de alumnos (CRUD):
   - Crear, listar (con búsqueda), editar y eliminar alumnos.
   - Búsqueda por nombre, apellido o DNI.
   - Validar unicidad de DNI al crear (409).
   - Campos y validaciones:
     - Nombre (obligatorio, texto 1-100)
     - Apellido (obligatorio, texto 1-100)
     - DNI (obligatorio, único, alfanumérico 1-30)
     - Teléfono (obligatorio, 3-30)
     - Tel. Emergencia (opcional, 3-30)
     - Vencimiento (opcional, fecha válida o vacío)
     - Tipo de cuota (opcional, catálogo libre)
2. Gestión de profesores (CRUD):
   - Crear, listar, editar y eliminar.
   - Asignar clases que dicta cada profesor.
   - Validar unicidad de DNI al crear (409).
   - Campos y validaciones:
     - Nombre, Apellido, DNI, Teléfono, Tel. Emergencia (todos obligatorios salvo aclaración)
     - Clases asignadas: lista con al menos 1 opción seleccionada
3. Gestión de horario:
   - Crear/editar/eliminar entradas con día (lunes-viernes), hora (HH:mm), tipo de clase y profesor.
   - Reemplazar entrada cuando se crea un (día,hora) ya existente o retornar 409 al actualizar si colisiona.
   - Campos y validaciones:
     - Día: uno de {monday..friday}
     - Hora: formato HH:mm 24hs
     - Tipo de clase: uno de {camilla, telas, clases grupales, sala, pilates, mixta}
     - Profesor: id válido o null
   - Al guardar:
     - Crear: si existe (día,hora) se reemplaza esa entrada
     - Editar: si colisiona con otro id diferente → error
4. Inscripción de alumnos a clases:
   - Permitir inscribirse a una clase por día.
   - Limitar cupo por clase (10 participantes).
   - Permitir desinscribirse voluntariamente.
   - Errores esperados: "Already joined", "Already joined another class for this day", "Class is full", "Not joined".
5. Integración frontend-backend:

   - Frontend consume la API y muestra estados, errores de negocio y confirmaciones.
   - Campos de identificación expuestos como `id` (string) en todas las respuestas.
   - No exponer `_id` en UI.

6. Experiencia de usuario (UX):
   - Confirmaciones para eliminar.
   - Mensajes claros de error/éxito en alta/edición/inscripción.
   - Indicadores de carga en listas y horario.

## 2. No Funcionales

1. Rendimiento
   - Respuesta API < 500ms promedio en operaciones comunes (en entorno normal).
   - Listados paginables (offset/limit) a futuro.
2. Confiabilidad
   - Operaciones CRUD atómicas; datos consistentes.
   - Manejo de errores con códigos HTTP correctos.
3. Seguridad
   - No se exponen credenciales en cliente; variables .env server-side.
   - Validación básica de entradas (id válido, formatos, required).
4. Usabilidad
   - UI clara, feedback de carga y error.
   - Acciones con confirmación para eliminar.
5. Mantenibilidad
   - Código tipado con TypeScript.
   - Separación por capas: presentación, servicios, datos.
6. Portabilidad
   - Despliegue local con Node y MongoDB; compatible con Atlas.
7. Observabilidad
   - Log de errores en servidor con detalles mínimos para diagnóstico.
   - Mensajes de cliente sin exponer trazas técnicas.

## 3. Restricciones

- Días hábiles: lunes a viernes.
- Hora en formato 24h HH:mm.
- Cupo máximo por clase: 10.
- Identificación de alumnos por DNI único.
- Identificador expuesto en API/UI como `id` (string) persistido.

## 4. Supuestos

- El alumno conoce su DNI y no requiere autenticación con contraseña.
- Los administradores usan el frontend para todas las gestiones.
- Los profesores no interactúan directamente con el sistema (rol informativo).
