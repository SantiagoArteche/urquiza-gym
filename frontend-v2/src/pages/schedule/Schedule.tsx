import React, { useCallback, useEffect, useState } from "react";
import ScheduleView from "./Schedule.view";
import type { ClassType, DayOfWeek, ScheduleEntry } from "../../types";

interface TeacherLite {
  id?: number;
  name: string;
  lastName: string;
}

const LS_KEY = "schedule:v1";

const Schedule: React.FC = () => {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [teachers, setTeachers] = useState<TeacherLite[]>([]);
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
      console.warn(data);
      setTeachers(data.teachers || []);
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

  const onSave = (data: {
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
  };

  return (
    <ScheduleView
      entries={entries}
      teachers={teachers}
      onSelectSlot={onSelectSlot}
      onEditEntry={onEditEntry}
      onRemoveEntry={onRemoveEntry}
      selectedSlot={selectedSlot}
      editingEntry={editingEntry}
      onCancelEdit={onCancelEdit}
      onSave={onSave}
    />
  );
};

export default Schedule;
