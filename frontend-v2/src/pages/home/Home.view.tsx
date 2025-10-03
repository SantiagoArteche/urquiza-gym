import type { HomeViewProps } from "../../types";

export default function HomeView({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  error,
  client,
  handleLogout,
}: HomeViewProps) {
  return (
    <div className="min-h-screen py-8 text-white bg-gray-950 flex items-center justify-center  font-sans">
      <div className="max-w-xl w-full mx-auto">
        <div className="bg-gray-900 from-gym-gray via-gym-dark to-gym-light-gray rounded-xl shadow-2xl p-10 border border-gym-light-gray">
          {!client ? (
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-green-600 from-gym-accent to-gym-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gym-text mb-3 tracking-tight drop-shadow-lg">
                Ingreso de Alumnos
              </h2>
              <p className="text-gym-text-muted text-lg mb-2">
                Ingresa tu DNI para acceder a tu información
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-gym-accent to-gym-blue rounded-full mx-auto mb-2"></div>
            </div>
          ) : (
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gym-text mb-3 tracking-tight drop-shadow-lg">
                Datos del Cliente
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-gym-accent to-gym-blue rounded-full mx-auto mb-2"></div>
            </div>
          )}
          {!client ? (
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="dni"
                  className="block text-base font-medium text-gym-text mb-3"
                >
                  Número de DNI
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="dni"
                    name="dni"
                    value={values.dni}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 text-lg bg-gym-light-gray border border-gym-light-gray rounded-lg focus:ring-2 focus:ring-gym-accent focus:border-transparent text-gym-text placeholder-gym-text-muted transition-all duration-200 shadow-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <svg
                      className="w-6 h-6 text-gym-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0V4a2 2 0 014 0v2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 from-gym-accent to-gym-blue hover:from-gym-blue hover:to-gym-accent text-white font-semibold py-4 px-8 text-lg rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-gym-accent focus:ring-offset-2 focus:ring-offset-gym-gray shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verificando..." : "Ingresar"}
              </button>
              {error && (
                <div className="mt-8 bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg flex items-center space-x-4 shadow-md">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-lg">{error}</span>
                </div>
              )}
            </form>
          ) : (
            <div
              id="clienteInfo"
              className="mt-10 bg-gym-gray rounded-xl shadow-2xl p-10 border border-gym-light-gray"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gym-light-gray">
                  <span className="text-gym-text-muted font-medium text-lg">
                    Nombre:
                  </span>
                  <span className="text-gym-text font-semibold text-lg">
                    {client.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gym-light-gray">
                  <span className="text-gym-text-muted font-medium text-lg">
                    Apellido:
                  </span>
                  <span className="text-gym-text font-semibold text-lg">
                    {client.lastName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gym-light-gray">
                  <span className="text-gym-text-muted font-medium text-lg">
                    DNI:
                  </span>
                  <span className="text-gym-text font-semibold text-lg">
                    {client.countryId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gym-light-gray">
                  <span className="text-gym-text-muted font-medium text-lg">
                    Vencimiento de cuota:
                  </span>
                  <span className="text-gym-text font-semibold text-lg">
                    {client.expirement
                      ? new Date(client.expirement).toLocaleDateString(
                          "es-ES",
                          { year: "numeric", month: "long", day: "numeric" }
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-gym-text-muted font-medium text-lg">
                    Tipo de cuota:
                  </span>
                  <span className="text-gym-accent font-semibold text-lg">
                    {client.debtType || "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-gym-light-gray">
                <button
                  className="w-full bg-orange-500 hover:bg-orange-600  text-gym-text hover:text-white font-semibold py-4 px-8 text-lg rounded-lg transition-all duration-200 shadow-lg"
                  onClick={handleLogout}
                >
                  Salir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
