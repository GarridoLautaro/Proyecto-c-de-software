/* ====== Comparador de Metodologías (US-18) ====== */

// Data de metodologías
const DATA = {
  agiles: [
    {
      id: "scrum",
      nombre: "Scrum",
      descripcion:
        "Framework ágil iterativo con sprints, roles definidos (PO, SM, Dev Team) y eventos de inspección/adaptación.",
      ventajas: [
        "Alta visibilidad y transparencia.",
        "Entregas frecuentes de valor.",
        "Mejora continua (retros)."
      ],
      desventajas: [
        "Requiere madurez del equipo.",
        "Puede generar reuniones excesivas si no se gestionan bien."
      ],
      cuando: [
        "Requisitos cambiantes o alta incertidumbre.",
        "Necesidad de feedback temprano del cliente."
      ]
    },
    {
      id: "kanban",
      nombre: "Kanban",
      descripcion:
        "Gestión del flujo de trabajo visual, limitando trabajo en proceso (WIP) para optimizar throughput.",
      ventajas: [
        "Implementación gradual.",
        "Excelente para mantenimiento/operaciones.",
        "Enfoque en flujo y lead time."
      ],
      desventajas: [
        "Menos prescriptivo (puede faltar cadencia).",
        "Difícil sin cultura de mejora continua."
      ],
      cuando: [
        "Flujo continuo de demandas (tickets/incidencias).",
        "Necesidad de optimizar tiempos de ciclo."
      ]
    },
    {
      id: "xp",
      nombre: "XP (Extreme Programming)",
      descripcion:
        "Prácticas técnicas ágiles (TDD, refactor, CI, pairing) que elevan la calidad y la capacidad de cambio.",
      ventajas: [
        "Alta calidad técnica y testabilidad.",
        "Reduce deuda técnica.",
        "Feedback rápido."
      ],
      desventajas: [
        "Necesita disciplina técnica y tiempo de aprendizaje.",
        "Resistencia inicial del equipo."
      ],
      cuando: [
        "Proyectos donde la calidad del código es crítica.",
        "Entornos que requieren cambios frecuentes."
      ]
    },
    {
      id: "lean",
      nombre: "Lean",
      descripcion:
        "Enfoque de eliminación de desperdicios, aprendizaje validado y entrega rápida de valor.",
      ventajas: ["Reduce desperdicio.", "Enfoque en valor.", "Aprendizaje validado."],
      desventajas: ["Puede ser abstracto sin prácticas concretas.", "Mide mucho, actúa poco si no se guía bien."],
      cuando: ["Startups y validación de hipótesis.", "Optimización de procesos."]
    }
  ],
  tradicionales: [
    {
      id: "cascada",
      nombre: "Cascada",
      descripcion:
        "Fases secuenciales: análisis → diseño → implementación → pruebas → despliegue → mantenimiento.",
      ventajas: [
        "Simple de entender y planificar.",
        "Alta documentación.",
        "Útil en proyectos pequeños/fijos."
      ],
      desventajas: [
        "Rigidez al cambio.",
        "Feedback tardío.",
        "Riesgo de entregar valor tarde."
      ],
      cuando: [
        "Requisitos estables y bien definidos.",
        "Entornos regulados o contratos cerrados."
      ]
    },
    {
      id: "vmodel",
      nombre: "Modelo V",
      descripcion:
        "Cada fase tiene su fase de prueba asociada (verificación y validación temprana).",
      ventajas: ["Mayor control de calidad.", "Documentación clara."],
      desventajas: ["Sigue siendo rígido.", "Costoso modificar requisitos avanzados."],
      cuando: ["Sistemas críticos (médicos, defensa)."]
    },
    {
      id: "iterativo",
      nombre: "Iterativo",
      descripcion:
        "Construcción en ciclos sucesivos mejorando en cada iteración.",
      ventajas: ["Corrige temprano.", "Reduce riesgos en cambios."],
      desventajas: ["Puede consumir más tiempo.", "Requiere buena gestión de cambios."],
      cuando: ["Proyectos con visión no completamente clara."]
    },
    {
      id: "incremental",
      nombre: "Incremental",
      descripcion:
        "Entrega por módulos; cada incremento suma funcionalidad.",
      ventajas: ["Entregas tempranas de valor.", "Fácil de mantener."],
      desventajas: ["Integración final compleja.", "Riesgo de inconsistencia de diseño."],
      cuando: ["Necesidad de resultados rápidos y escalables."]
    }
  ]
};

