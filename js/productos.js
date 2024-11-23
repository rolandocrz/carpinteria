import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref as refS,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const tablaBody = document.getElementById("tabla-body");
const filtroCategoria = document.getElementById("filtro-categoria");

function listarMuebles(categoria = "") {
  const dbref = refS(db, "Muebles");

  onValue(dbref, (snapshot) => {
    tablaBody.innerHTML = ""; // Limpiar la tabla antes de llenarla
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();

      if (
        !categoria ||
        data.categoria.toLowerCase() === categoria.toLowerCase()
      ) {
        const fila = document.createElement("tr");

        // Crear celdas de cada mueble
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

        tablaBody.appendChild(fila); // Añadir la fila a la tabla
      }
    });
  });
}

// filtro
filtroCategoria.addEventListener("change", () => {
  listarMuebles(filtroCategoria.value);
});

// Cargar la lista de muebles cuando la página esté lista
document.addEventListener("DOMContentLoaded", () => listarMuebles());
