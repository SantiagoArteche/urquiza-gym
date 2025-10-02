import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ListTeachersView } from "./ListTeachers.view";
import type { TeacherType } from "../../types";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "lastName", label: "Apellido" },
  { key: "countryId", label: "DNI" },
  { key: "phone", label: "Teléfono" },
  { key: "emergencyPhone", label: "Emergencia" },
  { key: "assignedClasses", label: "Clases Asignadas" },
];

export default function ListTeachers() {
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchTeachers = useCallback(
    (currentSearch: string) => {
      setLoading(true);
      const trimmed = currentSearch.trim();
      const url = trimmed
        ? `http://localhost:7000/api/teachers?search=${encodeURIComponent(
            trimmed
          )}`
        : "http://localhost:7000/api/teachers";
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (currentSearch !== search) return;
          setTeachers(data.teachers || []);
        })
        .catch(() => {
          if (currentSearch !== search) return;
          setTeachers([]);
        })
        .finally(() => {
          if (currentSearch !== search) return;
          setLoading(false);
        });
    },
    [search]
  );

  useEffect(() => {
    fetchTeachers("");
  }, [fetchTeachers]);

  useEffect(() => {
    fetchTeachers(search);
  }, [search, fetchTeachers]);

  const requestDelete = (id: string) => setPendingDeleteId(id);
  const cancelDelete = () => {
    if (deleting) return;
    setPendingDeleteId(null);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:7000/api/teachers/${pendingDeleteId}`, {
        method: "DELETE",
      });
      fetchTeachers(search);
    } catch (e) {
      console.error("Error eliminando profesor", e);
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <ListTeachersView
      teachers={teachers}
      loading={loading}
      search={search}
      setSearch={setSearch}
      columns={columns}
      fetchTeachers={() => fetchTeachers(search)}
      navigate={navigate}
      pendingDeleteId={pendingDeleteId}
      deleting={deleting}
      requestDelete={requestDelete}
      cancelDelete={cancelDelete}
      confirmDelete={confirmDelete}
    />
  );
}
