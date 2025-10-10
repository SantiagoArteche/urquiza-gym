import type { ListUsersViewType } from "../../types";

export const ListUsersView = ({
  users,
  loading,
  search,
  setSearch,
  columns,
  navigate,
  pendingDeleteId,
  deleting,
  requestDelete,
  cancelDelete,
  confirmDelete,
}: ListUsersViewType) => {
  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td
            colSpan={columns.length + 1}
            className="text-center py-8 text-gray-400"
          >
            Cargando...
          </td>
        </tr>
      );
    }
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length + 1} className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No hay alumnos registrados
            </h3>
            <p className="text-gray-500">
              Comienza agregando tu primer alumno al gimnasio.
            </p>
          </td>
        </tr>
      );
    }

    const renderExpirement = (expirement: string) => {
      const invalidDateHtml = (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-900 text-red-200">
          N/A
        </span>
      );

      if (!expirement) return invalidDateHtml;

      const expiry = new Date(expirement);

      if (isNaN(expiry.getTime())) return invalidDateHtml;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiryEnd = new Date(expiry);
      expiryEnd.setHours(23, 59, 59, 999);

      const diffDays = Math.floor(
        (expiryEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      let expirementStyle = "bg-green-900 text-green-200";
      if (diffDays < 0) {
        expirementStyle = "bg-red-900 text-red-200";
      } else if (diffDays <= 7) {
        expirementStyle = "bg-yellow-900 text-yellow-200";
      }

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${expirementStyle}`}
        >
          {expirement || "N/A"}
        </span>
      );
    };

    return users.map((user) => (
      <tr
        key={user.id}
        className="hover:bg-gray-800 transition-colors duration-150"
      >
        {columns.map((col) => (
          <td
            key={col.key}
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
          >
            {col.key === "expirement"
              ? renderExpirement(user.expirement)
              : user[col.key as keyof typeof user] || ""}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button
            className="text-blue-400 hover:text-orange-500 transition-colors duration-200 cursor-pointer"
            onClick={() => navigate(`/edit-user/${user.id}`)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            className="text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer"
            onClick={() => user.id && requestDelete(String(user.id))}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <main className="w-full max-w-7xl mx-auto py-8 min-h-screen bg-gray-950 text-white">
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar alumno por nombre, apellido o DNI..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">{renderRows()}</tbody>
            </table>
          </div>
        </div>
      </main>
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
            <h2 className="text-lg font-semibold mb-2 text-white">
              Confirmar eliminación
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción eliminará el usuario de forma permanente. ¿Deseás
              continuar?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
