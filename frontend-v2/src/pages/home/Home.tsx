import { useState, useCallback } from "react";
import { useFormik } from "formik";
import HomeView from "./Home.view";
import HomeScheduleModal from "./HomeScheduleModal";
import type { User, ScheduleEntry, TeacherType } from "../../types";
import { DAYS_LABEL } from "../../types";

type RawScheduleEntry = Partial<ScheduleEntry> & {
  id?: number | string;
  participants?: unknown;
  teacherId?: string | number | null;
};

type RawTeacher = Partial<TeacherType>;

const DEFAULT_CLASS_TYPE: ScheduleEntry["classType"] = "camilla";
const DEFAULT_DAY: ScheduleEntry["day"] = "monday";

const normalizeScheduleEntries = (raw: unknown): ScheduleEntry[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry) => {
    const item = entry as RawScheduleEntry;

    const participants = Array.isArray(item.participants)
      ? item.participants.map((participant) => String(participant))
      : [];

    const teacherId =
      typeof item.teacherId === "number" || typeof item.teacherId === "string"
        ? item.teacherId
        : null;

    const rawId = item.id;

    return {
      id: rawId!,
      day: (item.day as ScheduleEntry["day"]) || DEFAULT_DAY,
      time: item.time || "00:00",
      classType:
        (item.classType as ScheduleEntry["classType"]) || DEFAULT_CLASS_TYPE,
      teacherId,
      participants,
    } satisfies ScheduleEntry;
  });
};

