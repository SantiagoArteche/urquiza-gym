import { useState } from "react";
import { useFormik } from "formik";
import HomeView from "./Home.view";
import type { User } from "../../types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [client, setClient] = useState<User | null>(null);

  const { values, handleChange, handleSubmit, isSubmitting, resetForm } =
    useFormik({
      initialValues: {
        dni: "",
      },
      onSubmit: async (formValues) => {
        setError("");
        setLoading(true);
        setClient(null);
        try {
          const response = await fetch(
            `http://localhost:7000/api/users/country-id/${formValues.dni}`
          );
          const data = await response.json();
          setLoading(false);
          if (response.ok && data.id) {
            setClient(data);
          } else {
            setError("DNI no encontrado. Verifica el número ingresado.");
          }
        } catch {
          setLoading(false);
          setError("Error de conexión. Intenta nuevamente.");
        }
      },
    });

  const handleLogout = () => {
    setClient(null);
    setError("");
    resetForm();
  };

  return (
    <HomeView
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting || loading}
      error={error}
      client={client}
      handleLogout={handleLogout}
    />
  );
}
