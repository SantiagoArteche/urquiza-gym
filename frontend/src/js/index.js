const form = document.querySelector("#createUser");

function showForm() {
  if (form) {
    form.style.display = "block";
  }
}

function hideForm() {
  if (form) {
    form.style.display = "none";
  }
}

function showOverlay() {
  const overlay = document.querySelector(
    ".fixed.inset-0.bg-black.bg-opacity-50"
  );
  if (overlay) {
    overlay.classList.remove("hidden");
  }
}

function hideOverlay() {
  const overlay = document.querySelector(
    ".fixed.inset-0.bg-black.bg-opacity-50"
  );
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

function showSuccessModal(clientData) {
  const modal = document.getElementById("successModal");

  localStorage.setItem(
    "modalState",
    JSON.stringify({
      isVisible: true,
      clientData: clientData,
    })
  );

  document.getElementById(
    "modalNombre"
  ).textContent = `${clientData.name} ${clientData.lastName}`;
  document.getElementById("modalDni").textContent = clientData.countryId;
  document.getElementById("modalTipoCuota").textContent =
    clientData.debtType || "No especificado";

  hideForm();
  showOverlay();

  modal.classList.remove("hidden");

  document.body.style.overflow = "hidden";
}

function hideSuccessModal() {
  const modal = document.getElementById("successModal");
  modal.classList.add("hidden");

  showForm();
  hideOverlay();

  localStorage.removeItem("modalState");

  document.body.style.overflow = "auto";
}

function restoreModalState() {
  const savedState = localStorage.getItem("modalState");
  if (savedState) {
    try {
      const { isVisible, clientData } = JSON.parse(savedState);
      if (isVisible && clientData) {
        showSuccessModal(clientData);
        return true;
      }
    } catch (error) {
      console.error("Error restoring modal state:", error);
      localStorage.removeItem("modalState");
    }
  }
  return false;
}

async function getUsers() {
  const allUsers = await fetch("http://localhost:7000/api/users");
  return allUsers;
}

async function saveClient() {
  const formData = new FormData(form);
  const newClient = {
    name: formData.get("nombre"),
    lastName: formData.get("apellido"),
    countryId: formData.get("dni"),
    phone: formData.get("telefono"),
    emergencyPhone: formData.get("emergencia"),
    expirement: formData.get("vencimiento"),
    debtType: formData.get("tipoCuota"),
    lastModification: new Date().toISOString().split("T")[0],
  };

  if (!formData.get("dni").length) {
    showErrorAlert(`Valor de dni inválido`);
    return;
  }

  try {
    const response = await createUser(newClient);
    if (response.success) {
      showSuccessModal(newClient);
      form.reset();
    } else {
      if (response.error === "Unique key already exists") {
        showErrorAlert(`Ya existe un usuario con el dni ${response.uniqueKey}`);
        return;
      }

      showErrorAlert("No se pudo guardar el alumno.");
    }
  } catch (error) {
    console.error("Error:", error);
    showErrorAlert("Hubo un error al guardar el alumno.");
  }
}

async function createUser(client) {
  const response = await fetch("http://localhost:7000/api/users", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(client),
  });

  const data = await response.json();
  return data;
}

function showErrorAlert(message) {
  const alertaExito = document.getElementById("alertaExito");
  const alertaError = document.getElementById("alertaError");

  alertaExito.classList.add("hidden");

  document.getElementById("errorMessage").textContent = message;
  alertaError.classList.remove("hidden");

  alertaError.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  hideForm();
  showOverlay();

  const modalRestored = restoreModalState();

  if (!modalRestored) {
    showForm();
    hideOverlay();
  }

  const submitButton = document.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      saveClient();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  const closeModalBtn = document.getElementById("closeModal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", hideSuccessModal);
  }

  const createAnotherBtn = document.getElementById("createAnother");
  if (createAnotherBtn) {
    createAnotherBtn.addEventListener("click", () => {
      hideSuccessModal();
      const firstInput = form.querySelector('input[name="nombre"]');
      if (firstInput) firstInput.focus();
    });
  }

  const viewListBtn = document.getElementById("viewList");
  if (viewListBtn) {
    viewListBtn.addEventListener("click", () => {
      hideSuccessModal();
    });
  }

  const modal = document.getElementById("successModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideSuccessModal();
      }
    });
  }
});
