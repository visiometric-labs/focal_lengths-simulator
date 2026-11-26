attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  // Coordenadas UV normalizadas [0, 1]
  v_uv = (a_position + 1.0) * 0.5;
  // Invertir Y para mapeo estándar de texturas WebGL
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
