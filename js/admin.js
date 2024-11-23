// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref as refS,
  set,
  child,
  get,
  onValue,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-8Bhrz7RWx6qr5dyRFNDZIlpZCoUFwAs",
  authDomain: "proyectowebfinal-bd576.firebaseapp.com",
  databaseURL: "https://proyectowebfinal-bd576-default-rtdb.firebaseio.com",
  projectId: "proyectowebfinal-bd576",
  storageBucket: "proyectowebfinal-bd576.appspot.com",
  messagingSenderId: "218811954723",
  appId: "1:218811954723:web:899ffdcea391a4bbeba396",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage();

const imageInput = document.getElementById("imagenInput");
const uploadButton = document.getElementById("btnSubir");
const progressDiv = document.getElementById("progreso");
const txtUrlInput = document.getElementById("txtUrl");

let idMueble = "";
let nombre = "";
let descripcion = "";
let categoria = "";
let precio = 0.0;
let urlImag = "";

function leerInputs() {
  idMueble = document.getElementById("txtIdMueble").value.trim();
  nombre = document.getElementById("txtNombre").value.trim();
  descripcion = document.getElementById("txtDescripcion").value.trim();
  categoria = document.getElementById("txtCategoria").value;
  const precioInput = document.getElementById("txtPrecio").value;
  precio = precioInput ? parseFloat(precioInput) : NaN;
  urlImag = document.getElementById("txtUrl").value;
}

function mostrarMensaje(mensaje) {
  const mensajeElement = document.getElementById("mensaje");
  mensajeElement.textContent = mensaje;
  setTimeout(() => {
    mensajeElement.textContent = "";
  }, 2000);
}

function limpiarInputs() {
  document.getElementById("txtIdMueble").value = "";
  document.getElementById("txtNombre").value = "";
  document.getElementById("txtDescripcion").value = "";
  document.getElementById("txtPrecio").value = "";
  document.getElementById("txtUrl").value = "";
  document.getElementById("imagenInput").value = "";
}

function escribirInputs() {
  document.getElementById("txtIdMueble").value = idMueble;
  document.getElementById("txtNombre").value = nombre;
  document.getElementById("txtDescripcion").value = descripcion;
  document.getElementById("txtCategoria").value = categoria;
  document.getElementById("txtPrecio").value = precio;
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btnAgregar")
    .addEventListener("click", insertarMueble);
  document.getElementById("btnBuscar").addEventListener("click", buscarMueble);
  document
    .getElementById("btnActualizar")
    .addEventListener("click", actualizarMueble);
  document.getElementById("btnBorrar").addEventListener("click", borrarMueble);
  listarMuebles();
});

function insertarMueble() {
  leerInputs();
  if (
    nombre === "" ||
    descripcion === "" ||
    idMueble === "" ||
    isNaN(precio) ||
    urlImag === ""
  ) {
    mostrarMensaje("Faltaron datos por capturar");
    return;
  }

  // Verificar si el ID del mueble ya existe
  const dbref = refS(db);
  get(child(dbref, "Muebles/" + idMueble))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Si el mueble ya existe
        alert("El ID del mueble ya existe. Ingresa otro ID.");
      } else {
        // Si no existe, agregar el mueble
        const nuevoMueble = {
          idMueble: idMueble,
          nombre: nombre,
          descripcion: descripcion,
          categoria: categoria,
          precio: precio,
          urlImag: urlImag,
        };

        set(refS(db, "Muebles/" + idMueble), nuevoMueble)
          .then(() => {
            mostrarMensaje("Se agregó con éxito");
            limpiarInputs();
            listarMuebles();
          })
          .catch((error) => {
            console.error("Error al agregar el mueble:", error);
            mostrarMensaje("Ocurrió un error al agregar el mueble");
          });
      }
    })
    .catch((error) => {
      console.error("Error al verificar el ID del mueble:", error);
      mostrarMensaje("Ocurrió un error al verificar el ID del mueble");
    });
}

