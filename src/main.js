import { WebGLRenderer } from './engine/webgl-renderer.js';
import { CameraController } from './core/camera-controller.js';
import { eventBus } from './core/event-bus.js';
import { idleManager } from './core/idle-manager.js';
import { Preloader } from './components/preloader.js';
import { LandingScreen } from './components/landing-screen.js';
import { GlassesHUD } from './components/glasses-hud.js';
import { HudHeader } from './components/hud-header.js';
import { LensSelector } from './components/lens-selector.js';
import { ExperienceCard } from './components/experience-card.js';
import { PitchModal } from './components/pitch-modal.js';

/**
 * Orquestador Maestro de la Aplicación Optix™
 */
class App {
  constructor() {
    this.renderer = null;
    this.camera = null;
    this.preloader = null;
    this.landing = null;
    this.glasses = null;
    this.hudHeader = null;
    this.lensSelector = null;
    this.experienceCard = null;
    this.pitchModal = null;

    this.isExperienceActive = false;

    this.init();
  }

  async init() {
    // 1. Inicializar Preloader Circular
    const preloaderContainer = document.getElementById('preloader-container');
    this.preloader = new Preloader(preloaderContainer);

    // 2. Inicializar Portada de Bienvenida
    const landingContainer = document.getElementById('landing-container');
    this.landing = new LandingScreen(landingContainer);

    // 3. Inicializar Motor WebGL
    const canvas = document.getElementById('sim-canvas');
    this.renderer = new WebGLRenderer(canvas);

    // 4. Inicializar Controlador Cinemático de Mirada
    this.camera = new CameraController();
    const viewport = document.getElementById('sim-viewport');
    this.camera.attachElement(viewport);

    // 5. Inicializar Montura Oftálmica en Primera Persona
    const glassesContainer = document.getElementById('glasses-container');
    this.glasses = new GlassesHUD(glassesContainer);

    // 6. Inicializar Cabecera HUD
    const hudContainer = document.getElementById('hud-header');
    this.hudHeader = new HudHeader(hudContainer);

    // 7. Inicializar Selector de Lentes y Gamas
    const lensContainer = document.getElementById('lens-selector-container');
    this.lensSelector = new LensSelector(lensContainer);

    // 8. Inicializar Ficha de Experiencia del Paciente
    const cardContainer = document.getElementById('experience-card-container');
    this.experienceCard = new ExperienceCard(cardContainer);

    // 9. Inicializar Modal de Guía Clínica de Mostrador
    const modalContainer = document.getElementById('pitch-modal-container');
    this.pitchModal = new PitchModal(modalContainer);

    // 10. Vincular Eventos Globales
    this.bindEvents();

    // 11. Bucle de Sincronización de Cámara y Renderizado (60-120 FPS)
    this.startCameraSyncLoop();

    // 12. Precargar Activos Fotónicos en la GPU
    await this.preloadAssets();
  }

  async preloadAssets() {
    try {
      this.preloader.updateStatus('Cargando placa fotográfica 2K...');
      const baseUrl = import.meta.env.BASE_URL || './';
      const sceneUrl = `${baseUrl}scenes/office-master.jpg`.replace(/\/\//g, '/');
      const depthUrl = `${baseUrl}scenes/office-depth.png`.replace(/\/\//g, '/');

      await this.renderer.loadTexture(sceneUrl, false);

      this.preloader.updateStatus('Compilando mapa de profundidad y shaders CoC...');
      await this.renderer.loadTexture(depthUrl, true);

      // Renderizar un primer cuadro en buffer de fondo para precalentar la GPU
      this.renderer.render();

      this.preloader.updateStatus('Motor preparado.');
      setTimeout(() => {
        this.preloader.complete();
        this.landing.show();
      }, 400);

    } catch (err) {
      console.error('Error precargando activos de Optix:', err);
      this.preloader.updateStatus('Error al cargar texturas. Reintentando...');
      // En caso de fallo de red puntual, permitir continuar
      setTimeout(() => {
        this.preloader.complete();
        this.landing.show();
      }, 1000);
    }
  }

  bindEvents() {
    // Evento: Usuario pulsa "Iniciar Experiencia"
    eventBus.on('experience-started', () => {
      this.isExperienceActive = true;
      this.renderer.start();
      idleManager.start();

      // Desvanecer la píldora de guía gestual tras 4.5 segundos
      const hint = document.getElementById('gaze-hint');
      if (hint) {
        setTimeout(() => {
          hint.classList.add('fade-out');
        }, 4500);
      }
    });

    // Evento: Inactividad alcanzada (Modo Mostrador / Kiosk)
    eventBus.on('idle-timeout', () => {
      this.isExperienceActive = false;
      idleManager.stop();
      this.camera.reset();
      this.pitchModal.close();
      this.landing.show();
    });

    // Evento: Cambio de Lente o Submodo
    eventBus.on('lens-changed', (info) => {
      this.renderer.setLens(info.typeIndex, info.subModeIndex);
    });

    // Evento: Toggle de Modo Rayos X / Mapa del Lente
    eventBus.on('overlay-toggled', (isActive) => {
      this.renderer.setOverlay(isActive);
    });

    // Evento: Centrar Mirada
    eventBus.on('recenter-camera', () => {
      this.camera.reset();
    });
  }

  startCameraSyncLoop() {
    const loop = () => {
      this.camera.update();
      this.renderer.setCamera(this.camera.yaw, this.camera.pitch);
      requestAnimationFrame(loop);
    };
    loop();
  }
}

// Inicialización al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