const normalizeTeachersList = (raw: unknown): TeacherType[] => {
  let list: RawTeacher[] = [];
  if (Array.isArray(raw)) list = raw as RawTeacher[];
  else if (
    raw &&
    typeof raw === "object" &&
    Array.isArray((raw as { teachers?: RawTeacher[] }).teachers)
  ) {
    list = (raw as { teachers?: RawTeacher[] }).teachers || [];
  }

  return list.map((teacher) => {
    const rawId = teacher.id;
    return {
      id: rawId,
      name: teacher?.name || "",
      lastName: teacher?.lastName || "",
      phone: teacher?.phone || "",
      countryId: teacher?.countryId || "",
      emergencyPhone: teacher?.emergencyPhone || "",
      assignedClasses: Array.isArray(teacher?.assignedClasses)
        ? teacher.assignedClasses.map((cls) => String(cls))
        : [],
    };
  });
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [client, setClient] = useState<User | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [joiningEntryId, setJoiningEntryId] = useState<number | string | null>(
    null
  );
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");
  const [leavingEntryId, setLeavingEntryId] = useState<number | string | null>(
    null
  );
  const [leaveError, setLeaveError] = useState("");
  const [leaveSuccess, setLeaveSuccess] = useState("");

  const { values, handleChange, handleSubmit, isSubmitting, resetForm } =
    useFormik({
      initialValues: {
        dni: "",
      },
      onSubmit: async (formValues) => {
        setError("");
        setLoading(true);
        setClient(null);
        try {
          const response = await fetch(
            `http://localhost:7000/api/users/country-id/${formValues.dni}`
          );
          const data = await response.json();
          setLoading(false);
          if (response.ok && data.id) {
            setClient(data);
          } else if (data.message === "User not found") {
            setError("DNI no encontrado. Verifica el número ingresado.");
          } else {
            setError("Error inesperado. Intenta nuevamente.");
          }
        } catch {
          setLoading(false);
          setError("Error de conexión. Intenta nuevamente.");
        }
      },
    });

  const loadScheduleData = useCallback(async () => {
    setScheduleLoading(true);
    setScheduleError("");
    setJoinError("");
    setJoinSuccess("");
    setLeaveError("");
    setLeaveSuccess("");
    setJoiningEntryId(null);
    setLeavingEntryId(null);
    try {
      const [scheduleRes, teachersRes] = await Promise.all([
        fetch("http://localhost:7000/api/schedule"),
        fetch("http://localhost:7000/api/teachers"),
      ]);

      const scheduleJson = await scheduleRes.json();
      const teachersJson = await teachersRes.json();

      if (!scheduleRes.ok) {
        throw new Error(scheduleJson?.error || "No se pudo cargar el horario.");
      }

      if (!teachersRes.ok) {
        throw new Error(
          teachersJson?.error || "No se pudo cargar la lista de profesores."
        );
      }

      const normalizedSchedule = normalizeScheduleEntries(
        scheduleJson.schedule
      );
      const normalizedTeachers = normalizeTeachersList(teachersJson);

      setScheduleEntries(normalizedSchedule);
      setTeachers(normalizedTeachers);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Ocurrió un error al cargar el horario.";
      setScheduleError(message);
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  const handleJoinClass = useCallback(
    async (entryId: number | string) => {
      if (!client) return;
      setJoinError("");
      setJoinSuccess("");
      setLeaveError("");
      setLeaveSuccess("");
      setJoiningEntryId(entryId);
      try {
        const response = await fetch(
          `http://localhost:7000/api/schedule/${entryId}/join`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ countryId: client.countryId }),
          }
        );
        const result = await response.json();
        if (!response.ok || (result && typeof result.error === "string")) {
          const message =
            result?.error || "No se pudo completar la inscripción.";
          throw new Error(message);
        }

        const updatedEntryRaw = result.entry as RawScheduleEntry;
        const [updatedEntry] = normalizeScheduleEntries([updatedEntryRaw]);

        setScheduleEntries((prev) => {
          const index = prev.findIndex((item) => item.id === updatedEntry.id);
          if (index === -1) return [...prev, updatedEntry];
          const clone = [...prev];
          clone[index] = updatedEntry;
          return clone;
        });

        setJoinSuccess(
          `Te anotaste en ${updatedEntry.classType} el ${
            DAYS_LABEL[updatedEntry.day]
          } a las ${updatedEntry.time} hs.`
        );
      } catch (joinErr) {
        const message =
          joinErr instanceof Error
            ? joinErr.message
            : "Error inesperado al inscribirte.";
        setJoinError(message);
      } finally {
        setJoiningEntryId(null);
      }
    },
    [client]
  );

  const handleLeaveClass = useCallback(
    async (entryId: number | string) => {
      if (!client) return;
      setJoinError("");
      setJoinSuccess("");
      setLeaveError("");
      setLeaveSuccess("");
      setLeavingEntryId(entryId);
      try {
        const response = await fetch(
          `http://localhost:7000/api/schedule/${entryId}/leave`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ countryId: client.countryId }),
          }
        );
        const result = await response.json();

        if (!response.ok || (result && typeof result.error === "string")) {
          const message =
            result?.error || "No se pudo completar la desinscripción.";
          throw new Error(message);
        }

        const updatedEntryRaw = result.entry as RawScheduleEntry;
        const [updatedEntry] = normalizeScheduleEntries([updatedEntryRaw]);

        setScheduleEntries((prev) => {
          const index = prev.findIndex((item) => item.id === updatedEntry.id);
          if (index === -1) return [...prev, updatedEntry];
          const clone = [...prev];
          clone[index] = updatedEntry;
          return clone;
        });

        setLeaveSuccess(
          `Te desanotaste de ${updatedEntry.classType} el ${
            DAYS_LABEL[updatedEntry.day]
          } a las ${updatedEntry.time} hs.`
        );
      } catch (leaveErr) {
        const message =
          leaveErr instanceof Error
            ? leaveErr.message
            : "Error inesperado al desinscribirte.";
        setLeaveError(message);
      } finally {
        setLeavingEntryId(null);
      }
    },
    [client]
  );

  const handleOpenSchedule = useCallback(() => {
    if (!client) return;
    setShowScheduleModal(true);
    loadScheduleData();
  }, [client, loadScheduleData]);

  const handleCloseSchedule = useCallback(() => {
    setShowScheduleModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    setClient(null);
    setError("");
    resetForm();
    setShowScheduleModal(false);
    setScheduleEntries([]);
    setTeachers([]);
    setScheduleError("");
    setJoinError("");
    setJoinSuccess("");
    setLeaveError("");
    setLeaveSuccess("");
    setJoiningEntryId(null);
    setLeavingEntryId(null);
  }, [resetForm]);

  return (
    <>
      <HomeView
        values={values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting || loading}
        error={error}
        client={client}
        handleLogout={handleLogout}
        onOpenSchedule={handleOpenSchedule}
        scheduleLoading={scheduleLoading}
      />
      {client && (
        <HomeScheduleModal
          open={showScheduleModal}
          onClose={handleCloseSchedule}
          schedule={scheduleEntries}
          teachers={teachers}
          loading={scheduleLoading}
          error={scheduleError}
          onRetry={loadScheduleData}
          onJoin={handleJoinClass}
          joiningEntryId={joiningEntryId}
          client={client}
          joinError={joinError}
          joinSuccess={joinSuccess}
          onLeave={handleLeaveClass}
          leavingEntryId={leavingEntryId}
          leaveError={leaveError}
          leaveSuccess={leaveSuccess}
        />
      )}
    </>
  );
}
