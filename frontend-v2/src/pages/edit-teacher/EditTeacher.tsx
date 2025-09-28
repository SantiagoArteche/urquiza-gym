import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditTeacherView } from "./EditTeacher.view";

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
  emergencyPhone: Yup.string().required("Tel. emergencia requerido"),
  assignedClasses: Yup.array().min(1, "Seleccione al menos una clase"),
});

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:7000/api/teachers/${id}`)
      .then((res) => res.json())
      .then((data) => setInitialValues(data));
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      name: "",
      lastName: "",
      phone: "",
      countryId: "",
      emergencyPhone: "",
      assignedClasses: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await fetch(`http://localhost:7000/api/teachers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        setShowSuccess(true);
        setTimeout(() => navigate("/list-teachers"), 1500);
      } catch {
        setErrorMessage("Error al editar el profesor. Intente nuevamente.");
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    },
  });

  return initialValues ? (
    <EditTeacherView
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      handleChange={formik.handleChange}
      handleSubmit={formik.handleSubmit}
      isSubmitting={formik.isSubmitting}
      showSuccess={showSuccess}
      showError={showError}
      errorMessage={errorMessage}
      setShowSuccess={setShowSuccess}
      classOptions={classOptions}
    />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      Cargando...
    </div>
  );
}
