import { eventBus } from './event-bus.js';

/**
 * Gestor de Inactividad y Modo Mostrador / Kiosk para Optix™
 * Retorna automáticamente a la portada de bienvenida tras 5 minutos sin interacción
 * Admite override para testing mediante la URL: /?timeout=2000 (en milisegundos)
 */
export class IdleManager {
  constructor() {
    this.timer = null;
    this.isActive = false;

    // Duración por defecto: 5 minutos (300.000 ms)
    this.duration = 5 * 60 * 1000;

    // Lectura de parámetro URL /?timeout=2000
    this.checkUrlOverride();

    this.onUserActivity = () => this.resetTimer();
  }

  checkUrlOverride() {
    try {
      const params = new URLSearchParams(window.location.search);
      const customTimeout = params.get('timeout');
      if (customTimeout && !isNaN(Number(customTimeout))) {
        this.duration = Math.max(500, Number(customTimeout));
        console.info(`Optix IdleManager: Timeout configurado vía URL a ${this.duration} ms.`);
      }
    } catch (e) {
      // Ignorar si no está en entorno con window.location
    }
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;

    const events = ['pointerdown', 'pointermove', 'touchstart', 'touchmove', 'wheel', 'keydown', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, this.onUserActivity, { passive: true });
    });

    this.resetTimer();
  }

  stop() {
    this.isActive = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const events = ['pointerdown', 'pointermove', 'touchstart', 'touchmove', 'wheel', 'keydown', 'click'];
    events.forEach((evt) => {
      window.removeEventListener(evt, this.onUserActivity);
    });
  }

  resetTimer() {
    if (!this.isActive) return;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      console.info('Optix IdleManager: Tiempo de inactividad alcanzado. Retornando a portada.');
      eventBus.emit('idle-timeout');
    }, this.duration);
  }
}

export const idleManager = new IdleManager();
