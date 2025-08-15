document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const dniInput = document.getElementById("dni");
    const clienteInfo = document.getElementById("clienteInfo");
    const alertaDni = document.getElementById("alertaDni");

    const nombreSpan = document.getElementById("nombre");
    const apellidoSpan = document.getElementById("apellido");
    const dniSpan = document.getElementById("dniCliente");
    const vencimientoSpan = document.getElementById("vencimiento");
    const tipoCuotaSpan = document.getElementById("tipoCuota");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const dniIngresado = dniInput.value.trim();
        const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
        const alumno = alumnos.find(a => a.dni === dniIngresado);

        if (alumno) {
            alertaDni.style.display = "none";
            clienteInfo.style.display = "block";

            nombreSpan.textContent = alumno.nombre;
            apellidoSpan.textContent = alumno.apellido;
            dniSpan.textContent = alumno.dni;
            vencimientoSpan.textContent = alumno.vencimiento;
            tipoCuotaSpan.textContent = alumno.tipoCuota;

            const fechaVencimiento = new Date(alumno.vencimiento);
            const fechaActual = new Date();
            if (fechaVencimiento >= fechaActual) {
                clienteInfo.style.backgroundColor = "rgba(0, 128, 0, 0.9)";
                clienteInfo.style.color = "white";
            } else {
                clienteInfo.style.backgroundColor = "red";
                clienteInfo.style.color = "white";
            }
        } else {
            clienteInfo.style.display = "none";
            alertaDni.style.display = "block";
            setTimeout(() => alertaDni.style.display = "none", 2500);
        }

        dniInput.value = "";
        dniInput.focus();
    });
});
