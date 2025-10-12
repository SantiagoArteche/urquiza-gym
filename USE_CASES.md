# Casos de Uso

Este documento describe actores y casos de uso principales del sistema.

## Actores

- Administrador: gestiona alumnos, profesores y el horario.
- Profesor: figura asignable a clases; sin acceso directo al sistema.
- Alumno: se identifica por DNI para ver el horario y anotarse/retirarse.

## CU1 - Crear Alumno

- Actor: Administrador
- Precondiciones: Sesión de administración activa.
- Flujo principal:
  1. Abrir "Crear alumno".
  2. Completar: Nombre (obligatorio), Apellido (obligatorio), DNI (obligatorio y único), Teléfono (obligatorio), Tel. Emergencia (opcional), Vencimiento (opcional), Tipo de cuota (opcional).
  3. Guardar. Si el DNI existe, se informa el error.
- Alternos:
  - A1: DNI ya existente → error y no se guarda.
  - A2: Faltan campos obligatorios → mostrar mensajes de validación.
- Postcondiciones: Alumno creado y visible en el listado.

## CU2 - Editar Alumno

- Actor: Administrador
- Precondiciones: Alumno existente.
- Flujo principal:
  1. Abrir edición de un alumno desde el listado.
  2. Modificar campos necesarios.
  3. Guardar.
- Alternos:
  - A1: Formato de dato inválido → mostrar error.
- Postcondiciones: Datos actualizados y visibles en el listado.

## CU3 - Eliminar Alumno

- Actor: Administrador
- Precondiciones: Alumno existente.
- Flujo principal:
  1. En el listado, elegir "Eliminar".
  2. Confirmar en el modal.
- Alternos:
  - A1: Cancelar en el modal → no se elimina.
- Postcondiciones: Alumno eliminado del sistema.

## CU4 - Buscar/Listar Alumnos

- Actor: Administrador
- Precondiciones: Datos existentes.
- Flujo principal: Ingresar término (nombre, apellido o DNI) y ver los resultados filtrados.
- Postcondiciones: Lista filtrada.

## CU5 - Crear Profesor

- Actor: Administrador
- Precondiciones: Sesión de administración activa.
- Flujo principal:
  1. Abrir "Crear profesor".
  2. Completar: Nombre (obligatorio), Apellido (obligatorio), DNI (obligatorio y único), Teléfono (obligatorio), Tel. Emergencia (obligatorio), Clases asignadas (al menos una).
  3. Guardar.
- Alternos:
  - A1: DNI ya existente → no guarda.
  - A2: Sin clases asignadas → mostrar validación.
- Postcondiciones: Profesor creado.

## CU6 - Editar Profesor

- Actor: Administrador
- Precondiciones: Profesor existente.
- Flujo principal: Abrir edición, cambiar datos y/o clases asignadas, guardar.
- Alternos: Validaciones de datos.
- Postcondiciones: Datos actualizados.

## CU7 - Eliminar Profesor

- Actor: Administrador
- Precondiciones: Profesor existente.
- Flujo principal: Eliminar desde listado y confirmar en modal.
- Alternos: Cancelar.
- Postcondiciones: Profesor eliminado.

## CU8 - Buscar/Listar Profesores

- Actor: Administrador
- Flujo principal: Buscar por nombre, apellido o DNI y ver resultados.
- Postcondiciones: Lista filtrada.

## CU9 - Crear/Editar Turno (Horario)

- Actor: Administrador
- Precondiciones: Profesores y clases disponibles.
- Flujo principal:
  1. Elegir día (lunes a viernes) y hora (HH:mm).
  2. Seleccionar tipo de clase.
  3. Seleccionar profesor (opcional).
  4. Guardar para crear o actualizar.
- Alternos:
  - A1: Choque de (día, hora) con otra entrada → se informa error.
  - A2: Formato de hora inválido → error de validación.
- Postcondiciones: Turno creado/actualizado.

## CU10 - Eliminar Turno (Horario)

- Actor: Administrador
- Precondiciones: Turno existente.
- Flujo principal: Seleccionar turno y confirmar eliminación.
- Alternos: Cancelar.
- Postcondiciones: Turno eliminado.

## CU11 - Consultar horario e inscribirse a una clase

- Actor: Alumno
- Precondiciones: Alumno existente; DNI conocido.
- Flujo principal:
  1. Ingresar DNI.
  2. Abrir horario y visualizar grilla por días y horas.
  3. Seleccionar clase con cupo disponible.
  4. Confirmar inscripción.
- Alternos:
  - A1: DNI no encontrado.
  - A2: Clase con cupo completo.
  - A3: Ya inscripto a otra clase del mismo día.
- Postcondiciones: Alumno figura como participante.

## CU12 - Desinscribirse de una clase

- Actor: Alumno
- Precondiciones: Alumno inscripto en la clase.
- Flujo principal:
  1. Abrir horario.
  2. Seleccionar clase en la que está inscripto.
  3. Confirmar desinscripción.
- Alternos:
  - A1: No estaba inscripto (error informativo).
- Postcondiciones: Alumno removido de la lista de participantes.

## CU13 - Búsqueda y filtros (general)

- Actor: Administrador
- Precondiciones: Datos existentes.
- Flujo principal: Ingresar término por nombre, apellido o DNI y visualizar resultados.
- Postcondiciones: Lista filtrada correctamente.
