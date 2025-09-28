tailwind.config.theme = {
  extend: {
    colors: {
      "gym-dark": "#0f0f0f",
      "gym-gray": "#1a1a1a",
      "gym-light-gray": "#2a2a2a",
      "gym-accent": "#ff6b35",
      "gym-blue": "#4a9eff",
      "gym-text": "#e5e5e5",
      "gym-text-muted": "#a0a0a0",
    },
  },
};

let userId = null;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  userId = urlParams.get("id");

  if (!userId) {
    alert("ID de usuario no encontrado");
    window.location.href = "index.html";
    return;
  }

  loadUserData(userId);

  const form = document.getElementById("editUserForm");
  form.addEventListener("submit", handleFormSubmit);
});

async function loadUserData(id) {
  try {
    const response = await fetch(`http://localhost:7000/api/users/${id}`);
    const data = await response.json();

    if (data) {
      const user = data;
      document.getElementById("name").value = user.name || "";
      document.getElementById("lastName").value = user.lastName || "";
      document.getElementById("countryId").value = user.countryId || "";
      document.getElementById("phone").value = user.phone || "";
      document.getElementById("emergencyPhone").value =
        user.emergencyPhone || "";
      document.getElementById("expirement").value = user.expirement || "";
      document.getElementById("debtType").value = user.debtType || "";
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    alert("Error al cargar los datos del usuario");
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const userData = {
    name: formData.get("name"),
    lastName: formData.get("lastName"),
    countryId: formData.get("countryId"),
    phone: formData.get("phone"),
    emergencyPhone: formData.get("emergencyPhone"),
    expirement: formData.get("expirement"),
    debtType: formData.get("debtType"),
  };

  try {
    const response = await fetch(`http://localhost:7000/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Usuario actualizado correctamente");
      window.location.href = "list.html";
    } else {
      alert(
        "Error al actualizar el usuario: " +
          (result.message || "Error desconocido")
      );
    }
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Error al actualizar el usuario");
  }
}
