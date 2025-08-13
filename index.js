const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tablaAlumnos");
const busqueda = document.getElementById("busqueda");
let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];

function convertirFecha(fecha) {
  if (fecha.includes("/")) {
    const [dd, mm, yyyy] = fecha.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return fecha;
}

function fechaAOrdenable(fecha) {
  const f = convertirFecha(fecha);
  return f.replace(/-/g, "");
}

function guardarAlumno(e) {
  e.preventDefault();
  const alumno = {
    nombre: document.getElementById("nombre").value.trim(),
    apellido: document.getElementById("apellido").value.trim(),
    dni: document.getElementById("dni").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    emergencia: document.getElementById("emergencia").value.trim(),
    vencimiento: convertirFecha(
      document.getElementById("vencimiento").value.trim()
    ),
    tipoCuota: document.getElementById("tipoCuota").value,
    ultimaModificacion: new Date().toISOString().split("T")[0],
  };

  let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
  const index = alumnos.findIndex((a) => a.dni === alumno.dni);
  if (index !== -1) {
    alumnos[index] = {
      ...alumno,
      ultimaModificacion: new Date().toISOString().split("T")[0],
    };
  } else {
    alumnos.push(alumno);
  }

  localStorage.setItem("alumnos", JSON.stringify(alumnos));
  formulario.reset();
  mostrarAlumnos();
}

function mostrarAlumnos(filtro = "") {
  alumnos.sort((a, b) =>
    fechaAOrdenable(a.vencimiento).localeCompare(fechaAOrdenable(b.vencimiento))
  );

  const filtrados = alumnos.filter((a) =>
    Object.values(a).some((valor) =>
      valor.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  tabla.innerHTML = "";
  filtrados.forEach((a) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td><input value="${a.nombre}" onchange="editarCampo('${
      a.dni
    }', 'nombre', this.value)"></td>
            <td><input value="${a.apellido}" onchange="editarCampo('${
      a.dni
    }', 'apellido', this.value)"></td>
            <td><input value="${a.dni}" onchange="editarCampo('${
      a.dni
    }', 'dni', this.value)"></td>
            <td><input value="${a.telefono}" onchange="editarCampo('${
      a.dni
    }', 'telefono', this.value)"></td>
            <td><input value="${a.emergencia}" onchange="editarCampo('${
      a.dni
    }', 'emergencia', this.value)"></td>
            <td><input type="date" value="${
              a.vencimiento
            }" onchange="editarCampo('${
      a.dni
    }', 'vencimiento', this.value)"></td>
            <td>
                <select onchange="editarCampo('${
                  a.dni
                }', 'tipoCuota', this.value)">
                    <option value="Pilates Camilla" ${
                      a.tipoCuota === "Pilates Camilla" ? "selected" : ""
                    }>Pilates Camilla</option>
                    <option value="Telas" ${
                      a.tipoCuota === "Telas" ? "selected" : ""
                    }>Telas</option>
                    <option value="Clases Grupales" ${
                      a.tipoCuota === "Clases Grupales" ? "selected" : ""
                    }>Clases Grupales</option>
                    <option value="Sala" ${
                      a.tipoCuota === "Sala" ? "selected" : ""
                    }>Sala</option>
                    <option value="Mixta" ${
                      a.tipoCuota === "Mixta" ? "selected" : ""
                    }>Mixta</option>
                    <option value="Sala-Pilates" ${
                      a.tipoCuota === "Sala-Pilates" ? "selected" : ""
                    }>Sala-Pilates</option>
                    <option value="clases-Pilates" ${
                      a.tipoCuota === "clases-Pilates" ? "selected" : ""
                    }>clases-Pilates</option>
                </select>
            </td>
            <td><button onclick="eliminarAlumno('${
              a.dni
            }')">Eliminar</button></td>
        `;
    tabla.appendChild(fila);
  });
}

function editarCampo(dniOriginal, campo, valor) {
  let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
  const index = alumnos.findIndex((a) => a.dni === dniOriginal);
  if (index !== -1) {
    if (campo === "vencimiento") valor = convertirFecha(valor);
    alumnos[index][campo] = valor;
    alumnos[index].ultimaModificacion = new Date().toISOString().split("T")[0];
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    mostrarAlumnos(busqueda.value);
  }
}

function eliminarAlumno(dni) {
  if (!confirm("¿Eliminar este alumno?")) return;
  let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
  alumnos = alumnos.filter((a) => a.dni !== dni);
  localStorage.setItem("alumnos", JSON.stringify(alumnos));
  mostrarAlumnos(busqueda.value);
}

function exportarBackup() {
  const alumnos = localStorage.getItem("alumnos");
  const blob = new Blob([alumnos], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup_alumnos.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        const convertidos = data.map((a) => ({
          ...a,
          vencimiento: convertirFecha(a.vencimiento),
          ultimaModificacion:
            a.ultimaModificacion || new Date().toISOString().split("T")[0],
        }));
        localStorage.setItem("alumnos", JSON.stringify(convertidos));
        mostrarAlumnos();
        alert("Datos importados correctamente.");
      } else {
        alert("Formato inválido.");
      }
    } catch {
      alert("Error al leer archivo.");
    }
  };
  reader.readAsText(file);
}

if (formulario) {
  formulario.addEventListener("submit", guardarAlumno);
}
if (busqueda) {
  busqueda.addEventListener("input", () => mostrarAlumnos(busqueda.value));
  mostrarAlumnos();
}
