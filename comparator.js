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

// ==== Utilidades de datos combinados ====
const ALL_ITEMS = [...DATA.agiles, ...DATA.tradicionales];
const MAP_BY_ID = ALL_ITEMS.reduce((acc, m) => (acc[m.id] = m, acc), {});

// Elements
const catCards = document.querySelectorAll(".cmp-card");
const selector = document.getElementById("cmp-selector");
const checkboxesBox = document.getElementById("cmp-checkboxes");
const btnCompare = document.getElementById("cmp-compare");
const btnClear = document.getElementById("cmp-clear");
const resultBox = document.getElementById("cmp-result");
const tbody = document.getElementById("cmp-tbody");
const titleCat = document.getElementById("cmp-cat-title");
const filterButtons = document.querySelectorAll(".cmp-filter .btn");

let currentSelection = new Set();

// Helpers
const byId = id => document.getElementById(id);

// Render combinado con posibilidad de filtrar visualmente
function renderCheckboxesCombined() {
  checkboxesBox.innerHTML = "";

  // Encabezados por grupo (solo informativos)
  const groups = [
    { key: "agiles", label: "Ágiles", list: DATA.agiles },
    { key: "tradicionales", label: "Tradicionales", list: DATA.tradicionales }
  ];

  groups.forEach(g => {
    const h = document.createElement("h3");
    h.className = "cmp-group-title";
    h.textContent = g.label;
    h.dataset.cat = g.key;
    checkboxesBox.appendChild(h);

    g.list.forEach(m => {
      const id = `chk-${m.id}`;
      const label = document.createElement("label");
      label.dataset.cat = g.key; // para el filtro
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
  });
}

// Aplicar filtro visual
function applyFilter(view) {
  // Marcar botón activo
  filterButtons.forEach(b => b.classList.toggle("is-active", b.dataset.filter === view));
  // Mostrar/ocultar por data-cat
  checkboxesBox.querySelectorAll("[data-cat]").forEach(el => {
    if (view === "all") {
      el.style.display = "";
    } else {
      el.style.display = (el.dataset.cat === view) ? "" : "none";
    }
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

function renderTable() {
  const list = [...currentSelection].map(id => MAP_BY_ID[id]).filter(Boolean);
  tbody.innerHTML = list.map(buildRow).join("");
  resultBox.hidden = list.length < 2;
  if (!resultBox.hidden) {
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Abrir selector al tocar cualquiera de las tarjetas (ahora muestra TODAS)
catCards.forEach(card => {
  card.addEventListener("click", () => {
    titleCat.textContent = "Seleccione 2 o más metodologías (ágiles y/o tradicionales)";
    currentSelection.clear();
    btnCompare.disabled = true;
    resultBox.hidden = true;
    renderCheckboxesCombined();
    selector.hidden = false;
    applyFilter(card.dataset.cat || "all"); // abre filtrando por la tarjeta tocada
  });
});

// Eventos del filtro
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});

// Acciones
btnCompare.addEventListener("click", () => {
  if (currentSelection.size < 2) return;
  renderTable();
});

btnClear.addEventListener("click", () => {
  currentSelection.clear();
  selector.querySelectorAll('input[type="checkbox"]').forEach(c => (c.checked = false));
  btnCompare.disabled = true;
  resultBox.hidden = true;
});

/* ===== US-19: Encuesta de Preferencias (ampliada con equipo y proyecto) ===== */
(function(){
  const form       = document.getElementById('survey-form');
  if (!form) return;

  const selReqs     = document.getElementById('q-reqs');
  const selTrabajo  = document.getElementById('q-trabajo');
  const selEquipo   = document.getElementById('q-equipo');
  const selProyecto = document.getElementById('q-proyecto');
  const loading     = document.getElementById('survey-loading');
  const suggestEl   = document.getElementById('survey-suggest');

  // Reglas base + refinamientos por tamaño de equipo/proyecto:
  // - Flujo  => Kanban
  // - Iteraciones + cambiantes => Scrum (si equipo/proyecto chicos => XP)
  // - Iteraciones + estables   => Incremental (si proyecto grande => Iterativo)
  // - Lotes + estables         => Cascada (si proyecto/equipo grande => Modelo V)
  // - Lotes + cambiantes       => Scrum (si equipo/proyecto chicos => XP)

  function sugerir(reqs, trabajo, equipo, proyecto){
    const ePeq = (equipo === 'pequeno');
    const eGra = (equipo === 'grande');
    const pPeq = (proyecto === 'pequeno');
    const pGra = (proyecto === 'grande');

    // 1) Flujo continuo
    if (trabajo === 'flujo') return 'Kanban';

    // 2) Lotes
    if (trabajo === 'lotes') {
      if (reqs === 'estables') {
        if (pGra || eGra) return 'Modelo V';
        return 'Cascada';
      } else {
        if (ePeq && pPeq) return 'XP (Extreme Programming)';
        return 'Scrum';
      }
    }

    // 3) Iteraciones / sprints
    if (trabajo === 'iteraciones') {
      if (reqs === 'cambiantes') {
        if (ePeq && pPeq) return 'XP (Extreme Programming)';
        return 'Scrum';
      } else {
        if (pGra) return 'Iterativo';
        return 'Incremental';
      }
    }

    // Fallback
    return 'Scrum';
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!selReqs.value || !selTrabajo.value || !selEquipo.value || !selProyecto.value) {
      alert('Completá las 4 opciones para continuar.');
      return;
    }
    loading.hidden = false;
    suggestEl.textContent = '……';
    setTimeout(()=>{
      const metodo = sugerir(
        selReqs.value,
        selTrabajo.value,
        selEquipo.value,
        selProyecto.value
      );
      suggestEl.textContent = metodo;
      loading.hidden = true;
      document.getElementById('survey-result')?.scrollIntoView({behavior:'smooth', block:'center'});
    }, 700);
  });
})();
