document.addEventListener("DOMContentLoaded", () => {
  // --- Menú hamburguesa (seguro, por si no existe) ---
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // --- Mapeo etiqueta visible -> nombre de archivo txt ---
  const slugMap = {
    "GBA": "gba",
    "GBC": "gbc",
    "GB": "gb",
    "NDS": "nds",
    "PokeMini": "pokemini",
    "VB": "vb",
    "NES": "nes",
    "SNES": "snes",
    "N64": "n64",
    "PS1": "psx",        // ajusta a "ps" si tu archivo se llama ps.txt
    "PSP": "psp",
    "SMS": "sms",
    "GG": "gg",
    "MD": "md",
    "SCD": "scd",
    "32X": "32x",
    "DC": "dc",
    "Naomi": "naomi",
    "Atomiswave": "atomiswave",
    "NeoGeo": "neogeo",
    "NeoGeo Pocket": "ngp", // ajusta si tu archivo tiene otro nombre
    "WonderSwan": "ws",
    "CPS 1": "cps1",
    "CPS 2": "cps2",
    "CPS 3": "cps3",
    "Ports": "ports"
  };

  // --- Página de inicio: intercepta el click en las cards y redirige con ?console= ---
  const cards = document.querySelectorAll(".cards .card");
  if (cards.length) {
    cards.forEach(card => {
      card.addEventListener("click", (e) => {
        const label = (card.querySelector("span")?.textContent || "").trim();
        const slug = slugMap[label];
        if (slug) {
          e.preventDefault(); // evita seguir el href="#" o listado.html sin parámetro
          window.location.href = `listado.html?console=${encodeURIComponent(slug)}`;
        }
        // Si no hay slug, dejamos el enlace tal cual (por si ya tiene ?console= en el href)
      }, { capture: true });
    });
  }

  // --- Página listado.html: carga txt según ?console= ---
  const lista = document.getElementById("lista-juegos");
  const titulo = document.getElementById("titulo");
  const params = new URLSearchParams(window.location.search);
  const consola = params.get("console"); // ej. gba, gbc, gb, nds...

  if (lista) {
    if (!consola) {
      lista.innerHTML = "<li>Falta el parámetro ?console= en la URL.</li>";
      return;
    }

    if (titulo) {
      titulo.textContent = `Listado de Juegos ${consola.toUpperCase()}`;
    }

    const archivo = `${consola}.txt`; // asegura que exista y coincida el nombre

    fetch(archivo, { cache: "no-cache" })
      .then(r => {
        if (!r.ok) throw new Error(`No se encontró ${archivo} (${r.status})`);
        return r.text();
      })
      .then(texto => {
        const juegos = texto.split(/\r?\n/).map(j => j.trim()).filter(Boolean);
        if (!juegos.length) {
          lista.innerHTML = "<li>No hay juegos en la lista.</li>";
          return;
        }
        const frag = document.createDocumentFragment();
        juegos.forEach(juego => {
          const li = document.createElement("li");
          li.textContent = juego;
          frag.appendChild(li);
        });
        lista.textContent = "";
        lista.appendChild(frag);
      })
      .catch(err => {
        lista.innerHTML = `<li>Error cargando lista: ${err.message}</li>`;
      });
  }
});
