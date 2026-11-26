attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  // Coordenadas UV normalizadas [0, 1] coherentes:
  // y = 1.0 (Arriba / Lejos / Fondo), y = 0.0 (Abajo / Cerca / Escritorio / Pastilla Bifocal)
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
