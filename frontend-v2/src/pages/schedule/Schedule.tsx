import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import ScheduleView from "./Schedule.view";
import type {
  ClassType,
  DayOfWeek,
  ScheduleEntry,
  TeacherType,
} from "../../types";
import { CLASS_TYPE_OPTIONS, DAYS_LABEL } from "../../types";

const Schedule: React.FC = () => {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: DayOfWeek;
    time: string;
  } | null>(null);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);

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
        Array.isArray((data as { teachers?: Partial<TeacherType>[] }).teachers)
      ) {
        list = (data as { teachers?: Partial<TeacherType>[] }).teachers || [];
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

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:7000/api/schedule");
      if (!res.ok) throw new Error("Error fetching schedule");
      const data = await res.json();
      if (data && Array.isArray(data.schedule))
        setEntries(data.schedule as ScheduleEntry[]);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
    fetchSchedule();
  }, [fetchTeachers, fetchSchedule]);

  const onSelectSlot = (day: DayOfWeek, time: string) => {
    setSelectedSlot({ day, time });
    setEditingEntry(null);
  };

  const onEditEntry = (id: string | number) => {
    const entry = entries.find((e: ScheduleEntry) => e.id === id) || null;
    setEditingEntry(entry);
    setSelectedSlot(null);
  };

  const onRemoveEntry = async (id: string | number) => {
    try {
      const res = await fetch(`http://localhost:7000/api/schedule/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting entry");
      setEntries((prev: ScheduleEntry[]) =>
        prev.filter((e: ScheduleEntry) => e.id !== id)
      );
      if (editingEntry?.id === id) setEditingEntry(null);
    } catch (e) {
      console.error(e);
    }
  };

  const onCancelEdit = () => {
    setSelectedSlot(null);
    setEditingEntry(null);
  };

  const onSave = useCallback(
    async (data: {
      id?: string | number;
      day: DayOfWeek;
      time: string;
      classType: ClassType;
      teacherId: string | number | null;
    }) => {
      try {
        const res = await fetch("http://localhost:7000/api/schedule", {
          method: data.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result?.error || "Error saving entry");
        setEntries((prev: ScheduleEntry[]) => {
          const idx = prev.findIndex((e: ScheduleEntry) => e.id === result.id);
          if (idx >= 0) {
            const clone = [...prev];
            clone[idx] = result;
            return clone;
          }
          const withoutSlot = prev.filter(
            (e: ScheduleEntry) =>
              !(e.day === result.day && e.time === result.time)
          );
          return [...withoutSlot, result];
        });
        setSelectedSlot(null);
        setEditingEntry(null);
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  const getEntry = useCallback(
    (day: DayOfWeek, time: string) =>
      entries.find((e: ScheduleEntry) => e.day === day && e.time === time),
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

  const { values, handleChange, handleSubmit } = useFormik({
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
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      getFullName={getFullName}
      getEntry={getEntry}
    />
  );
};

export default Schedule;
