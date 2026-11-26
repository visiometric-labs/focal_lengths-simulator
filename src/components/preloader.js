import { eventBus } from '../core/event-bus.js';

/**
 * Preloader Dinámico Circular para Optix™
 * Inspirado en el concepto visual de arco fotónico azul con flecha direccional y estela de partículas decrecientes
 */
export class Preloader {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'preloader-card';

    this.element.innerHTML = `
      <div class="preloader-content">
        <!-- Spinner Fotónico Circular Dinámico -->
        <div class="spinner-wrapper">
          <svg class="photonic-circular-spinner" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00F2FE" />
                <stop offset="60%" stop-color="#007BFF" />
                <stop offset="100%" stop-color="#0284C7" />
              </linearGradient>
            </defs>

            <!-- Arco Circular de Rotación -->
            <path d="M 50 10 
                     A 40 40 0 1 0 85 65" 
                  stroke="url(#spinner-grad)" 
                  stroke-width="7.5" 
                  stroke-linecap="round" />

            <!-- Flecha de Dirección en la Cabeza del Arco -->
            <polygon points="50,2 62,12 48,18" fill="#00F2FE" />

            <!-- Estela de Partículas / Puntos Decrecientes en Opacidad y Tamaño -->
            <circle cx="88" cy="50" r="5.0" fill="#00F2FE" opacity="0.90" />
            <circle cx="85" cy="36" r="4.2" fill="#007BFF" opacity="0.75" />
            <circle cx="78" cy="24" r="3.6" fill="#38BDF8" opacity="0.60" />
            <circle cx="68" cy="16" r="3.0" fill="#38BDF8" opacity="0.45" />
            <circle cx="58" cy="11" r="2.4" fill="#38BDF8" opacity="0.30" />
          </svg>
        </div>

        <!-- Leyenda Clínica -->
        <div class="preloader-text-group">
          <h2 class="preloader-title">Optix<span class="brand-accent">™</span></h2>
          <p id="preloader-status" class="preloader-status">Calibrando motor óptico y texturas focales...</p>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  updateStatus(message) {
    const statusEl = this.element.querySelector('#preloader-status');
    if (statusEl) statusEl.textContent = message;
  }

  complete() {
    this.updateStatus('Simulador preparado.');
    this.element.classList.add('fade-out');

    setTimeout(() => {
      if (this.element && this.element.parentElement) {
        this.element.parentElement.removeChild(this.element);
      }
      eventBus.emit('preloader-completed');
    }, 450);
  }
}
