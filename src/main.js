import { WebGLRenderer } from './engine/webgl-renderer.js';
import { CameraController } from './core/camera-controller.js';
import { eventBus } from './core/event-bus.js';
import { idleManager } from './core/idle-manager.js';
import { getAssetUrl } from './core/asset-helper.js';
import { Preloader } from './components/preloader.js';
import { LandingScreen } from './components/landing-screen.js';
import { GlassesHUD } from './components/glasses-hud.js';
import { HudHeader } from './components/hud-header.js';
import { LensSelector } from './components/lens-selector.js';
import { ExperienceCard } from './components/experience-card.js';

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

    this.isExperienceActive = false;
    this.isPreloadFinished = false;

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
    try {
      const canvas = document.getElementById('sim-canvas');
      this.renderer = new WebGLRenderer(canvas);
    } catch (e) {
      console.warn('Optix: No se pudo inicializar WebGLRenderer:', e);
    }

    // 4. Inicializar Controlador Cinemático de Mirada
    try {
      this.camera = new CameraController();
      const viewport = document.getElementById('sim-viewport');
      this.camera.attachElement(viewport);
    } catch (e) {
      console.warn('Optix: Error en CameraController:', e);
    }

    // 5. Inicializar Montura Oftálmica en Primera Persona
    try {
      const glassesContainer = document.getElementById('glasses-container');
      this.glasses = new GlassesHUD(glassesContainer);
    } catch (e) {
      console.warn('Optix: Error en GlassesHUD:', e);
    }

    // 6. Inicializar Cabecera HUD
    try {
      const hudContainer = document.getElementById('hud-header');
      this.hudHeader = new HudHeader(hudContainer);
    } catch (e) {
      console.warn('Optix: Error en HudHeader:', e);
    }

    // 7. Inicializar Selector de Lentes y Gamas
    try {
      const lensContainer = document.getElementById('lens-selector-container');
      this.lensSelector = new LensSelector(lensContainer);
    } catch (e) {
      console.warn('Optix: Error en LensSelector:', e);
    }

    // 8. Inicializar Ficha de Experiencia del Paciente
    try {
      const cardContainer = document.getElementById('experience-card-container');
      this.experienceCard = new ExperienceCard(cardContainer);
    } catch (e) {
      console.warn('Optix: Error en ExperienceCard:', e);
    }

    // 9. Vincular Eventos Globales
    this.bindEvents();

    // 10. Bucle de Sincronización de Cámara y Renderizado (60-120 FPS)
    this.startCameraSyncLoop();

    // 11. Precargar Activos Fotónicos en la GPU con seguro de timeout
    await this.preloadAssets();
  }

  finishPreload() {
    if (this.isPreloadFinished) return;
    this.isPreloadFinished = true;

    if (this.preloader) {
      this.preloader.complete();
    }
    if (this.landing) {
      this.landing.show();
    }
  }

  async preloadAssets() {
    // Seguro de tiempo máximo: si por lentitud de red o hardware tarda más de 2 segundos,
    // mostrar sí o sí la portada para garantizar interacción inmediata.
    const safetyTimer = setTimeout(() => {
      this.finishPreload();
    }, 2200);

    try {
      if (this.preloader) {
        this.preloader.updateStatus('Cargando escena 4K Ultra HD...');
      }

      const sceneUrl = getAssetUrl('scenes/skyline-workstation-4k.jpg?v=calibrated-v4');
      const depthUrl = getAssetUrl('scenes/skyline-workstation-depth.png?v=calibrated-v4');

      if (this.renderer) {
        await this.renderer.loadTexture(sceneUrl, false);
        if (this.preloader) {
          this.preloader.updateStatus('Compilando mapa de profundidad y shaders CoC...');
        }
        await this.renderer.loadTexture(depthUrl, true);
        this.renderer.render();
      }

      clearTimeout(safetyTimer);
      if (this.preloader) {
        this.preloader.updateStatus('Motor preparado.');
      }

      setTimeout(() => {
        this.finishPreload();
      }, 350);

    } catch (err) {
      console.warn('Optix: Error precargando texturas:', err);
      clearTimeout(safetyTimer);
      this.finishPreload();
    }
  }

  bindEvents() {
    // Evento: Usuario pulsa "Iniciar Experiencia"
    eventBus.on('experience-started', () => {
      this.isExperienceActive = true;
      if (this.renderer) {
        this.renderer.start();
      }
      idleManager.start();

      // Desvanecer la píldora de guía gestual tras 4.5 segundos
      const hint = document.getElementById('gaze-hint');
      if (hint) {
        setTimeout(() => {
          hint.classList.add('fade-out');
        }, 4500);
      }
    });

    // Evento: Clic en Logo de la Cabecera -> Regresar a Portada
    eventBus.on('return-to-landing', () => {
      this.isExperienceActive = false;
      idleManager.stop();
      if (this.camera) {
        this.camera.reset();
      }
      if (this.renderer) {
        this.renderer.stop();
      }
      // Nota: No se fuerza la salida de pantalla completa; se respeta el modo kiosco/inmersivo
      if (this.landing) {
        this.landing.show();
      }
    });

    // Evento: Inactividad alcanzada (Modo Mostrador / Kiosk)
    eventBus.on('idle-timeout', () => {
      this.isExperienceActive = false;
      idleManager.stop();
      if (this.camera) {
        this.camera.reset();
      }
      if (this.renderer) {
        this.renderer.stop();
      }
      if (this.landing) {
        this.landing.show();
      }
    });

    // Evento: Cambio de Lente o Submodo
    eventBus.on('lens-changed', (info) => {
      if (this.renderer) {
        this.renderer.setLens(info.typeIndex, info.subModeIndex);
      }
    });

    // Evento: Toggle de Modo Rayos X / Mapa del Lente
    eventBus.on('overlay-toggled', (isActive) => {
      if (this.renderer) {
        this.renderer.setOverlay(isActive);
      }
    });

    // Evento: Centrar Mirada
    eventBus.on('recenter-camera', () => {
      if (this.camera) {
        this.camera.reset();
      }
    });
  }

  startCameraSyncLoop() {
    const loop = () => {
      if (this.camera && this.renderer) {
        this.camera.update();
        this.renderer.setCamera(this.camera.yaw, this.camera.pitch);
      }
      requestAnimationFrame(loop);
    };
    loop();
  }
}

// Inicialización robusta compatible con carga diferida y módulos ES
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