function buscarMueble() {
  const numMueble = document.getElementById("txtIdMueble").value.trim();
  if (numMueble === "") {
    mostrarMensaje("No se ingresó el ID del mueble");
    return;
  }

  const dbref = refS(db);
  get(child(dbref, "Muebles/" + numMueble))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        idMueble = data.idMueble;
        nombre = data.nombre;
        descripcion = data.descripcion;
        categoria = data.categoria;
        precio = data.precio;
        txtUrlInput.value = data.urlImag || "";
        escribirInputs();
      } else {
        limpiarInputs();
        mostrarMensaje("El mueble con ID " + numMueble + " no existe.");
      }
    })
    .catch((error) => {
      console.error("Error al buscar el mueble:", error);
      mostrarMensaje("Ocurrió un error al buscar el mueble");
    });
}

function listarMuebles() {
  const dbref = refS(db, "Muebles");
  const tabla = document.getElementById("tabla-muebles");
  const tbody = tabla.querySelector("tbody") || document.createElement("tbody");
  tbody.innerHTML = "";

  onValue(
    dbref,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const fila = document.createElement("tr");

        const celdaId = document.createElement("td");
        celdaId.textContent = data.idMueble;
        fila.appendChild(celdaId);

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = data.nombre;
        fila.appendChild(celdaNombre);

        const celdaDescripcion = document.createElement("td");
        celdaDescripcion.textContent = data.descripcion;
        fila.appendChild(celdaDescripcion);

        const celdaCategoria = document.createElement("td");
        celdaCategoria.textContent = data.categoria;
        fila.appendChild(celdaCategoria);

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = data.precio;
        fila.appendChild(celdaPrecio);

        const celdaImagen = document.createElement("td");
        const imagen = document.createElement("img");
        imagen.src = data.urlImag;
        imagen.width = 100;
        celdaImagen.appendChild(imagen);
        fila.appendChild(celdaImagen);

        tbody.appendChild(fila);
      });
      tabla.appendChild(tbody);
    },
    { onlyOnce: true }
  );
}

function actualizarMueble() {
  leerInputs();
  if (nombre === "" || descripcion === "" || idMueble === "" || isNaN(precio)) {
    mostrarMensaje("Faltaron datos por capturar");
    return;
  }
  update(refS(db, "Muebles/" + idMueble), {
    idMueble: idMueble,
    nombre: nombre,
    descripcion: descripcion,
    categoria: categoria,
    precio: precio,
    urlImag: txtUrlInput.value,
  })
    .then(() => {
      mostrarMensaje("Se actualizó con éxito");
      limpiarInputs();
      listarMuebles();
    })
    .catch((error) => {
      mostrarMensaje("Ocurrió un error: " + error);
    });
}

function borrarMueble() {
  const idMueble = document.getElementById("txtIdMueble").value.trim();
  if (idMueble === "") {
    mostrarMensaje("No se ingresó ID de mueble");
    return;
  }

  get(child(refS(db), "Muebles/" + idMueble))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const confirmacion = confirm(
          "¿Estás seguro de que deseas eliminar el mueble con ID " +
            idMueble +
            "?"
        );
        if (confirmacion) {
          remove(refS(db, "Muebles/" + idMueble))
            .then(() => {
              mostrarMensaje("Mueble eliminado con éxito");
              limpiarInputs();
              listarMuebles();
            })
            .catch((error) => {
              mostrarMensaje("Ocurrió un error: " + error);
            });
        } else {
          mostrarMensaje("Operación cancelada");
        }
      } else {
        mostrarMensaje("El mueble con ID " + idMueble + " no existe.");
      }
    })
    .catch((error) => {
      mostrarMensaje("Ocurrió un error al verificar el mueble: " + error);
    });
}

uploadButton.addEventListener("click", (event) => {
  event.preventDefault();

  const file = imageInput.files[0];
  if (!file) {
    alert("Por favor selecciona un archivo.");
    return;
  }

  const storageRef = ref(storage, file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressDiv.textContent = `Subida en progreso: ${progress.toFixed(2)}%`;
      setTimeout(() => {
        progressDiv.textContent = "";
      }, 1000);
    },
    (error) => {
      progressDiv.textContent = "Error al subir:" + error;
      alert(`Error al subir: ${error.message}`);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
          txtUrlInput.value = url;
        })
        .catch((error) => {
          console.error("Error al obtener la URL:", error);
        });
    }
  );
});

document.getElementById("btnLogout").addEventListener("click", () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "/admin/login.html";
});
