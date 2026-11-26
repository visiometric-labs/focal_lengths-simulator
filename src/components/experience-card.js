import { eventBus } from '../core/event-bus.js';

/**
 * Ficha de Experiencia del Paciente para Optix™
 * Muestra en tiempo real lo que el ojo experimenta y los fundamentos ópticos del lente seleccionado
 * Incluye modo colapsable táctil para tablets y pantallas compactas
 */
export class ExperienceCard {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.isCollapsed = true; // Iniciar minimizada por defecto a petición clínica
    this.currentData = null;

    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'experience-card-inner collapsed';

    this.element.innerHTML = `
      <div class="card-header-row">
        <div class="card-title-group">
          <span id="exp-badge" class="exp-badge">Foco Fijo</span>
          <h3 id="exp-title" class="exp-title">Lente Monofocal — Visión Lejana</h3>
        </div>
        <button id="btn-collapse-card" class="btn-card-toggle" type="button" title="Minimizar / Expandir Ficha">
          <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      <div id="exp-body" class="card-body-content">
        <p id="exp-explanation" class="exp-text">
          Máxima agudeza visual nítida en el plano infinito (>3 metros). Al mirar objetos cercanos como celular o documentos, el ojo no puede acomodar y experimenta desenfoque.
        </p>

        <div class="exp-meta-grid">
          <div class="meta-item">
            <span class="meta-label">Confort Ergonómico:</span>
            <span id="exp-ergonomics" class="meta-value">Excelente postura para conducir y ver televisión; requiere gafas adicionales para leer.</span>
          </div>

          <div id="meta-blindspot-box" class="meta-item warning-box">
            <span class="meta-label">Campo y Limitación:</span>
            <span id="exp-blindspot" class="meta-value">Zona cercana completamente borrosa (presbicia no corregida en lectura).</span>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const btnToggle = this.element.querySelector('#btn-collapse-card');
    btnToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isCollapsed = !this.isCollapsed;
      this.element.classList.toggle('collapsed', this.isCollapsed);
    });

    eventBus.on('lens-changed', (info) => {
      this.updateData(info);
    });
  }

  updateData(info) {
    if (!info || !info.details) return;
    this.currentData = info;

    const badgeEl = this.element.querySelector('#exp-badge');
    const titleEl = this.element.querySelector('#exp-title');
    const expEl = this.element.querySelector('#exp-explanation');
    const ergoEl = this.element.querySelector('#exp-ergonomics');
    const blindBox = this.element.querySelector('#meta-blindspot-box');
    const blindEl = this.element.querySelector('#exp-blindspot');

    const { lens, sub } = info.details;

    if (info.lensId === 'monofocal') {
      if (badgeEl) badgeEl.textContent = 'Foco Fijo';
      if (titleEl) titleEl.textContent = `${lens.name} — ${sub.name}`;
      if (expEl) expEl.textContent = sub.explanation;
      if (ergoEl) ergoEl.textContent = sub.ergonomics;
      if (blindBox) blindBox.className = 'meta-item warning-box';
      if (blindEl) blindEl.textContent = sub.blindSpots;

    } else if (info.lensId === 'bifocal') {
      if (badgeEl) badgeEl.textContent = 'Doble Foco con Salto';
      if (titleEl) titleEl.textContent = lens.name;
      if (expEl) expEl.textContent = lens.explanation;
      if (ergoEl) ergoEl.textContent = lens.ergonomics;
      if (blindBox) blindBox.className = 'meta-item danger-box';
      if (blindEl) blindEl.textContent = lens.blindSpots;

    } else if (info.lensId === 'progresivo') {
      if (badgeEl) badgeEl.textContent = sub.corridorWidth;
      if (titleEl) titleEl.textContent = `Progresivo — ${sub.name}`;
      if (expEl) expEl.textContent = sub.explanation;
      if (ergoEl) ergoEl.textContent = sub.ergonomics;
      if (blindBox) blindBox.className = 'meta-item info-box';
      if (blindEl) blindEl.textContent = `Aberración lateral: ${sub.aberrationLevel}. ${sub.adaptation}`;
    }
  }
}
