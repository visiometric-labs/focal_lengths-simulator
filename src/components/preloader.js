import { eventBus } from '../core/event-bus.js';

/**
 * Preloader Dinámico Circular para Optix™
 * Rotación geométrica matemáticamente pura sin saltos ni bamboleos
 */
export class Preloader {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.isDone = false;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'preloader-card';

    // SVG 100x100 perfectamente centrado en cx=50, cy=50, radio R=37
    // El arco y las partículas tienen simetría radial exacta
    this.element.innerHTML = `
      <div class="preloader-content">
        <div class="spinner-wrapper">
          <svg class="photonic-circular-spinner" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="spinner-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00F2FE" />
                <stop offset="60%" stop-color="#007BFF" />
                <stop offset="100%" stop-color="#0284C7" />
              </linearGradient>
            </defs>

            <!-- Grupo rotador con centro exacto en 50, 50 -->
            <g class="spinner-rotator">
              <!-- Arco circular sólido (de 110° a 330° en sentido horario) -->
              <path d="M 37.3 84.8
                       A 37 37 0 1 1 82.0 37.3"
                    stroke="url(#spinner-blue-grad)"
                    stroke-width="7.5"
                    stroke-linecap="round" />

              <!-- Cabeza de Flecha directriz perfectamente alineada con la tangente en (82, 37.3) -->
              <polygon points="76,28 92,34 83,48" fill="#007BFF" />

              <!-- Estela de 7 partículas con reducción continua de radio y opacidad -->
              <!-- Ángulos entre 350° y 90° -->
              <circle cx="86.4" cy="50.0" r="4.8" fill="#00F2FE" opacity="0.88" />
              <circle cx="84.2" cy="62.7" r="4.3" fill="#007BFF" opacity="0.75" />
              <circle cx="77.9" cy="74.4" r="3.8" fill="#007BFF" opacity="0.62" />
              <circle cx="68.5" cy="83.6" r="3.3" fill="#38BDF8" opacity="0.48" />
              <circle cx="56.7" cy="89.1" r="2.8" fill="#38BDF8" opacity="0.36" />
              <circle cx="43.8" cy="90.5" r="2.3" fill="#38BDF8" opacity="0.25" />
            </g>
          </svg>
        </div>

        <div class="preloader-text-group">
          <h2 class="preloader-title">Optix<span class="brand-accent">™</span></h2>
          <p id="preloader-status" class="preloader-status">Calibrando motor óptico y texturas focales...</p>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  updateStatus(message) {
    const statusEl = this.element?.querySelector('#preloader-status');
    if (statusEl) statusEl.textContent = message;
  }

  complete() {
    if (this.isDone) return;
    this.isDone = true;

    this.updateStatus('Simulador preparado.');

    // Desvanecer el overlay completo con suavidad (solo opacidad, sin deformación de escala)
    if (this.container) {
      this.container.classList.add('fade-out');

      setTimeout(() => {
        this.container.classList.add('hidden');
        this.container.style.display = 'none';
        eventBus.emit('preloader-completed');
      }, 380);
    }
  }
}
