import { eventBus } from '../core/event-bus.js';

/**
 * Cabecera HUD Superior para Optix™
 * Incluye controles de pantalla completa dinámica, botón de centrado y toggle de Rayos X.
 * El logotipo de la marca redirige a la portada de bienvenida.
 */
export class HudHeader {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.isOverlayActive = false;

    this.render();
    this.bindEvents();
    this.updateFullscreenButton();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'hud-header-inner';

    this.element.innerHTML = `
      <!-- Marca y Estado: Clicable para volver a la portada -->
      <div class="hud-brand-group">
        <div id="hud-brand-logo" class="hud-brand-logo" role="button" tabindex="0" title="Volver a la portada de bienvenida">
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" rx="24" fill="#070F1E"/>
            <path d="M 16 38 C 24 30, 42 30, 48 38 C 50 40, 50 40, 52 38 C 58 30, 76 30, 84 38 C 88 52, 84 66, 72 70 C 58 72, 54 60, 52 54 C 48 54, 46 72, 28 70 C 16 66, 12 52, 16 38 Z" stroke="#38BDF8" stroke-width="6" fill="#0B1A30"/>
            <path d="M 24 56 C 30 56, 40 56, 42 62 C 38 68, 28 68, 22 64 Z" fill="#00F2FE"/>
            <path d="M 76 56 C 70 56, 60 56, 58 62 C 62 68, 72 68, 78 64 Z" fill="#00F2FE"/>
          </svg>
          <div class="hud-brand-text">
            <span class="hud-title">Optix<span class="brand-accent">™</span></span>
            <span class="hud-subtitle">Visiometric Labs</span>
          </div>
        </div>
      </div>

      <!-- Barra de Acciones del Profesional / Paciente -->
      <div class="hud-actions-group">
        <!-- Toggle Modo Rayos X / Mapa del Lente -->
        <button id="btn-toggle-overlay" class="btn-hud-pill" type="button" title="Mostrar/ocultar líneas del corredor y zonas ópticas">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span class="btn-text">Mapa Óptico</span>
        </button>

        <!-- Centrar Mirada -->
        <button id="btn-recenter-camera" class="btn-hud-pill" type="button" title="Restablecer la mirada al centro">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>
          </svg>
          <span class="btn-text">Centrar</span>
        </button>

        <!-- Botón Dinámico de Pantalla Completa (Entrar / Salir) -->
        <button id="btn-hud-fullscreen-toggle" class="btn-hud-pill btn-fullscreen" type="button" title="Alternar pantalla completa">
          <svg id="icon-fs-enter" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
          <svg id="icon-fs-exit" class="hidden" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
          <span id="fs-label" class="btn-text">Pantalla Completa</span>
        </button>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const brandLogo = this.element.querySelector('#hud-brand-logo');
    const btnOverlay = this.element.querySelector('#btn-toggle-overlay');
    const btnRecenter = this.element.querySelector('#btn-recenter-camera');
    const btnFs = this.element.querySelector('#btn-hud-fullscreen-toggle');

    brandLogo?.addEventListener('click', () => {
      eventBus.emit('return-to-landing');
    });

    brandLogo?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        eventBus.emit('return-to-landing');
      }
    });

    btnOverlay?.addEventListener('click', () => {
      this.isOverlayActive = !this.isOverlayActive;
      btnOverlay.classList.toggle('active', this.isOverlayActive);
      eventBus.emit('overlay-toggled', this.isOverlayActive);
    });

    btnRecenter?.addEventListener('click', () => {
      eventBus.emit('recenter-camera');
    });

    btnFs?.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
    document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());
  }

  toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  updateFullscreenButton() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const iconEnter = this.element?.querySelector('#icon-fs-enter');
    const iconExit = this.element?.querySelector('#icon-fs-exit');
    const label = this.element?.querySelector('#fs-label');

    if (isFs) {
      iconEnter?.classList.add('hidden');
      iconExit?.classList.remove('hidden');
      if (label) label.textContent = 'Salir Fullscreen';
    } else {
      iconEnter?.classList.remove('hidden');
      iconExit?.classList.add('hidden');
      if (label) label.textContent = 'Pantalla Completa';
    }
  }
}
