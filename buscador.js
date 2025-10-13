// === Buscador de secciones (Sección 1 a 7) ===
// Funciona en todas las pantallas que tengan <input class="buscar">

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".buscar");
  if (!input) return;

  // Normaliza texto: sin tildes ni mayúsculas
  const normalizar = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // Detecta a qué sección ir
  const irASeccion = (num) => {
    window.location.href = `pantalla${num}.html`;
  };

  // Asocia alias y variantes que puede escribir el usuario
  const secciones = {
    "1": ["1", "s1", "sec1", "seccion 1", "sección 1", "pantalla 1"],
    "2": ["2", "s2", "sec2", "seccion 2", "sección 2", "pantalla 2"],
    "3": ["3", "s3", "sec3", "seccion 3", "sección 3", "pantalla 3"],
    "4": ["4", "s4", "sec4", "seccion 4", "sección 4", "pantalla 4"],
    "5": ["5", "s5", "sec5", "seccion 5", "sección 5", "pantalla 5"],
    "6": ["6", "s6", "sec6", "seccion 6", "sección 6", "pantalla 6"],
    "7": ["7", "s7", "sec7", "seccion 7", "sección 7", "pantalla 7"],
  };

  // Buscar coincidencias
  const detectarSeccion = (query) => {
    const q = normalizar(query);
    // si contiene número
    const match = q.match(/(?:^|\b)(?:secc?ion|pantalla|s|sec)?\s*([1-7])(?:\b|$)/);
    if (match) return match[1];
    // si coincide con alias exacto
    for (const [n, list] of Object.entries(secciones)) {
      if (list.includes(q)) return n;
    }
    return null;
  };

  // Evento: presionar ENTER
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const numero = detectarSeccion(input.value);
      if (numero) {
        irASeccion(numero);
      } else {
        alert("No se encontró esa sección (usa Sección 1 a 7)");
      }
    }
  });
});
