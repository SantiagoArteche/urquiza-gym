import React from "react";
import type { ScheduleEntry, DayOfWeek, TeacherType } from "../../types";
import {
  CLASS_TYPE_OPTIONS,
  DAYS_LABEL,
  DEFAULT_TIME_SLOTS,
} from "../../types";

export interface ScheduleViewProps {
  teachers: { id?: number; name: string; lastName: string }[];
  onSelectSlot: (day: DayOfWeek, time: string) => void;
  onEditEntry: (id: string) => void;
  onRemoveEntry: (id: string) => void;
  selectedSlot?: { day: DayOfWeek; time: string } | null;
  editingEntry?: ScheduleEntry | null;
  onCancelEdit: () => void;
  currentDayLabel: string;
  currentTimeValue: string;
  values: { classType: string; teacherId: string };
  handleChange: React.ChangeEventHandler<HTMLSelectElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  getFullName: (t: TeacherType | undefined) => string;
  getEntry: (day: DayOfWeek, time: string) => ScheduleEntry | undefined;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
  teachers,
  onSelectSlot,
  onEditEntry,
  onRemoveEntry,
  selectedSlot,
  editingEntry,
  onCancelEdit,
  currentDayLabel,
  currentTimeValue,
  values,
  handleChange,
  handleSubmit,
  getFullName,
  getEntry,
}) => {
  return (
    <div className="p-4 mx-auto min-h-screen bg-gray-950">
      <h2 className="text-3xl font-bold mb-6 text-white">Horario Semanal</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm text-white">
          <thead>
            <tr>
              <th className="p-2 border border-gray-700 bg-gray-900 sticky left-0 z-10">
                Hora
              </th>
              {Object.entries(DAYS_LABEL).map(([dayKey, label]) => (
                <th
                  key={dayKey}
                  className="p-2 border border-gray-700 bg-gray-900"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEFAULT_TIME_SLOTS.map((time) => (
              <tr key={time}>
                <td className="p-2 border border-gray-700 bg-gray-900 font-semibold sticky left-0 z-10 w-20">
                  {time}
                </td>
                {Object.keys(DAYS_LABEL).map((day) => {
                  const entry = getEntry(day as DayOfWeek, time);
                  const teacher = teachers.find(
                    (t) => String(t.id) === String(entry?.teacherId)
                  );
                  return (
                    <td
                      key={day}
                      className="border border-gray-700 h-16 relative group cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() =>
                        entry
                          ? onEditEntry(entry.id)
                          : onSelectSlot(day as DayOfWeek, time)
                      }
                    >
                      {entry ? (
                        <div className="p-1 h-full flex flex-col justify-between">
                          <div className="flex flex-col items-center">
                            <p className="text-xs font-bold text-orange-400 truncate uppercase">
                              {entry.classType}
                            </p>
                            <p className="text-[10px] text-gray-300 truncate uppercase">
                              {getFullName(teacher as TeacherType | undefined)}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 justify-end text-[10px]">
                            <button
                              className="bg-red-600 hover:bg-red-700 px-1 rounded cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveEntry(entry.id);
                              }}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                          +
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(selectedSlot || editingEntry) && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={(e) => {
              if (e.target === e.currentTarget) onCancelEdit();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancelEdit();
            }}
          />
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md space-y-4 border border-gray-700 relative text-white">
            <h3 className="text-xl font-semibold">
              {editingEntry ? "Editar Clase" : "Agregar Clase"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="day" className="block text-sm mb-1">
                    Día
                  </label>
                  <input
                    id="day"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                    disabled
                    value={currentDayLabel}
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm mb-1">
                    Hora
                  </label>
                  <input
                    id="time"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                    disabled
                    value={currentTimeValue}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="classType" className="block text-sm mb-1">
                  Tipo de Clase
                </label>
                <select
                  id="classType"
                  name="classType"
                  value={values.classType}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-2 text-sm capitalize"
                >
                  <option value="" disabled>
                    Seleccionar tipo
                  </option>
                  {CLASS_TYPE_OPTIONS.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="teacherId" className="block text-sm mb-1">
                  Profesor
                </label>
                {teachers.length ? (
                  <select
                    id="teacherId"
                    name="teacherId"
                    value={values.teacherId}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-2 text-sm"
                  >
                    <option value="">-- Sin profesor --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.lastName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-gray-400 bg-gray-800 border border-gray-700 rounded px-2 py-2">
                    No hay profesores cargados todavía.
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                >
                  Cancelar
                </button>
                <div className="flex gap-2">
                  {editingEntry && (
                    <button
                      type="button"
                      onClick={() => onRemoveEntry(editingEntry.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!values.classType}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
