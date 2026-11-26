/**
 * Controlador Cinemático de Cabeza y Cuello en Primera Persona (POV)
 * Maneja rotaciones con inercia física, fricción y soporte táctil/mouse
 */
export class CameraController {
  constructor() {
    // Rotación actual (suavizada)
    this.yaw = 0.0;
    this.pitch = 0.0;

    // Rotación objetivo (impulsada por gestos táctiles o ratón)
    this.targetYaw = 0.0;
    this.targetPitch = 0.0;

    // Límites anatómicos de movimiento de cabeza/ojos
    this.maxYaw = 0.42;    // Giro lateral izq / der
    this.maxPitch = 0.38;  // Cabeceo vertical arriba (lejos) / abajo (cerca)

    this.sensitivity = 0.0016;
    this.lerpSpeed = 0.12;

    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
  }

  attachElement(domElement) {
    if (!domElement) return;

    // Control unificado Pointer Events (Mouse, Touch, Stylus)
    domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e), { passive: false });
    window.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));
  }

  onPointerDown(e) {
    // Si el clic ocurrió sobre un control interactivo (botón, selector), no arrastrar cámara
    if (e.target && e.target.closest('button, nav, aside, a, input')) {
      return;
    }

    this.isDragging = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
  }

  onPointerMove(e) {
    if (!this.isDragging) return;

    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;

    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;

    // Arrastrar la pantalla: movimiento directo natural en 1ª persona (POV)
    // Deslizar a la derecha (dx > 0) -> girar cabeza/ojos a la derecha (+yaw)
    // Deslizar hacia abajo (dy > 0) -> inclinar cabeza/ojos hacia abajo (-pitch, escritorio/celular)
    this.targetYaw += dx * this.sensitivity;
    this.targetPitch -= dy * this.sensitivity;

    // Restringir a los límites anatómicos
    this.targetYaw = Math.max(-this.maxYaw, Math.min(this.maxYaw, this.targetYaw));
    this.targetPitch = Math.max(-this.maxPitch, Math.min(this.maxPitch, this.targetPitch));
  }

  onPointerUp() {
    this.isDragging = false;
  }

  update() {
    // Interpolación exponencial (lerp) para suavidad fluida a 60-120 FPS
    this.yaw += (this.targetYaw - this.yaw) * this.lerpSpeed;
    this.pitch += (this.targetPitch - this.pitch) * this.lerpSpeed;
  }

  reset() {
    this.targetYaw = 0.0;
    this.targetPitch = 0.0;
  }
}
