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

    // Límites anatómicos de movimiento de cabeza/ojos (rango panorámico ultra amplio)
    this.maxYaw = 0.88;          // Giro lateral izq / der amplio
    this.maxPitchUp = 1.05;      // Inclinación hacia arriba (cúspides de rascacielos y cielo abierto)
    this.maxPitchDown = 1.15;    // Inclinación hacia abajo completa (lectura de libreta, tablet y borde del escritorio)

    this.sensitivity = 0.0022;
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

    // Arrastre POV: Eje X y Eje Y configurados según preferencia ergonómica del usuario
    this.targetYaw -= dx * this.sensitivity;
    this.targetPitch += dy * this.sensitivity;

    // Restringir a los límites anatómicos ampliados
    this.targetYaw = Math.max(-this.maxYaw, Math.min(this.maxYaw, this.targetYaw));
    this.targetPitch = Math.max(-this.maxPitchDown, Math.min(this.maxPitchUp, this.targetPitch));
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
