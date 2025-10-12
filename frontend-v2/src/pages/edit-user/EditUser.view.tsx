import type { EditUserViewProps } from "../../types";

export default function EditUserView({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  error,
  navigate,
}: Readonly<EditUserViewProps>) {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans py-8">
      <div className="max-w-xl mx-auto py-8  bg-gray-900 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Editar alumno
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-800 p-6 rounded shadow"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Nombre
            </label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-900 text-white border-gray-700"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Apellido
            </label>
            <input
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-900 text-white border-gray-700"
              required
            />
          </div>
          <div>
            <label
              htmlFor="countryId"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              País
            </label>
            <input
              name="countryId"
              value={values.countryId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-900 text-white border-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Teléfono
            </label>
            <input
              name="phone"
              value={values.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-900 text-white border-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="emergencyPhone"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Teléfono de emergencia
            </label>
            <input
              name="emergencyPhone"
              value={values.emergencyPhone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-900 text-white border-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="expirement"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Vencimiento
            </label>
            <input
              name="expirement"
              value={values.expirement}
              onChange={handleChange}
              type="date"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="debtType"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Tipo de deuda
            </label>
            <select
              name="debtType"
              value={values.debtType}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
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
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              className="bg-red-500 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => navigate("/list-users")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
