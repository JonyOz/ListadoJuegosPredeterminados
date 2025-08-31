document.addEventListener("DOMContentLoaded", () => {
  // Detectar si estamos en listado.html
  const lista = document.getElementById("lista-juegos");
  const params = new URLSearchParams(window.location.search);
  const consola = params.get("console"); // ej. gba, gbc, gb, nds

  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  if (lista && consola) {
    // Actualiza el título dinámicamente
    document.getElementById("titulo").textContent = `Listado de Juegos ${consola.toUpperCase()}`;

    // Ruta al archivo txt
    const archivo = `txt/${consola}.txt`;

    fetch(archivo)
      .then(response => {
        if (!response.ok) throw new Error("No se encontró el archivo " + archivo);
        return response.text();
      })
      .then(texto => {
        const juegos = texto.split("\n").filter(j => j.trim() !== "");
        juegos.forEach(juego => {
          const li = document.createElement("li");
          const enlace = document.createElement("a");

          // Configuramos el enlace a detalle.html
          enlace.textContent = juego;
          enlace.href = `detalle.html?console=${encodeURIComponent(consola)}&juego=${encodeURIComponent(juego)}`;

          li.appendChild(enlace);
          lista.appendChild(li);
        });
      })
      .catch(err => {
        lista.innerHTML = `<li>Error cargando lista: ${err.message}</li>`;
      });
  }
});