// Elements
const catCards = document.querySelectorAll(".cmp-card");
const selector = document.getElementById("cmp-selector");
const checkboxesBox = document.getElementById("cmp-checkboxes");
const btnCompare = document.getElementById("cmp-compare");
const btnClear = document.getElementById("cmp-clear");
const resultBox = document.getElementById("cmp-result");
const tbody = document.getElementById("cmp-tbody");
const titleCat = document.getElementById("cmp-cat-title");

let currentCat = null;
let currentSelection = new Set();

// Helpers
const byId = id => document.getElementById(id);

function renderCheckboxes(list) {
  checkboxesBox.innerHTML = "";
  list.forEach(m => {
    const id = `chk-${m.id}`;
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" id="${id}" value="${m.id}">
      <div>
        <b>${m.nombre}</b><br>
        <small>${m.descripcion}</small>
      </div>
    `;
    checkboxesBox.appendChild(label);
    byId(id).addEventListener("change", e => {
      if (e.target.checked) currentSelection.add(m.id);
      else currentSelection.delete(m.id);
      btnCompare.disabled = currentSelection.size < 2;
    });
  });
}

function buildRow(m) {
  const li = arr => `<ul>${arr.map(v=>`<li>${v}</li>`).join("")}</ul>`;
  return `
    <tr>
      <th scope="row">${m.nombre}</th>
      <td>${m.descripcion}</td>
      <td>${li(m.ventajas)}</td>
      <td>${li(m.desventajas)}</td>
      <td>${li(m.cuando)}</td>
    </tr>
  `;
}

function renderTable(catKey) {
  const list = DATA[catKey].filter(m => currentSelection.has(m.id));
  tbody.innerHTML = list.map(buildRow).join("");
  resultBox.hidden = list.length < 2;
  if (!resultBox.hidden) {
    // scroll hacia la tabla para enfocarla (suave)
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Eventos de selección de categoría
catCards.forEach(card => {
  card.addEventListener("click", () => {
    currentCat = card.dataset.cat; // 'agiles' o 'tradicionales'
    titleCat.textContent =
      (currentCat === "agiles" ? "Ágiles" : "Tradicionales") + " — Seleccione 2 o más metodologías";
    // reset
    currentSelection.clear();
    btnCompare.disabled = true;
    resultBox.hidden = true;
    // render checkboxes
    renderCheckboxes(DATA[currentCat]);
    selector.hidden = false;
  });
});

// Acciones
btnCompare.addEventListener("click", () => {
  if (!currentCat || currentSelection.size < 2) return;
  renderTable(currentCat);
});

btnClear.addEventListener("click", () => {
  currentSelection.clear();
  selector.querySelectorAll('input[type="checkbox"]').forEach(c => (c.checked = false));
  btnCompare.disabled = true;
  resultBox.hidden = true;
});

/* ===== US-19: Encuesta de Preferencias ===== */
(function(){
  const form = document.getElementById('survey-form');
  if (!form) return;

  const selReqs   = document.getElementById('q-reqs');
  const selTrabajo= document.getElementById('q-trabajo');
  const loading   = document.getElementById('survey-loading');
  const suggestEl = document.getElementById('survey-suggest');

  // Reglas simples basadas en las opciones de la placa:
  // - Requisitos cambiantes + iteraciones => Scrum
  // - Requisitos cambiantes + flujo        => Kanban
  // - Requisitos cambiantes + lotes        => XP
  // - Requisitos estables   + lotes        => Cascada
  // - Requisitos estables   + iteraciones  => Incremental
  // - Requisitos estables   + flujo        => Iterativo
  function sugerir(reqs, trabajo){
    if (reqs==='cambiantes' && trabajo==='iteraciones') return 'Scrum';
    if (reqs==='cambiantes' && trabajo==='flujo')       return 'Kanban';
    if (reqs==='cambiantes' && trabajo==='lotes')       return 'XP (Extreme Programming)';
    if (reqs==='estables'   && trabajo==='lotes')       return 'Cascada';
    if (reqs==='estables'   && trabajo==='iteraciones') return 'Incremental';
    if (reqs==='estables'   && trabajo==='flujo')       return 'Iterativo';
    return 'Scrum';
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!selReqs.value || !selTrabajo.value) {
      alert('Completá ambas opciones para continuar.');
      return;
    }
    // Loader breve para feedback visual
    loading.hidden = false;
    suggestEl.textContent = '……';
    setTimeout(()=>{
      const metodo = sugerir(selReqs.value, selTrabajo.value);
      suggestEl.textContent = metodo;
      loading.hidden = true;
      // Llevar el foco visual a la sugerencia
      document.getElementById('survey-result')?.scrollIntoView({behavior:'smooth', block:'center'});
    }, 700);
  });
})();
