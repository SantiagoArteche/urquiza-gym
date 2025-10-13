# Requerimientos del Sistema

## 1. Funcionales

1. Crear alumno

   - Debe permitir registrar un alumno con campos: Nombre (1-100), Apellido (1-100), DNI (1-30, único), Teléfono (3-30). Opcionales: Tel. Emergencia (3-30), Vencimiento (fecha válida o vacío), Tipo de cuota (libre).
   - Al guardar, si el DNI ya existe debe retornar conflicto (409) y no crear.

2. Listar y buscar alumnos

   - Debe mostrar un listado de alumnos.
   - Debe permitir buscar por nombre, apellido o DNI y filtrar los resultados.

3. Editar alumno

   - Debe permitir modificar los campos del alumno respetando las validaciones de formato y longitudes.

4. Eliminar alumno

   - Debe permitir eliminar un alumno previa confirmación.

5. Crear profesor

   - Debe permitir registrar un profesor con campos: Nombre, Apellido, DNI (único), Teléfono, Tel. Emergencia (todos obligatorios salvo aclaración) y Clases asignadas (al menos una opción).
   - Si el DNI ya existe debe retornar conflicto (409).

6. Listar y buscar profesores

   - Debe mostrar listado de profesores.
   - Debe permitir buscar por nombre, apellido o DNI y filtrar los resultados.

7. Editar profesor

   - Debe permitir modificar datos del profesor y la lista de clases asignadas (mínimo 1).

8. Eliminar profesor

   - Debe permitir eliminar un profesor previa confirmación.

9. Crear turno de clase (horario)

   - Debe permitir crear una entrada con: Día {monday..friday}, Hora (HH:mm), Tipo de clase {camilla, telas, clases grupales, sala, pilates, mixta}, Profesor (id válido o null).
   - Si al crear existe ya un (día, hora), el sistema puede reemplazar esa entrada existente.

10. Editar turno de clase (horario)

- Debe permitir modificar una entrada existente.
- Si al actualizar colisiona con otra entrada distinta (mismo día y hora, distinto id) debe retornar error (409).

11. Eliminar turno de clase (horario)

- Debe permitir eliminar una entrada del horario previa confirmación.

12. Listar horario

- Debe retornar la grilla de clases con sus campos (id, día, hora, tipo, profesor, participantes).

13. Inscribir alumno a una clase

- Debe permitir anotar un alumno (por DNI) en una clase si:
  - No superó el cupo máximo (10 participantes).
  - No está ya anotado en otra clase del mismo día.
- Errores esperados: "Already joined", "Already joined another class for this day", "Class is full".

14. Desinscribir alumno de una clase

- Debe permitir quitar al alumno de una clase en la que está inscripto.
- Error esperado si no estaba inscripto: "Not joined".

15. Integración frontend-backend

- El frontend consume la API y muestra estados, errores de negocio y confirmaciones.
- Las respuestas exponen `id` (string) como identificador. No se debe exponer `_id` en la UI.

16. Experiencia de usuario (UX)

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
