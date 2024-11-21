document.addEventListener("DOMContentLoaded", () => {
  iniciarContadores();
});

function iniciarContadores() {
  const contadores = document.querySelectorAll(".contador");
  const velocidad = 6000;

  contadores.forEach((contador) => {
    const actualizarContador = () => {
      const final = +contador.getAttribute("data-target");
      const valorActual = +contador.innerText.replace("+", "");

      const incremento = final / velocidad;

      if (valorActual < final) {
        contador.innerText = Math.ceil(valorActual + incremento);
        setTimeout(actualizarContador, 10);
      } else {
        contador.innerText = `${final}+`;
      }
    };

    actualizarContador();
  });
}
