import { useFormik } from "formik";
import { useState } from "react";

import { CreateUserView } from "./CreateUser.view";

export default function CreateUser() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState({
    name: "",
    lastName: "",
    phone: "",
    countryId: "",
    emergencyPhone: "",
    expirement: "",
    debtType: "",
  });

  const { values, handleChange, handleSubmit, isSubmitting } = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      phone: "",
      countryId: "",
      emergencyPhone: "",
      expirement: "",
      debtType: "",
    },
    onSubmit: async (formValues, { resetForm }) => {
      try {
        const response = await fetch("http://localhost:7000/api/users", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(formValues),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === "Unique key already exists") {
            setErrorMessage(
              `El usuario con DNI ${errorData.uniqueKey} ya existe.`
            );
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
            return;
          } else {
            throw new Error("Error creating user");
          }
        } else {
          setSubmittedData(formValues);
          setShowSuccess(true);
        }

        resetForm();
      } catch {
        setErrorMessage("Error al crear el alumno. Intente nuevamente.");
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    },
  });

  return (
    <CreateUserView
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      showSuccess={showSuccess}
      showError={showError}
      errorMessage={errorMessage}
      setShowSuccess={setShowSuccess}
      submittedData={submittedData}
    />
  );
}
