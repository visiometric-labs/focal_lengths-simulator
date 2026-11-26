precision highp float;

varying vec2 v_uv;

uniform sampler2D u_sceneTex;
uniform sampler2D u_depthTex;
uniform vec2 u_resolution;
uniform vec2 u_camera;         // (yaw, pitch) normalizados
uniform float u_lensType;       // 0: Monofocal, 1: Bifocal, 2: Progresivo
uniform float u_subMode;        // Monofocal (0: Lejos, 1: Cerca) | Progresivo (0: Baja, 1: Media, 2: Med-Alta, 3: Alta)
uniform float u_overlayActive;  // 0.0: Apagado, 1.0: Modo Rayos X activo
uniform float u_aspect;         // Ancho / Alto

// Muestra de 12 puntos en disco de Poisson para Bokeh fotográfico continuo
const int SAMPLES = 12;
const vec2 POISSON[12] = vec2[](
  vec2(-0.326, -0.406),
  vec2(-0.840, -0.074),
  vec2(-0.696,  0.457),
  vec2(-0.203,  0.621),
  vec2( 0.962, -0.195),
  vec2( 0.473, -0.480),
  vec2( 0.519,  0.767),
  vec2( 0.185, -0.893),
  vec2( 0.507,  0.064),
  vec2( 0.896,  0.412),
  vec2(-0.322, -0.933),
  vec2(-0.792, -0.598)
);

// Máscara binocular analítica: determina si el píxel está dentro de las lentes o en la periferia
float getGlassesMask(vec2 p) {
  // Ajuste por relación de aspecto centrada
  vec2 uv = (p - 0.5) * vec2(u_aspect, 1.0);
  
  // Lente izquierdo (centrado en x = -0.36)
  vec2 leftP = uv - vec2(-0.35, -0.02);
  leftP.y *= 1.18;
  float dLeft = length(max(abs(leftP) - vec2(0.25, 0.22), 0.0));

  // Lente derecho (centrado en x = +0.36)
  vec2 rightP = uv - vec2(0.35, -0.02);
  rightP.y *= 1.18;
  float dRight = length(max(abs(rightP) - vec2(0.25, 0.22), 0.0));

  // Suavizado en el borde del marco (14mm DoF)
  float insideLeft = 1.0 - smoothstep(0.08, 0.14, dLeft);
  float insideRight = 1.0 - smoothstep(0.08, 0.14, dRight);

  return clamp(insideLeft + insideRight, 0.0, 1.0);
}

