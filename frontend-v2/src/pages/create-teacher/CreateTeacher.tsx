import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CreateTeacherView } from "./CreateTeacher.view";

const classOptions = [
  "Camilla",
  "Telas",
  "Clases Grupales",
  "Sala",
  "Pilates",
  "Mixta",
];

const validationSchema = Yup.object({
  name: Yup.string().required("Nombre requerido"),
  lastName: Yup.string().required("Apellido requerido"),
  phone: Yup.string().required("Teléfono requerido"),
  countryId: Yup.string().required("DNI requerido"),
  emergencyPhone: Yup.string(),
  assignedClasses: Yup.array().min(1, "Seleccione al menos una clase"),
});

export default function CreateTeacher() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    useFormik({
      initialValues: {
        name: "",
        lastName: "",
        phone: "",
        countryId: "",
        emergencyPhone: "",
        assignedClasses: [],
      },
      validationSchema,
      onSubmit: async (values, { resetForm, setSubmitting }) => {
        try {
          setSubmitting(true);
          const res = await fetch("http://localhost:7000/api/teachers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data?.error || "Error en la creación");
          }
          setSubmittedData(data.teacher);
          setShowSuccess(true);
          resetForm();
        } catch (e: unknown) {
          const message =
            e instanceof Error
              ? e.message
              : "Error al crear el profesor. Intente nuevamente.";

          if (message === "Unique key already exists")
            setErrorMessage("Ya existe un profesor con ese DNI");

          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        } finally {
          setSubmitting(false);
        }
      },
    });

  return (
    <CreateTeacherView
      values={values}
      errors={errors}
      touched={touched}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      showSuccess={showSuccess}
      showError={showError}
      errorMessage={errorMessage}
      setShowSuccess={setShowSuccess}
      submittedData={submittedData}
      classOptions={classOptions}
    />
  );
}
