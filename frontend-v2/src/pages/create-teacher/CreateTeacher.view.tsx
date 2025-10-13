import { useNavigate } from "react-router-dom";
import type { CreateTeacherViewType } from "../../types";

export const CreateTeacherView = ({
  values,
  errors,
  touched,
  handleChange,
  handleSubmit,
  isSubmitting,
  showSuccess,
  showError,
  errorMessage,
  setShowSuccess,
  submittedData,
  classOptions,
}: CreateTeacherViewType) => {
  const navigate = useNavigate();

  const updateAssigned = (next: string[]) => {
    handleChange({
      target: { name: "assignedClasses", value: next },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <main className="w-full max-w-3xl mx-auto px-4 py-8 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 p-8 rounded-xl shadow-2xl space-y-8 w-full bg-gray-900 border border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              {touched.name && errors.name && (
                <div className="text-red-500 text-xs">{errors.name}</div>
              )}
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
                placeholder="Ingrese apellido"
                value={values.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              {touched.lastName && errors.lastName && (
                <div className="text-red-500 text-xs">{errors.lastName}</div>
              )}
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
                placeholder="Ingrese teléfono"
                value={values.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              {touched.phone && errors.phone && (
                <div className="text-red-500 text-xs">{errors.phone}</div>
              )}
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
                placeholder="Ingrese DNI"
                value={values.countryId}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              {touched.countryId && errors.countryId && (
                <div className="text-red-500 text-xs">{errors.countryId}</div>
              )}
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
                placeholder="Ingrese tel. emergencia"
                value={values.emergencyPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              {touched.emergencyPhone && errors.emergencyPhone && (
                <div className="text-red-500 text-xs">
                  {errors.emergencyPhone}
                </div>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-200">
                Clases asignadas
              </label>
              <div className="flex flex-wrap gap-2">
                {classOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="assignedClasses"
                      value={option}
                      checked={values.assignedClasses.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateAssigned([...values.assignedClasses, option]);
                        } else {
                          updateAssigned(
                            values.assignedClasses.filter((c) => c !== option)
                          );
                        }
                      }}
                      className="form-checkbox h-4 w-4 text-orange-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {touched.assignedClasses && errors.assignedClasses && (
                <div className="text-red-500 text-xs">
                  {errors.assignedClasses}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-8 rounded-lg font-semibold text-lg shadow-lg"
            >
              Guardar Profesor
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
                    ¡Profesor Creado!
                  </h3>
                </div>
                <button
                  className="text-gray-400 hover:text-white"
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
                  El profesor ha sido registrado exitosamente.
                </p>
                <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white font-medium">
                      {submittedData.id}
                    </span>
                  </div>
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
                    <span className="text-gray-400">Clases asignadas:</span>
                    <span className="text-white font-medium">
                      {submittedData.assignedClasses.join(", ")}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg"
                    onClick={() => setShowSuccess(false)}
                  >
                    Crear Otro
                  </button>
                  <button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg"
                    onClick={() => navigate("/list-teachers")}
                  >
                    Ver Listado
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showError && (
          <div className="mt-8 max-w-3xl mx-auto px-4">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg flex items-center space-x-4">
              <span className="text-lg">{errorMessage}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
