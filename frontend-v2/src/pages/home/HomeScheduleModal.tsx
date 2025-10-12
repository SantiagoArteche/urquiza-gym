import React from "react";
import type { User, ScheduleEntry, TeacherType, DayOfWeek } from "../../types";
import {
  DAYS_LABEL,
  DEFAULT_TIME_SLOTS,
  MAX_CLASS_PARTICIPANTS,
} from "../../types";

type HomeScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  schedule: ScheduleEntry[];
  teachers: TeacherType[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  onJoin: (entryId: number | string) => Promise<void> | void;
  joiningEntryId: number | string | null;
  onLeave: (entryId: number | string) => Promise<void> | void;
  leavingEntryId: number | string | null;
  client: User;
  joinError: string;
  joinSuccess: string;
  leaveError: string;
  leaveSuccess: string;
};

const errorDictionary: Record<string, string> = {
  "Already joined": "Ya estás anotado en esta clase.",
  "Already joined another class for this day":
    "Solo podés anotarte a una clase por día.",
  "Entry not found": "No se encontró la clase seleccionada.",
  "Class is full": "La clase alcanzó el cupo máximo de participantes.",
  "Not joined": "No estás inscripto en esta clase.",
};

function translateError(message: string) {
  if (!message) return "";
  return errorDictionary[message] || message;
}

const HomeScheduleModal: React.FC<HomeScheduleModalProps> = ({
  open,
  onClose,
  schedule,
  teachers,
  loading,
  error,
  onRetry,
  onJoin,
  joiningEntryId,
  onLeave,
  leavingEntryId,
  client,
  joinError,
  joinSuccess,
  leaveError,
  leaveSuccess,
}) => {
  if (!open) return null;

  const userCountryId = client.countryId;
  const joinedEntries = schedule.filter(
    (entry) =>
      Array.isArray(entry.participants) &&
      entry.participants.includes(userCountryId)
  );
  const joinedDays = new Set(joinedEntries.map((entry) => entry.day));

  const days = Object.keys(DAYS_LABEL) as DayOfWeek[];

  const getEntry = (day: DayOfWeek, time: string) => {
    return schedule.find((entry) => entry.day === day && entry.time === time);
  };

  const findTeacher = (teacherId: string | number | null) =>
    teachers.find((teacher) => String(teacher.id) === String(teacherId));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 text-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <h3 className="text-2xl font-semibold">Horario de clases</h3>
            <p className="text-sm text-gray-400">
              Seleccioná una clase para anotarte. Recordá que solo podés
              inscribirte a una por día y cada clase tiene un cupo máximo de{" "}
              {MAX_CLASS_PARTICIPANTS} personas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)] space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between gap-4">
                  <span>{error}</span>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded"
                    onClick={onRetry}
                  >
                    Reintentar
                  </button>
                </div>
              )}
              {joinError && !error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                  {translateError(joinError)}
                </div>
              )}
              {leaveError && !error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                  {translateError(leaveError)}
                </div>
              )}
              {joinSuccess && !error && (
                <div className="bg-green-900/40 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                  {joinSuccess}
                </div>
              )}
              {leaveSuccess && !error && (
                <div className="bg-green-900/40 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                  {leaveSuccess}
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 border border-gray-700 bg-gray-900 sticky left-0 z-10 text-left">
                        Hora
                      </th>
                      {days.map((day) => (
                        <th
                          key={day}
                          className="p-2 border border-gray-700 bg-gray-900"
                        >
                          {DAYS_LABEL[day]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DEFAULT_TIME_SLOTS.map((time) => (
                      <tr key={time}>
                        <td className="p-2 border border-gray-800 bg-gray-900 font-semibold sticky left-0 z-10 w-20">
                          {time}
                        </td>
                        {days.map((day) => {
                          const entry = getEntry(day, time);
                          console.log(entry);
                          if (!entry) {
                            return (
                              <td
                                key={`${day}-${time}`}
                                className="border border-gray-800 h-20 bg-gray-950/60 text-gray-600 text-xs text-center align-middle"
                              >
                                Sin clase
                              </td>
                            );
                          }

                          const teacher = findTeacher(entry.teacherId);
                          const userJoined =
                            entry.participants.includes(userCountryId);
                          const joinedAnotherSameDay =
                            joinedDays.has(day) && !userJoined;
                          const isJoining = joiningEntryId === entry.id;
                          const isLeaving = leavingEntryId === entry.id;
                          const isFull =
                            entry.participants.length >= MAX_CLASS_PARTICIPANTS;
                          const disableJoin =
                            joinedAnotherSameDay ||
                            userJoined ||
                            isJoining ||
                            isLeaving ||
                            isFull;

                          let buttonLabel = "Anotarme";
                          if (userJoined) buttonLabel = "Ya estás anotado";
                          else if (joinedAnotherSameDay)
                            buttonLabel = "Ya te anotaste en otro horario";
                          else if (isFull) buttonLabel = "Cupo completo";
                          else if (isJoining) buttonLabel = "Anotando...";

                          const showJoinButton = !userJoined;
                          const showLeaveButton = userJoined;
                          const leaveButtonLabel = isLeaving
                            ? "Desanotando..."
                            : "Desanotarme";

                          let statusBadge: React.ReactNode = null;
                          if (isFull && !userJoined) {
                            statusBadge = (
                              <span className="text-red-400 font-semibold">
                                Cupo completo
                              </span>
                            );
                          } else if (userJoined) {
                            statusBadge = (
                              <span className="text-green-400 font-semibold">
                                Anotado
                              </span>
                            );
                          }

                          return (
                            <td
                              key={`${day}-${time}`}
                              className="border border-gray-800 h-24 p-2 align-top bg-gray-950/60"
                            >
                              <div className="flex flex-col gap-2 h-full">
                                <div>
                                  <p className="text-sm font-semibold uppercase text-orange-400 truncate">
                                    {entry.classType}
                                  </p>
                                  <p className="text-xs text-gray-300 truncate">
                                    {teacher
                                      ? `${teacher.name} ${teacher.lastName}`
                                      : "Sin profesor"}
                                  </p>
                                </div>
                                <div className="text-[11px] text-gray-300 flex items-center justify-between">
                                  <span className="bg-gray-800/70 border border-gray-700 rounded px-2 py-0.5">
                                    Inscritos: {entry.participants.length}/
                                    {MAX_CLASS_PARTICIPANTS}
                                  </span>
                                  {statusBadge}
                                </div>
                                <div className="mt-auto flex flex-col gap-2">
                                  {showJoinButton && (
                                    <button
                                      type="button"
                                      className={`w-full text-xs font-semibold px-3 py-2 rounded transition-colors ${
                                        disableJoin
                                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                          : "bg-blue-600 hover:bg-blue-700 text-white"
                                      }`}
                                      disabled={disableJoin}
                                      onClick={() => onJoin(entry.id)}
                                    >
                                      {buttonLabel}
                                    </button>
                                  )}
                                  {showLeaveButton && (
                                    <button
                                      type="button"
                                      className={`w-full text-xs font-semibold px-3 py-2 rounded transition-colors ${
                                        isLeaving
                                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                          : "bg-red-600 hover:bg-red-700 text-white"
                                      }`}
                                      disabled={isLeaving}
                                      onClick={() => onLeave(entry.id)}
                                    >
                                      {leaveButtonLabel}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScheduleModal;
