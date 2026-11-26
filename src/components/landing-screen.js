import { eventBus } from '../core/event-bus.js';

/**
 * Portada de Bienvenida (Landing Screen) para Optix™
 * Gestiona el ciclo inicial de entrada y la regla estricta de pantalla completa:
 * - En portada NO se puede entrar a pantalla completa manualmente.
 * - En portada SÍ se puede salir de pantalla completa si ya estuviera activa.
 * - Al pulsar "Iniciar Experiencia", se solicita pantalla completa automáticamente.
 */
export class LandingScreen {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.render();
    this.bindEvents();
    this.updateFullscreenExitButton();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'landing-card-wrapper';

    this.element.innerHTML = `
      <div class="landing-glass-card">
        <!-- Barra de Estado Superior / Salida de Pantalla Completa (Solo si está activa) -->
        <div class="landing-top-bar">
          <div class="landing-brand-badge">
            <span class="badge-dot"></span>
            <span>VISIOMETRIC LABS • GABINETE CLÍNICO</span>
          </div>

          <!-- Botón de salida manual de fullscreen (oculto si no está en fullscreen) -->
          <button id="btn-landing-exit-fullscreen" class="btn-landing-exit-fs hidden" type="button" title="Salir de pantalla completa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
            <span>Salir de Pantalla Completa</span>
          </button>
        </div>

        <!-- Encabezado Principal -->
        <div class="landing-hero-section">
          <h1 class="landing-main-title">
            Optix<span class="brand-accent">™</span>
          </h1>
          <p class="landing-main-subtitle">
            Simulador de Diseños de Lente Oftálmica y Campos Visuales
          </p>
          <p class="landing-main-desc">
            Experimenta en primera persona y en tiempo real cómo se comporta la visión a través de lentes <strong>Monofocales</strong>, <strong>Bifocales Flat-Top</strong> y <strong>Progresivos continuos</strong> a través de las distancias de la vida cotidiana.
          </p>
        </div>

        <!-- Rejilla de Tecnologías Ópticas Demostrables -->
        <div class="landing-features-grid">
          <div class="feature-tile">
            <div class="feature-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="2.5" fill="#38BDF8"/>
              </svg>
            </div>
            <h3>Monofocales</h3>
            <p>Alterna entre visión lejana y lectura para entender por qué un solo foco no puede cubrir ambas distancias.</p>
          </div>

          <div class="feature-tile">
            <div class="feature-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00F2FE" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="4" width="18" height="16" rx="4"/>
                <line x1="3" y1="13" x2="21" y2="13"/>
                <path d="M 7 13 C 7 17, 17 17, 17 13" fill="rgba(0,242,254,0.2)"/>
              </svg>
            </div>
            <h3>Bifocal Flat-Top</h3>
            <p>Demuestra el salto de imagen prismático y el punto ciego que deja borrosa la pantalla de la computadora.</p>
          </div>

          <div class="feature-tile">
            <div class="feature-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round">
                <path d="M 6 4 C 11 5, 11 11, 12 12 C 13 11, 13 5, 18 4"/>
                <path d="M 6 20 C 11 19, 11 13, 12 12 C 13 13, 13 19, 18 20"/>
                <line x1="12" y1="4" x2="12" y2="20" stroke-dasharray="2 2"/>
              </svg>
            </div>
            <h3>Progresivo (4 Gamas)</h3>
            <p>Compara la amplitud del corredor visual y la reducción de aberraciones laterales desde gama baja hasta alta.</p>
          </div>
        </div>

        <!-- Botón de Acción Principal -->
        <div class="landing-cta-container">
          <button id="btn-start-experience" class="btn-start-primary" type="button">
            <span>Iniciar Experiencia</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Derechos de Autor y Créditos -->
        <footer class="landing-footer-credits">
          <span>&copy; <span id="current-year">2026</span> <strong>Visiometric Labs</strong>. Todos los derechos reservados.</span>
          <span class="footer-separator">•</span>
          <span>Desarrollado por <strong>JayzirTech</strong></span>
          <span class="footer-separator">•</span>
          <span>Motor WebGL 60 FPS</span>
        </footer>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const btnStart = this.element.querySelector('#btn-start-experience');
    const btnExitFs = this.element.querySelector('#btn-landing-exit-fullscreen');

    // Botón Iniciar Experiencia: solicita pantalla completa y oculta la portada
    btnStart?.addEventListener('click', async () => {
      await this.requestFullscreenSafe();
      this.hide();
      eventBus.emit('experience-started');
    });

    // Botón Salir de Pantalla Completa en portada (solo si está activo)
    btnExitFs?.addEventListener('click', () => {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });

    // Escuchar cambios de fullscreen del sistema operativo/navegador
    document.addEventListener('fullscreenchange', () => this.updateFullscreenExitButton());
    document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenExitButton());
  }

  updateFullscreenExitButton() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const btnExitFs = this.element?.querySelector('#btn-landing-exit-fullscreen');
    if (!btnExitFs) return;

    if (isFs) {
      btnExitFs.classList.remove('hidden');
    } else {
      btnExitFs.classList.add('hidden');
    }
  }

  async requestFullscreenSafe() {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      }
    } catch (err) {
      // Si el navegador o la política del usuario bloquea el fullscreen, continuar sin romper
      console.warn('Optix: Pantalla completa rechazada por el navegador:', err);
    }
  }

  show() {
    this.container.classList.remove('hidden');
    this.element.classList.remove('fade-out');
    this.updateFullscreenExitButton();
  }

  hide() {
    this.element.classList.add('fade-out');
    setTimeout(() => {
      this.container.classList.add('hidden');
    }, 320);
  }
}
