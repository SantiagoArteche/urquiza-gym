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

  // Populate modal with client data
  document.getElementById(
    "modalNombre"
  ).textContent = `${clientData.name} ${clientData.lastName}`;
  document.getElementById("modalDni").textContent = clientData.countryId;
  document.getElementById("modalTipoCuota").textContent =
    clientData.debtType || "No especificado";

  hideForm();
  showOverlay();

  // Show modal
  modal.classList.remove("hidden");

  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
}

function hideSuccessModal() {
  const modal = document.getElementById("successModal");
  modal.classList.add("hidden");

  showForm();
  hideOverlay();

  localStorage.removeItem("modalState");

  // Restore body scroll
  document.body.style.overflow = "auto";
}

function restoreModalState() {
  const savedState = localStorage.getItem("modalState");
  if (savedState) {
    try {
      const { isVisible, clientData } = JSON.parse(savedState);
      if (isVisible && clientData) {
        showSuccessModal(clientData);
        return true; // Return true if modal was restored
      }
    } catch (error) {
      console.error("Error restoring modal state:", error);
      localStorage.removeItem("modalState");
    }
  }
  return false; // Return false if no modal was restored
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

  try {
    const response = await createUser(newClient);
    if (response.success) {
      showSuccessModal(newClient);
      form.reset();
    } else {
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

  // Hide success alert if visible
  alertaExito.classList.add("hidden");

  // Update message and show error alert
  document.getElementById("errorMessage").textContent = message;
  alertaError.classList.remove("hidden");

  // Smooth scroll to alert
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

  const submitButton = document.querySelector('button[type="button"]');

  if (submitButton) {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      saveClient();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  // Close modal button
  const closeModalBtn = document.getElementById("closeModal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", hideSuccessModal);
  }

  // Create another client button
  const createAnotherBtn = document.getElementById("createAnother");
  if (createAnotherBtn) {
    createAnotherBtn.addEventListener("click", () => {
      hideSuccessModal();
      // Form is already reset, just focus on first input
      const firstInput = form.querySelector('input[name="nombre"]');
      if (firstInput) firstInput.focus();
    });
  }

  // View list button
  const viewListBtn = document.getElementById("viewList");
  if (viewListBtn) {
    viewListBtn.addEventListener("click", () => {
      hideSuccessModal();
    });
  }

  // Close modal when clicking outside
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideSuccessModal();
      }
    });
  }
});
