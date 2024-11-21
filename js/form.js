document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formulario = e.target;
  let esValido = true;

  formulario.querySelectorAll("input, textarea").forEach((campo) => {
    if (!campo.checkValidity()) {
      campo.classList.add("is-invalid");
      esValido = false;
    } else {
      campo.classList.remove("is-invalid");
      campo.classList.add("is-valid");
    }
  });

  if (esValido) {
    alert("Formulario enviado correctamente.");
    formulario.reset();
  }
});
