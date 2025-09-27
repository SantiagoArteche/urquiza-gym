import { useEffect, useState } from "react";
import { ListUsersView } from "./ListUsers.view";
import type { User } from "../../types";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      fetchUsers();
    } else {
      fetch(`http://localhost:7000/api/users?search=${search}`)
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.users || []);
          setLoading(false);
        });
    }
  }, [search]);

  function fetchUsers() {
    setLoading(true);
    fetch("http://localhost:7000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }

  return (
    <ListUsersView
      users={users}
      loading={loading}
      search={search}
      setSearch={setSearch}
      columns={columns}
      fetchUsers={fetchUsers}
    />
  );
}
