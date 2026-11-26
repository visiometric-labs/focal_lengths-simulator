import { LENSES_DATA } from '../core/lenses-data.js';
import { eventBus } from '../core/event-bus.js';

/**
 * Selector de Diseños Oftálmicos y Gamas para Optix™
 * Iconografía 100% Vectorial SVG (Cero Emojis)
 */
export class LensSelector {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;

    // Estado activo por defecto: Progresivo Gama Media
    this.activeLens = 'progresivo';
    this.activeSubMode = 'media'; // Para monofocal: 'lejos' o 'cerca'. Para progresivo: 'baja', 'media', 'media-alta', 'alta'

    this.render();
    this.bindEvents();
    this.notifyChange();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'lens-selector-wrapper';

    this.element.innerHTML = `
      <!-- 1. Pestañas Principales (Diseño Oftálmico) -->
      <div class="lens-primary-tabs" role="tablist">
        <!-- Monofocal -->
        <button class="lens-tab-btn" data-lens="monofocal" type="button" role="tab">
          <svg class="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
          </svg>
          <span class="tab-label">Monofocal</span>
        </button>

        <!-- Bifocal Flat-Top -->
        <button class="lens-tab-btn" data-lens="bifocal" type="button" role="tab">
          <svg class="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="4" width="18" height="16" rx="4"/>
            <line x1="3" y1="13" x2="21" y2="13"/>
            <path d="M 7 13 C 7 17, 17 17, 17 13" fill="rgba(0, 242, 254, 0.25)"/>
          </svg>
          <span class="tab-label">Bifocal Flat-Top</span>
        </button>

        <!-- Progresivo Multifocal -->
        <button class="lens-tab-btn active" data-lens="progresivo" type="button" role="tab">
          <svg class="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M 6 4 C 11 5, 11 11, 12 12 C 13 11, 13 5, 18 4"/>
            <path d="M 6 20 C 11 19, 11 13, 12 12 C 13 13, 13 19, 18 20"/>
            <line x1="12" y1="4" x2="12" y2="20" stroke-dasharray="2 2"/>
          </svg>
          <span class="tab-label">Progresivo</span>
        </button>
      </div>

      <!-- 2. Sub-selector Contextual -->
      <div id="lens-sub-container" class="lens-sub-container"></div>
    `;

