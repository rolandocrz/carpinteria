// Proteger ruta cuando no hay session
function protegerRuta() {
  const usuario = sessionStorage.getItem("usuario");
  if (!usuario) {
    window.location.href = "login.html";
  }
}

// Proteccion de ruta
if (document.body.classList.contains("protected")) {
  protegerRuta();
}

// Logia de cerrar sesion
document.addEventListener("DOMContentLoaded", () => {
  const cerrarSesionLink = document.querySelector(".nav-link__login");
  if (cerrarSesionLink) {
    cerrarSesionLink.addEventListener("click", (e) => {
      e.preventDefault(); // Evitar el comportamiento por defecto
      sessionStorage.clear(); // Limpiar la sesión
      window.location.href = "login.html"; // Redirigir al login
    });
  }
});

// // Logia de inicio sesion (formulario)
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombreUsuario = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (nombreUsuario === "" || password === "") {
    mostrarMensaje("Por favor, complete todos los campos.");
    return;
  }

  if (nombreUsuario === "admin" && password === "admin") {
    sessionStorage.setItem("usuario", nombreUsuario);
    mostrarMensaje("Inicio de sesión exitoso. Redirigiendo...");
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  } else {
    mostrarMensaje("Usuario o contraseña incorrectos.");
  }
});

// Mostrar mensajes en el login
function mostrarMensaje(mensaje) {
  const mensajeDiv = document.getElementById("loginMessage");
  if (mensajeDiv) {
    mensajeDiv.textContent = mensaje;
    mensajeDiv.classList.add("text-danger");
  }
}
