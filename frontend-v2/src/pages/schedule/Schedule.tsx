import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import ScheduleView from "./Schedule.view";
import type {
  ClassType,
  DayOfWeek,
  ScheduleEntry,
  TeacherType,
} from "../../types";
import { CLASS_TYPE_OPTIONS, DAYS_LABEL } from "../../types";

const LS_KEY = "schedule:v1";

const Schedule: React.FC = () => {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: DayOfWeek;
    time: string;
  } | null>(null);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ScheduleEntry[];
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch (e) {
      console.warn("Failed to parse schedule from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn("Failed to save schedule", e);
    }
  }, [entries]);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:7000/api/teachers");
      if (!res.ok) throw new Error("Error fetching teachers");
      const data = await res.json();
      let list: Partial<TeacherType>[] = [];
      if (Array.isArray(data)) list = data as Partial<TeacherType>[];
      else if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as { teachers?: unknown }).teachers)
      ) {
        list = (data as { teachers: Partial<TeacherType>[] }).teachers;
      }
      const normalized: TeacherType[] = list.map((t) => ({
        id: t.id,
        name: t.name || "",
        lastName: t.lastName || "",
        phone: t.phone || "",
        countryId: t.countryId || "",
        emergencyPhone: t.emergencyPhone || "",
        assignedClasses: t.assignedClasses || [],
      }));
      setTeachers(normalized);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const onSelectSlot = (day: DayOfWeek, time: string) => {
    setSelectedSlot({ day, time });
    setEditingEntry(null);
  };

  const onEditEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id) || null;
    setEditingEntry(entry);
    setSelectedSlot(null);
  };

  const onRemoveEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingEntry?.id === id) setEditingEntry(null);
  };

  const onCancelEdit = () => {
    setSelectedSlot(null);
    setEditingEntry(null);
  };

  const onSave = useCallback(
    (data: {
      id?: string;
      day: DayOfWeek;
      time: string;
      classType: ClassType;
      teacherId: string | number | null;
    }) => {
      setEntries((prev) => {
        if (data.id) {
          return prev.map((e) =>
            e.id === data.id ? { ...e, ...data, id: data.id } : e
          );
        }
        const id = crypto.randomUUID();
        return [
          ...prev.filter((e) => !(e.day === data.day && e.time === data.time)),
          {
            id,
            day: data.day,
            time: data.time,
            classType: data.classType,
            teacherId: data.teacherId,
          },
        ];
      });
      setSelectedSlot(null);
      setEditingEntry(null);
    },
    []
  );

  const getEntry = useCallback(
    (day: DayOfWeek, time: string) =>
      entries.find((e) => e.day === day && e.time === time),
    [entries]
  );

  let currentDayLabel = "";
  if (editingEntry) currentDayLabel = DAYS_LABEL[editingEntry.day];
  else if (selectedSlot) currentDayLabel = DAYS_LABEL[selectedSlot.day];

  let currentTimeValue = "";
  if (editingEntry) currentTimeValue = editingEntry.time;
  else if (selectedSlot) currentTimeValue = selectedSlot.time;

  const getFullName = (t: TeacherType | undefined) =>
    t ? `${t.name} ${t.lastName}` : "-";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      classType:
        editingEntry?.classType || (selectedSlot ? CLASS_TYPE_OPTIONS[0] : ""),
      teacherId: editingEntry?.teacherId ? String(editingEntry.teacherId) : "",
    },
    onSubmit: (values) => {
      if (!values.classType) return;
      const slot = editingEntry
        ? { day: editingEntry.day, time: editingEntry.time }
        : selectedSlot!;
      onSave({
        id: editingEntry?.id,
        day: slot.day,
        time: slot.time,
        classType: values.classType as ClassType,
        teacherId: values.teacherId || null,
      });
    },
  });

  return (
    <ScheduleView
      teachers={teachers}
      onSelectSlot={onSelectSlot}
      onEditEntry={onEditEntry}
      onRemoveEntry={onRemoveEntry}
      selectedSlot={selectedSlot}
      editingEntry={editingEntry}
      onCancelEdit={onCancelEdit}
      currentDayLabel={currentDayLabel}
      currentTimeValue={currentTimeValue}
      values={formik.values}
      handleChange={formik.handleChange}
      handleSubmit={formik.handleSubmit}
      getFullName={getFullName}
      getEntry={getEntry}
    />
  );
};

export default Schedule;
