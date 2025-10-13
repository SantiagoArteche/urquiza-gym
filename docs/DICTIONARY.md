# Diccionario de Datos

Este documento describe las entidades, campos, tipos, restricciones y relaciones del proyecto.

Convenciones:

- Tipo entre paréntesis (ej.: string, date, array<string>, number|null)
- Obligatorio (Sí/No)
- Formato o valores permitidos cuando aplique
- Default: valor por defecto

## Entidad: User (Alumno)

- id (string) — Obligatorio: Sí — Descripción: Identificador público persistido; copia de \_id de Mongo.
- name (string, 1-100) — Obligatorio: Sí — Nombre del alumno — Default: ""
- lastName (string, 1-100) — Obligatorio: Sí — Apellido — Default: ""
- phone (string, 3-30) — Obligatorio: Sí — Teléfono de contacto — Default: ""
- countryId (string, 1-30) — Obligatorio: Sí — DNI único — Default: ""
- emergencyPhone (string, 3-30) — Obligatorio: No — Teléfono de emergencia — Default: ""
- expirement (string|date) — Obligatorio: No — Vencimiento de cuota en formato "YYYY-MM-DD" (UI) — Default: ""
- debtType (string) — Obligatorio: No — Tipo de cuota (libre) — Default: ""

Índices y restricciones:

- countryId único a nivel de negocio (validado por servicio al crear)
- id indexado y único (persistido desde \_id)

## Entidad: Teacher (Profesor)

- id (string) — Obligatorio: Sí — Identificador público persistido.
- name (string, 1-100) — Obligatorio: Sí — Nombre — Default: ""
- lastName (string, 1-100) — Obligatorio: Sí — Apellido — Default: ""
- phone (string, 3-30) — Obligatorio: Sí — Teléfono — Default: ""
- countryId (string, 1-30) — Obligatorio: Sí — DNI único — Default: ""
- emergencyPhone (string, 3-30) — Obligatorio: No — Teléfono de emergencia — Default: ""
- assignedClasses (array<string>) — Obligatorio: Sí — Al menos una; valores sugeridos: ["Camilla","Telas","Clases Grupales","Sala","Pilates","Mixta"] — Default: []

Índices y restricciones:

- countryId único a nivel de negocio (validado al crear)
- id indexado y único

## Entidad: Schedule (Turno de clase)

- id (string) — Obligatorio: Sí — Identificador público persistido.
- day (string) — Obligatorio: Sí — Uno de: monday, tuesday, wednesday, thursday, friday
- time (string) — Obligatorio: Sí — Formato HH:mm (24hs)
- classType (string) — Obligatorio: Sí — Uno de: camilla, telas, clases grupales, sala, pilates, mixta
- teacherId (string|null) — Obligatorio: No — id del Teacher o null si sin profesor asignado
- participants (array<string>) — Obligatorio: No — Lista de DNIs (countryId) inscriptos — Default: []

Reglas y restricciones:

- Cupo máximo: 10 participantes (regla de negocio)
- Inscripción: 1 clase por día por alumno (regla de negocio)
- Creación de turno: si ya existe (day,time) puede reemplazar entrada (al crear) o fallar al editar si colisiona con otro id.

## Relaciones

- Schedule.teacherId → Teacher.id (0..1 a 1)
- Schedule.participants[] contiene User.countryId (0..N)

Notas:

- En UI y API, el campo de identificación expuesto es `id` (string). `_id` propio de Mongo no se expone.
- Los hooks de modelo garantizan que `id` persista el valor de `_id`.

## Ejemplos

```json
{
  "id": "66f9c6e8a6f...",
  "name": "Santiago",
  "lastName": "Arteche",
  "phone": "3413640110",
  "countryId": "411669582",
  "emergencyPhone": "34343",
  "expirement": "2025-10-30",
  "debtType": "Pilates Camilla"
}
```

```json
{
  "id": "66f9c7ab8bd...",
  "name": "Paula",
  "lastName": "Perez",
  "phone": "341...",
  "countryId": "40111222",
  "emergencyPhone": "341...",
  "assignedClasses": ["Camilla", "Telas"]
}
```

```json
{
  "id": "670012aa19...",
  "day": "tuesday",
  "time": "09:00",
  "classType": "pilates",
  "teacherId": "66f9c7ab8bd...",
  "participants": ["411669582", "40111222"]
}
```