void main() {
  // 1. Mapeo de coordenadas con paneo de cámara (inercia de cuello)
  vec2 camOffset = u_camera * vec2(0.18, 0.14);
  vec2 sceneUV = (v_uv - 0.5) / 1.18 + 0.5 + camOffset;
  sceneUV = clamp(sceneUV, 0.001, 0.999);

  // 2. Determinar si estamos dentro del cristal o en la periferia
  float inGlasses = getGlassesMask(v_uv);

  // 3. Lectura de profundidad física del píxel (0.0 = celular, 0.5 = laptop, 0.95 = fondo)
  float pixelDepth = texture2D(u_depthTex, sceneUV).r;

  // 4. Cálculo de la potencia focal objetivo del lente en este píxel
  float targetFocus = 0.95; // Por defecto infinito
  float extraAberration = 0.0;
  float imageJumpY = 0.0;
  float overlayGlow = 0.0;

  // Coordenadas locales dentro de la montura para cálculo de corredor
  vec2 localUV = v_uv;

  if (u_lensType < 0.5) {
    // -----------------------------------------------------------------
    // CASO A: MONOFOCAL
    // -----------------------------------------------------------------
    if (u_subMode < 0.5) {
      // Monofocal Lejos: Foco a infinito (0.95)
      targetFocus = 0.95;
    } else {
      // Monofocal Cerca / Lectura: Foco a 35cm (0.16)
      targetFocus = 0.16;
    }

    if (u_overlayActive > 0.5 && inGlasses > 0.5) {
      // Línea perimetral homogénea sutil
      overlayGlow = 0.15;
    }

  } else if (u_lensType < 1.5) {
    // -----------------------------------------------------------------
    // CASO B: BIFOCAL FLAT-TOP 28
    // -----------------------------------------------------------------
    // La pastilla Flat-Top se ubica en el tercio inferior (y < 0.42 en coordenadas UV)
    // Con un ancho limitado a la zona de lectura de 28mm
    float segTop = 0.44;
    float distToCenter = abs(localUV.x - 0.5);
    bool insideSegment = (localUV.y < segTop) && (distToCenter < 0.38);

    if (insideSegment) {
      // Dentro de la pastilla: Visión cercana nítida (0.16)
      targetFocus = 0.16;
      // Salto de imagen prismático (Image Jump) abrupto
      imageJumpY = 0.022;
    } else {
      // Fuera de la pastilla: Visión lejana (0.95)
      targetFocus = 0.95;
    }

    // Efecto de línea divisoria Flat-Top
    if (abs(localUV.y - segTop) < 0.004 && distToCenter < 0.38 && inGlasses > 0.5) {
      overlayGlow += 0.85; // Línea física visible del bifocal
    }

    if (u_overlayActive > 0.5 && insideSegment && inGlasses > 0.5) {
      overlayGlow += 0.25;
    }

  } else {
    // -----------------------------------------------------------------
    // CASO C: PROGRESIVO CONTINUO (4 GAMAS)
    // -----------------------------------------------------------------
    // Gradación continua y suave vertical: Lejos (arriba) -> Intermedio (medio) -> Cerca (abajo)
    float t = smoothstep(0.20, 0.78, localUV.y);
    targetFocus = mix(0.16, 0.95, t);

    // Parámetros de Corredor según Gama
    float corridorWidth = 0.45; // Por defecto Media
    float aberrationStrength = 1.0;

    if (u_subMode < 0.5) {
      // Gama Baja: Pasillo estrecho (30%), aberraciones notorias
      corridorWidth = 0.28;
      aberrationStrength = 1.70;
    } else if (u_subMode < 1.5) {
      // Gama Media: Pasillo equilibrado (45%)
      corridorWidth = 0.44;
      aberrationStrength = 1.15;
    } else if (u_subMode < 2.5) {
      // Gama Media Alta (Free-Form): Pasillo amplio (65%)
      corridorWidth = 0.65;
      aberrationStrength = 0.68;
    } else {
      // Gama Alta (Panorámico Premium): Pasillo ancho (85%), aberración mínima
      corridorWidth = 0.85;
      aberrationStrength = 0.30;
    }

    // Distancia lateral al eje del pasillo central
    // El pasillo tiene forma ergonómica de embudo / reloj de arena
    float corridorProfile = corridorWidth * (0.8 + 0.4 * abs(localUV.y - 0.55));
    float distFromAxis = abs(localUV.x - 0.5);

    if (distFromAxis > corridorProfile * 0.5) {
      float lateralDist = distFromAxis - corridorProfile * 0.5;
      // Astigmatismo marginal según Teorema de Minkwitz
      extraAberration = pow(lateralDist * 3.2, 1.8) * aberrationStrength;
    }

    // Overlay de Rayos X pedagógico para Progresivos
    if (u_overlayActive > 0.5 && inGlasses > 0.5) {
      // Resaltar los límites del corredor en cian bioluminiscente
      float edgeDist = abs(distFromAxis - corridorProfile * 0.5);
      if (edgeDist < 0.006) {
        overlayGlow += 0.90;
      }
      // Tinte muy suave en las zonas de aberración lateral
      if (distFromAxis > corridorProfile * 0.5) {
        overlayGlow += min(extraAberration * 0.25, 0.40);
      }
    }
  }

  // 5. Aplicar salto prismático de UV si corresponde (Bifocal)
  vec2 finalSceneUV = sceneUV + vec2(0.0, imageJumpY);
  finalSceneUV = clamp(finalSceneUV, 0.001, 0.999);

  // 6. Cálculo del radio de desenfoque físico (Circle of Confusion - CoC)
  float coc = 0.0;
  if (inGlasses > 0.5) {
    // Dentro del cristal: desenfoque en función de la diferencia focal + aberración lateral
    float focalDiff = abs(pixelDepth - targetFocus);
    coc = focalDiff * 26.0 + extraAberration * 22.0;
  } else {
    // Opción A: Fuera del cristal (Periferia): desenfoque presbita natural sin corrección
    coc = 14.0 * abs(pixelDepth - 0.85) + 5.0;
  }

  // Tope de seguridad para suavizado de desenfoque
  coc = min(coc, 32.0);

  // 7. Muestreo de Bokeh Poisson multi-tap a 60 FPS
  vec4 colorAccum = vec4(0.0);
  float totalWeight = 0.0;
  vec2 texelSize = 1.0 / u_resolution;

  // Muestra central
  vec4 centerCol = texture2D(u_sceneTex, finalSceneUV);
  colorAccum += centerCol * 1.5;
  totalWeight += 1.5;

  if (coc > 0.6) {
    for (int i = 0; i < SAMPLES; i++) {
      vec2 offset = POISSON[i] * coc * texelSize;
      vec2 sampleUV = clamp(finalSceneUV + offset, 0.001, 0.999);
      colorAccum += texture2D(u_sceneTex, sampleUV);
      totalWeight += 1.0;
    }
  }

  vec3 finalColor = colorAccum.rgb / totalWeight;

  // 8. Integración del resplandor de Modo Rayos X si está activo
  if (overlayGlow > 0.01) {
    vec3 cyanGlow = vec3(0.0, 0.95, 1.0);
    finalColor = mix(finalColor, cyanGlow, overlayGlow * 0.75);
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
