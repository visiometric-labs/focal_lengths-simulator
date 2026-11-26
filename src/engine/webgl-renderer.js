import vertexShaderSource from './shaders/focal-vertex.glsl?raw';
import fragmentShaderSource from './shaders/focal-fragment.glsl?raw';

/**
 * Motor de Renderizado WebGL 2D/CoC de Alto Rendimiento para Optix™
 * Ejecuta el cálculo óptico en tiempo real en la GPU a 60-120 FPS
 */
export class WebGLRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.gl = null;
    this.program = null;

    // Texturas
    this.sceneTexture = null;
    this.depthTexture = null;
    this.maskTexture = null;
    this.isSceneLoaded = false;
    this.isDepthLoaded = false;

    // Canvas fuera de pantalla para generar la máscara exacta de apertura del marco SVG
    this.maskCanvas = null;
    this.maskCtx = null;

    // Estado Uniforms: experiencia inicia en Monofocal Lejos (petición clínica)
    this.camera = { yaw: 0.0, pitch: 0.0 };
    this.lensType = 0.0;       // 0: Monofocal por defecto
    this.subMode = 0.0;        // 0: Visión Lejana por defecto
    this.overlayActive = 0.0;  // Rayos X apagado por defecto

    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    this.isRunning = false;
    this.animId = null;

    this.init();
  }

  init() {
    const glOptions = {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    };

    this.gl = this.canvas.getContext('webgl2', glOptions) ||
              this.canvas.getContext('webgl', glOptions) ||
              this.canvas.getContext('experimental-webgl', glOptions);

    if (!this.gl) {
      console.error('Optix: WebGL no está soportado en este dispositivo/navegador.');
      return;
    }

    this.setupContextLossHandlers();
    this.buildShaders();
    this.setupQuad();
    this.handleResize();

    window.addEventListener('resize', () => this.handleResize());
  }

  setupContextLossHandlers() {
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('Optix: Contexto WebGL perdido. Pausando renderizador.');
      this.stop();
    }, false);

    this.canvas.addEventListener('webglcontextrestored', () => {
      console.info('Optix: Contexto WebGL restaurado. Recompilando shaders y texturas.');
      this.buildShaders();
      this.setupQuad();
      this.reloadTextures();
      this.start();
    }, false);
  }

  buildShaders() {
    const gl = this.gl;
    const vs = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Optix Shader Link Error:', gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return;
    }

    this.program = prog;
    gl.useProgram(this.program);

    // Mapeo de Uniforms
    this.locations = {
      position: gl.getAttribLocation(prog, 'a_position'),
      sceneTex: gl.getUniformLocation(prog, 'u_sceneTex'),
      depthTex: gl.getUniformLocation(prog, 'u_depthTex'),
      maskTex: gl.getUniformLocation(prog, 'u_maskTex'),
      resolution: gl.getUniformLocation(prog, 'u_resolution'),
      camera: gl.getUniformLocation(prog, 'u_camera'),
      lensType: gl.getUniformLocation(prog, 'u_lensType'),
      subMode: gl.getUniformLocation(prog, 'u_subMode'),
      overlayActive: gl.getUniformLocation(prog, 'u_overlayActive'),
      aspect: gl.getUniformLocation(prog, 'u_aspect'),
    };
  }

  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Optix Shader Compilation Error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  setupQuad() {
    const gl = this.gl;
    // Dos triángulos que cubren la pantalla completa (clip space -1 a 1)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }

  handleResize() {
    if (!this.canvas || !this.gl) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Regenerar la textura de máscara de apertura para que coincida exactamente con el marco SVG
    this.updateMaskTexture();
  }

  /**
   * Genera dinámicamente en GPU la máscara de apertura binocular
   * Calibrada al bisel exacto del SVG (100% de coherencia visual sin brechas de desenfoque)
   */
  updateMaskTexture() {
    const gl = this.gl;
    if (!gl) return;

    if (!this.maskCanvas) {
      this.maskCanvas = document.createElement('canvas');
      this.maskCtx = this.maskCanvas.getContext('2d');
    }

    const aspect = this.canvas.width / this.canvas.height;
    const maskW = 1024;
    const maskH = Math.max(320, Math.round(1024 / aspect));

    this.maskCanvas.width = maskW;
    this.maskCanvas.height = maskH;

    const ctx = this.maskCtx;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, maskW, maskH);

    // Reproducción exacta de preserveAspectRatio="xMidYMid slice" para viewBox="0 0 1920 1080"
    const scale = Math.max(maskW / 1920, maskH / 1080);
    const ox = (maskW - 1920 * scale) / 2;
    const oy = (maskH - 1080 * scale) / 2;

    const tx = (x) => ox + x * scale;
    const ty = (y) => oy + y * scale;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    // Apertura binocular que llega 100% al bisel interno de las gafas
    ctx.moveTo(tx(128), ty(118));
    ctx.bezierCurveTo(tx(605), ty(83), tx(1315), ty(83), tx(1792), ty(118));
    ctx.bezierCurveTo(tx(1868), ty(480), tx(1858), ty(775), tx(1752), ty(942));
    ctx.bezierCurveTo(tx(1415), ty(1010), tx(1148), ty(1000), tx(1022), ty(922));
    ctx.bezierCurveTo(tx(992), ty(882), tx(960), ty(868), tx(928), ty(882));
    ctx.bezierCurveTo(tx(898), ty(922), tx(772), ty(1000), tx(505), ty(1010));
    ctx.bezierCurveTo(tx(285), ty(1010), tx(195), ty(972), tx(168), ty(942));
    ctx.bezierCurveTo(tx(60), ty(775), tx(50), ty(480), tx(128), ty(118));
    ctx.closePath();
    ctx.fill();

    if (!this.maskTexture) {
      this.maskTexture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this.maskTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.maskCanvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  /**
   * Carga y vincula una textura fotográfica en memoria GPU
   */
  loadTexture(url, isDepth = false) {
    const gl = this.gl;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Invertir Y al subir textura para que el plano superior (y=1) coincida con la parte superior de la imagen
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        // Muestreo bilineal con clamp to edge para cero costuras
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        if (isDepth) {
          this.depthTexture = texture;
          this.isDepthLoaded = true;
          this.depthUrl = url;
        } else {
          this.sceneTexture = texture;
          this.isSceneLoaded = true;
          this.sceneUrl = url;
        }

        resolve(texture);
      };
      img.onerror = (err) => {
        console.error(`Error cargando textura Optix desde ${url}:`, err);
        reject(err);
      };
      img.src = url;
    });
  }

  reloadTextures() {
    if (this.sceneUrl) this.loadTexture(this.sceneUrl, false);
    if (this.depthUrl) this.loadTexture(this.depthUrl, true);
  }

  setCamera(yaw, pitch) {
    this.camera.yaw = yaw;
    this.camera.pitch = pitch;
  }

  setLens(lensType, subMode) {
    this.lensType = Number(lensType);
    this.subMode = Number(subMode);
  }

  setOverlay(isActive) {
    this.overlayActive = isActive ? 1.0 : 0.0;
  }

  render() {
    const gl = this.gl;
    if (!gl || !this.program || !this.isSceneLoaded || !this.isDepthLoaded) return;

    gl.useProgram(this.program);

    // 1. Activar Textura 0: Escena Maestra
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    gl.uniform1i(this.locations.sceneTex, 0);

    // 2. Activar Textura 1: Mapa de Profundidad
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.uniform1i(this.locations.depthTex, 1);

    // 3. Activar Textura 2: Máscara de Apertura Binocular (Bisel de Montura)
    if (this.maskTexture) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.maskTexture);
      gl.uniform1i(this.locations.maskTex, 2);
    }

    // 4. Subir Uniforms de Resolución y Pantalla
    gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.locations.aspect, this.canvas.width / this.canvas.height);

    // 4. Subir Uniforms de Control Óptico
    gl.uniform2f(this.locations.camera, this.camera.yaw, this.camera.pitch);
    gl.uniform1f(this.locations.lensType, this.lensType);
    gl.uniform1f(this.locations.subMode, this.subMode);
    gl.uniform1f(this.locations.overlayActive, this.overlayActive);

    // 5. Dibujar Quad
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
