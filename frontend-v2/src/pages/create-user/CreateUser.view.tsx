import { useNavigate } from "react-router-dom";
import type { CreateUserViewType } from "../../types";

export const CreateUserView = ({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  showSuccess,
  showError,
  errorMessage,
  setShowSuccess,
  submittedData,
}: CreateUserViewType) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <main className="w-full max-w-7xl mx-auto px-4 py-8 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 p-8 md:p-16 rounded-xl shadow-2xl space-y-8 w-full max-w-3xl bg-gray-900 border border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-x-12">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-200"
              >
                Nombre
              </label>
              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Ingrese nombre"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-gray-200"
              >
                Apellido
              </label>
              <input
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                placeholder="Ingrese apellido"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-200"
              >
                Teléfono
              </label>
              <input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="Ingrese teléfono"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="countryId"
                className="block text-sm font-semibold text-gray-200"
              >
                DNI
              </label>
              <input
                name="countryId"
                value={values.countryId}
                onChange={handleChange}
                placeholder="Ingrese DNI"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="emergencyPhone"
                className="block text-sm font-semibold text-gray-200"
              >
                Tel. Emergencia
              </label>
              <input
                name="emergencyPhone"
                value={values.emergencyPhone}
                onChange={handleChange}
                placeholder="Ingrese tel. emergencia"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="expirement"
                className="block text-sm font-semibold text-gray-200"
              >
                Vencimiento de la cuota
              </label>
              <input
                name="expirement"
                value={values.expirement}
                onChange={handleChange}
                type="date"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label
                htmlFor="debtType"
                className="block text-sm font-semibold text-gray-200"
              >
                Tipo de deuda
              </label>
              <select
                name="debtType"
                value={values.debtType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                <option value="">Seleccione tipo de deuda</option>
                <option value="Pilates Camilla">Pilates Camilla</option>
                <option value="Telas">Telas</option>
                <option value="Clases Grupales">Clases Grupales</option>
                <option value="Sala">Sala</option>
                <option value="Mixta">Mixta</option>
                <option value="Sala-Pilates">Sala-Pilates</option>
                <option value="Clases-Pilates">Clases-Pilates</option>
              </select>
            </div>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 font-semibold text-lg shadow-lg"
            >
              Guardar Alumno
            </button>
          </div>
        </form>
        {showSuccess && submittedData && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    ¡Cliente Creado!
                  </h3>
                </div>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowSuccess(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-center">
                  El alumno ha sido registrado exitosamente en el sistema.
                </p>
                <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nombre:</span>
                    <span className="text-white font-medium">
                      {submittedData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Apellido:</span>
                    <span className="text-white font-medium">
                      {submittedData.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Teléfono:</span>
                    <span className="text-white font-medium">
                      {submittedData.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">DNI:</span>
                    <span className="text-white font-medium">
                      {submittedData.countryId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tel. Emergencia:</span>
                    <span className="text-white font-medium">
                      {submittedData.emergencyPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Vencimiento de la cuota:
                    </span>
                    <span className="text-white font-medium">
                      {submittedData.expirement}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo de deuda:</span>
                    <span className="text-white font-medium">
                      {submittedData.debtType}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                    onClick={() => setShowSuccess(false)}
                  >
                    Crear Otro
                  </button>
                  <button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors font-medium text-center"
                    onClick={() => navigate("/list-users")}
                  >
                    Ver Listado
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showError && (
          <div className="mt-8 max-w-7xl mx-auto px-4">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg flex items-center space-x-4">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 9 0 11-18 0 9 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-lg">{errorMessage}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
