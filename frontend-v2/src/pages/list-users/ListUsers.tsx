import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ListUsersView } from "./ListUsers.view";
import type { User } from "../../types/index";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "lastName", label: "Apellido" },
  { key: "countryId", label: "DNI" },
  { key: "phone", label: "Teléfono" },
  { key: "emergencyPhone", label: "Emergencia" },
  { key: "expirement", label: "Vencimiento" },
  { key: "debtType", label: "Tipo Cuota" },
];

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch("http://localhost:7000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (search.trim() === "") {
      fetchUsers();
      return;
    }
    setLoading(true);
    fetch(
      `http://localhost:7000/api/users?search=${encodeURIComponent(search)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [search, fetchUsers]);

  const requestDelete = (id: string) => setPendingDeleteId(id);
  const cancelDelete = () => {
    if (deleting) return;
    setPendingDeleteId(null);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:7000/api/users/${pendingDeleteId}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (e) {
      console.error("Error eliminando usuario", e);
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <ListUsersView
      users={users}
      loading={loading}
      search={search}
      setSearch={setSearch}
      columns={columns}
      fetchUsers={fetchUsers}
      navigate={navigate}
      pendingDeleteId={pendingDeleteId}
      deleting={deleting}
      requestDelete={requestDelete}
      cancelDelete={cancelDelete}
      confirmDelete={confirmDelete}
    />
  );
}