    this.container.appendChild(this.element);
    this.renderSubMenu();
  }

  renderSubMenu() {
    const subContainer = this.element.querySelector('#lens-sub-container');
    if (!subContainer) return;

    if (this.activeLens === 'monofocal') {
      // Subselector Lejos / Cerca
      subContainer.innerHTML = `
        <div class="sub-mode-pill-group">
          <span class="sub-group-label">Distancia Fija:</span>
          <button class="sub-pill-btn ${this.activeSubMode === 'lejos' ? 'active' : ''}" data-sub="lejos" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
            </svg>
            <span>Lejos (>3m)</span>
          </button>
          <button class="sub-pill-btn ${this.activeSubMode === 'cerca' ? 'active' : ''}" data-sub="cerca" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="5" y="2" width="14" height="20" rx="3"/>
              <line x1="12" y1="18" x2="12" y2="18.01" stroke-width="3"/>
            </svg>
            <span>Lectura / Celular (35cm)</span>
          </button>
        </div>
      `;
    } else if (this.activeLens === 'bifocal') {
      // Mensaje de Bifocal Flat-Top (Doble campo fijo)
      subContainer.innerHTML = `
        <div class="bifocal-status-pill">
          <span class="bifocal-indicator"></span>
          <span>Pastilla Flat-Top 28 mm activa: Lejos (arriba) • Cerca (abajo) • Punto ciego en laptop</span>
        </div>
      `;
    } else if (this.activeLens === 'progresivo') {
      // Selector de las 4 Gamas de Progresivo
      subContainer.innerHTML = `
        <div class="sub-mode-pill-group">
          <span class="sub-group-label">Gama de Corredor:</span>

          <button class="sub-pill-btn ${this.activeSubMode === 'baja' ? 'active' : ''}" data-sub="baja" type="button" title="Pasillo estrecho (~30%)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M7 4h10M10 12h4M7 20h10"/>
            </svg>
            <span>Básica (30%)</span>
          </button>

          <button class="sub-pill-btn ${this.activeSubMode === 'media' ? 'active' : ''}" data-sub="media" type="button" title="Pasillo equilibrado (~45%)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 4h12M9 12h6M6 20h12"/>
            </svg>
            <span>Media (45%)</span>
          </button>

          <button class="sub-pill-btn ${this.activeSubMode === 'media-alta' ? 'active' : ''}" data-sub="media-alta" type="button" title="Pasillo amplio Free-Form (~65%)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M5 4h14M8 12h8M5 20h14"/>
            </svg>
            <span>Free-Form (65%)</span>
          </button>

          <button class="sub-pill-btn ${this.activeSubMode === 'alta' ? 'active' : ''}" data-sub="alta" type="button" title="Pasillo panorámico premium (~85%)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 4h16M7 12h10M4 20h16"/>
            </svg>
            <span>Panorámica (85%)</span>
          </button>
        </div>
      `;
    }
  }

  bindEvents() {
    // Clics en Pestañas Principales
    this.element.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.lens-tab-btn');
      if (tabBtn) {
        const lensId = tabBtn.dataset.lens;
        if (lensId && lensId !== this.activeLens) {
          this.activeLens = lensId;

          // Restablecer submodo coherente
          if (this.activeLens === 'monofocal') {
            this.activeSubMode = 'lejos';
          } else if (this.activeLens === 'progresivo') {
            this.activeSubMode = 'media';
          } else {
            this.activeSubMode = 'default';
          }

          // Actualizar UI
          this.element.querySelectorAll('.lens-tab-btn').forEach((b) => b.classList.remove('active'));
          tabBtn.classList.add('active');

          this.renderSubMenu();
          this.notifyChange();
        }
        return;
      }

      // Clics en Sub-botones
      const subBtn = e.target.closest('.sub-pill-btn');
      if (subBtn) {
        const subId = subBtn.dataset.sub;
        if (subId && subId !== this.activeSubMode) {
          this.activeSubMode = subId;

          this.element.querySelectorAll('.sub-pill-btn').forEach((b) => b.classList.remove('active'));
          subBtn.classList.add('active');

          this.notifyChange();
        }
      }
    });
  }

  notifyChange() {
    let typeIndex = 2.0; // Progresivo por defecto
    let subModeIndex = 1.0; // Media por defecto
    let activeData = null;

    if (this.activeLens === 'monofocal') {
      typeIndex = 0.0;
      subModeIndex = this.activeSubMode === 'cerca' ? 1.0 : 0.0;
      activeData = {
        lens: LENSES_DATA.monofocal,
        sub: LENSES_DATA.monofocal.subModes[this.activeSubMode],
      };
    } else if (this.activeLens === 'bifocal') {
      typeIndex = 1.0;
      subModeIndex = 0.0;
      activeData = {
        lens: LENSES_DATA.bifocal,
        sub: null,
      };
    } else if (this.activeLens === 'progresivo') {
      typeIndex = 2.0;
      const gamaMap = { baja: 0.0, media: 1.0, 'media-alta': 2.0, alta: 3.0 };
      subModeIndex = gamaMap[this.activeSubMode] !== undefined ? gamaMap[this.activeSubMode] : 1.0;
      activeData = {
        lens: LENSES_DATA.progresivo,
        sub: LENSES_DATA.progresivo.gamas[this.activeSubMode],
      };
    }

    eventBus.emit('lens-changed', {
      typeIndex,
      subModeIndex,
      lensId: this.activeLens,
      subId: this.activeSubMode,
      details: activeData,
    });
  }
}
