import { eventBus } from '../core/event-bus.js';

/**
 * Modal de Guía de Mostrador para el Óptico / Profesional
 * Argumentario 100% Clínico y Ergonómico (Estrictamente Cero Mención a Precios)
 */
export class PitchModal {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.isOpen = false;

    this.render();
    this.bindEvents();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'pitch-modal-backdrop';

    this.element.innerHTML = `
      <div class="pitch-modal-window" role="dialog" aria-modal="true" aria-labelledby="pitch-modal-title">
        <!-- Encabezado del Modal -->
        <div class="pitch-modal-header">
          <div class="pitch-header-badge">
            <span class="badge-dot"></span>
            <span>GUÍA CLÍNICA DE MOSTRADOR • VISIOMETRIC LABS</span>
          </div>
          <button id="btn-close-pitch" class="btn-close-modal" type="button" title="Cerrar Guía">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <h2 id="pitch-modal-title" class="pitch-main-title">
          Argumentario Clínico y Beneficios Ergonómicos
        </h2>
        <p class="pitch-subtitle">
          Herramienta pedagógica para explicar al paciente la diferencia real en confort visual, postura y agudeza entre los diseños oftálmicos.
        </p>

        <!-- Contenido Clínico en 4 Bloques Clave -->
        <div class="pitch-cards-list">
          <!-- Bloque 1: El Progresivo frente al Bifocal -->
          <article class="pitch-topic-card">
            <div class="topic-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00F2FE" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3 3"/>
              </svg>
            </div>
            <div class="topic-body">
              <h4>1. ¿Por qué el Progresivo supera clínicamente al Bifocal?</h4>
              <ul>
                <li><strong>Eliminación del Salto de Imagen:</strong> Al no tener una línea física de corte, el paciente no experimenta saltos bruscos ni deformaciones al bajar escaleras o mirar el suelo.</li>
                <li><strong>Cobertura del Plano Intermedio:</strong> El bifocal deja completamente desenfocada la distancia entre 60 cm y 1 metro (pantallas de computador y laptops). El progresivo brinda un pasillo ergonómico continuo para trabajar sin fatiga de cuello.</li>
                <li><strong>Estética y Juventud Visual:</strong> Sin líneas visibles en el cristal; la transición es completamente imperceptible para quien observa al usuario.</li>
              </ul>
            </div>
          </article>

          <!-- Bloque 2: La Limitación del Monofocal -->
          <article class="pitch-topic-card">
            <div class="topic-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="3" width="18" height="18" rx="4"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div class="topic-body">
              <h4>2. ¿Por qué un Monofocal no es suficiente para la presbicia?</h4>
              <ul>
                <li><strong>El Síndrome de Quitar y Poner Gafas:</strong> Un monofocal de lectura obliga al paciente a retirar las gafas cada vez que levanta la mirada hacia un interlocutor, televisor o pasillo.</li>
                <li><strong>Desorientación Espacial:</strong> Caminar o mirar a lo lejos con gafas de lectura produce mareo inmediato debido a la sobrecorrección dióptrica para la distancia lejana.</li>
                <li><strong>Un solo par para todo el día:</strong> El progresivo permanece colocado en el rostro desde la mañana hasta la noche con total naturalidad.</li>
              </ul>
            </div>
          </article>

          <!-- Bloque 3: Amplitud de Gamas (Baja a Alta) -->
          <article class="pitch-topic-card">
            <div class="topic-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round">
                <path d="M2 20h20M5 20V8l7-5 7 5v12"/>
              </svg>
            </div>
            <div class="topic-body">
              <h4>3. ¿Cuál es el beneficio de una Gama Alta o Free-Form?</h4>
              <ul>
                <li><strong>Corredor Panorámico Extendido:</strong> En la gama básica el corredor ocupa ~30% del cristal (exige girar la cabeza); en la gama alta se expande a más del ~85%, permitiendo mover solo los ojos.</li>
                <li><strong>Reducción de Aberraciones Laterales:</strong> La tecnología de tallado digital Free-Form suaviza el astigmatismo periférico, eliminando la sensación de balanceo al caminar.</li>
                <li><strong>Adaptación Inmediata:</strong> Los pacientes de primera vez en gama alta se adaptan en cuestión de horas, sin períodos incómodos de acostumbramiento.</li>
              </ul>
            </div>
          </article>

          <!-- Bloque 4: Ergonomía de Postura -->
          <article class="pitch-topic-card">
            <div class="topic-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round">
                <path d="M12 2a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4Z"/>
                <path d="M6 21v-2a6 6 0 0 1 12 0v2"/>
              </svg>
            </div>
            <div class="topic-body">
              <h4>4. Recomendación Ergonómica de Uso en Consulta</h4>
              <p>
                Oriente al paciente a mantener la barbilla nivelada y guiar la mirada con la pupila: para la pantalla del computador, mirar suavemente por la zona media del lente; para el celular, bajar la vista por el tercio inferior sin inclinar el cuello de forma pronunciada.
              </p>
            </div>
          </article>
        </div>

        <!-- Pie del Modal -->
        <div class="pitch-modal-footer">
          <button id="btn-footer-close" class="btn-pitch-done" type="button">
            <span>Entendido, volver al simulador</span>
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  bindEvents() {
    const btnClose = this.element.querySelector('#btn-close-pitch');
    const btnFooterClose = this.element.querySelector('#btn-footer-close');

    const closeHandler = () => this.close();
    btnClose?.addEventListener('click', closeHandler);
    btnFooterClose?.addEventListener('click', closeHandler);

    // Cerrar al hacer clic en el backdrop
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    // Cerrar con Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    eventBus.on('open-pitch-modal', () => {
      this.open();
    });
  }

  open() {
    this.isOpen = true;
    this.container.classList.remove('hidden');
    this.element.classList.add('visible');
  }

  close() {
    this.isOpen = false;
    this.element.classList.remove('visible');
    setTimeout(() => {
      this.container.classList.add('hidden');
    }, 240);
  }
}
