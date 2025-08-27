const loginForm = document.getElementById("loginForm");
const dniInput = document.getElementById("dni");
const alertaDni = document.getElementById("alertaDni");
const clienteInfo = document.getElementById("clienteInfo");
const cerrarSesionBtn = document.querySelector("#clienteInfo button");

const nombreElement = document.getElementById("nombre");
const apellidoElement = document.getElementById("apellido");
const dniClienteElement = document.getElementById("dniCliente");
const vencimientoElement = document.getElementById("vencimiento");
const tipoCuotaElement = document.getElementById("tipoCuota");

document.addEventListener("DOMContentLoaded", function () {
  loginForm.addEventListener("submit", handleLogin);
  cerrarSesionBtn.addEventListener("click", handleLogout);
});

async function handleLogin(e) {
  e.preventDefault();

  const countryId = dniInput.value.trim();

  if (!countryId) {
    showError("Por favor, ingresa tu DNI");
    return;
  }

  hideError();
  hideClientInfo();

  try {
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Verificando...";
    submitBtn.disabled = true;
    const response = await fetch(
      `http://localhost:7000/api/users/country-id/${countryId}`
    );

    const data = await response.json();

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (response.ok && data.id) {
      showClientInfo(data);
    } else {
      showError("DNI no encontrado. Verifica el número ingresado.");
    }
  } catch (error) {
    console.error("Login error:", error);

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Ingresar";
    submitBtn.disabled = false;

    showError("Error de conexión. Intenta nuevamente.");
  }
}

function showClientInfo(clientData) {
  nombreElement.textContent = clientData.name || "N/A";
  apellidoElement.textContent = clientData.lastName || "N/A";
  dniClienteElement.textContent = clientData.countryId || "N/A";
  vencimientoElement.textContent = formatDate(clientData.expirement) || "N/A";
  tipoCuotaElement.textContent = clientData.tipoCuota || "N/A";

  loginForm.parentElement.classList.add("hidden");
  clienteInfo.classList.remove("hidden");

  clienteInfo.scrollIntoView({ behavior: "smooth" });
}

function showError(message) {
  const alertText = alertaDni.querySelector("span");
  alertText.textContent = message;
  alertaDni.classList.remove("hidden");

  alertaDni.scrollIntoView({ behavior: "smooth" });
}

function hideError() {
  alertaDni.classList.add("hidden");
}

function hideClientInfo() {
  clienteInfo.classList.add("hidden");
}

function handleLogout() {
  dniInput.value = "";

  hideClientInfo();
  hideError();
  loginForm.parentElement.classList.remove("hidden");

  dniInput.focus();

  loginForm.scrollIntoView({ behavior: "smooth" });
}

function formatDate(dateString) {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
}
