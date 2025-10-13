import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import EditUserView from "./EditUser.view";

const initialState = {
  name: "",
  lastName: "",
  countryId: "",
  phone: "",
  emergencyPhone: "",
  expirement: "",
  debtType: "",
};

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { values, handleChange, handleSubmit, isSubmitting, setValues } =
    useFormik({
      initialValues: initialState,
      enableReinitialize: true,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:7000/api/users/${id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
          const result = await response.json();
          if (response.ok) {
            navigate("/list-users");
          } else {
            if (result.message === "Unique key already exists") {
              setError(`Ya existe un usuario con el DNI ${values.countryId}`);
            } else {
              setError("Error desconocido al actualizar el usuario");
            }
          }
        } catch {
          setError("Error desconocido al actualizar el usuario");
        } finally {
          setLoading(false);
        }
      },
    });

  useEffect(() => {
    if (!id) {
      setError("ID de usuario no encontrado");
      navigate("/");
      return;
    }
    fetch(`http://localhost:7000/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setValues({
          name: data.name || "",
          lastName: data.lastName || "",
          countryId: data.countryId || "",
          phone: data.phone || "",
          emergencyPhone: data.emergencyPhone || "",
          expirement: data.expirement || "",
          debtType: data.debtType || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar los datos del usuario");
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Cargando...</div>;
  }

  return (
    <EditUserView
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      navigate={navigate}
    />
  );
}
