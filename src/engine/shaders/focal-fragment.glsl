#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;

uniform sampler2D u_sceneTex;
uniform sampler2D u_depthTex;
uniform sampler2D u_maskTex;        // Máscara de apertura binocular exacta del marco SVG
uniform vec2 u_resolution;
uniform vec2 u_camera;             // (yaw, pitch) normalizados
uniform float u_lensType;           // 0: Monofocal, 1: Bifocal, 2: Progresivo
uniform float u_subMode;            // Monofocal (0: Lejos, 1: Cerca) | Progresivo (0: Baja, 1: Media, 2: Med-Alta, 3: Alta)
uniform float u_overlayActive;      // 0.0: Apagado, 1.0: Modo Rayos X activo
uniform float u_aspect;             // Ancho / Alto

// Pastilla Flat-Top anatómica amplia: D-Shape con borde superior plano y esquinas inferiores redondeadas
bool isInsideFlatTop(vec2 uv, float cx) {
  float segTop = 0.43;
  float segBottom = 0.06;
  float halfWidth = 0.19; // Pastilla amplia para lectura cómoda
  
  if (uv.y > segTop || uv.y < segBottom) return false;
  
  float dx = abs(uv.x - cx);
  if (dx > halfWidth) return false;
  
  // Esquinas inferiores redondeadas características del Flat-Top de laboratorio
  float roundR = 0.08;
  if (uv.y < segBottom + roundR) {
    float dy = (segBottom + roundR) - uv.y;
    float cornerX = halfWidth - roundR;
    if (dx > cornerX) {
      return length(vec2(dx - cornerX, dy)) <= roundR;
    }
  }
  return true;
}

void main() {
  // 1. Mapeo de coordenadas con paneo de cámara (rango amplio de exploración POV calibrado)
  // Zoom = 1.72 y factores de paneo garantizan sceneUV estrictamente dentro de [0.002, 0.998]
  // permitiendo visualización completa del escritorio abajo (y->0) y cielo arriba (y->1)
  vec2 camOffset = u_camera * vec2(0.235, 0.215);
  vec2 sceneUV = (v_uv - 0.5) / 1.72 + 0.5 + camOffset;
  sceneUV = clamp(sceneUV, 0.001, 0.999);

  // 2. Determinar si estamos dentro del cristal óptico o en la periferia
  // Muestreo de textura de apertura exacta generada desde el bisel de la montura
  float inGlasses = texture2D(u_maskTex, v_uv).r;

  // 3. Lectura de profundidad física del píxel (0.0 = celular/manos, 0.5 = laptop, 0.95 = fondo lejano)
  float pixelDepth = texture2D(u_depthTex, sceneUV).r;

  // 4. Cálculo de la potencia focal objetivo del lente en este píxel
  float targetFocus = 0.95; // Por defecto infinito
  float extraAberration = 0.0;
  float imageJumpY = 0.0;
  float overlayGlow = 0.0;

  vec2 localUV = v_uv;

  if (u_lensType < 0.5) {
    // -----------------------------------------------------------------
    // CASO A: MONOFOCAL
    // -----------------------------------------------------------------
    if (u_subMode < 0.5) {
      targetFocus = 0.95; // Lejos
    } else {
      targetFocus = 0.16; // Cerca
    }

    if (u_overlayActive > 0.5 && inGlasses > 0.5) {
      overlayGlow = 0.15;
    }

  } else if (u_lensType < 1.5) {
    // -----------------------------------------------------------------
    // CASO B: BIFOCAL FLAT-TOP 28 (Pastillas anatómicas D-Shape en cada ojo)
    // -----------------------------------------------------------------
    // Segmento D-Shape amplio izquierdo (cx ≈ 0.32) y derecho (cx ≈ 0.68)
    // Confinadas estrictamente al cristal (inGlasses > 0.5) para que NUNCA sobresalgan del marco
    bool inLeftSeg = isInsideFlatTop(localUV, 0.32);
    bool inRightSeg = isInsideFlatTop(localUV, 0.68);
    bool insideSegment = (inLeftSeg || inRightSeg) && (inGlasses > 0.5);

    if (insideSegment) {
      targetFocus = 0.16;  // Cerca (35 cm)
      imageJumpY = 0.022; // Salto prismático
    } else {
      targetFocus = 0.95;  // Lejos (>3 m)
    }

    // Demarcación puramente óptica; resplandor sólo en modo Rayos X activo
    if (u_overlayActive > 0.5 && insideSegment) {
      overlayGlow += 0.25;
    }

  } else {
    // -----------------------------------------------------------------
    // CASO C: PROGRESIVO CONTINUO (4 GAMAS: Lejos arriba, Cerca abajo)
    // -----------------------------------------------------------------
    float t = smoothstep(0.20, 0.80, localUV.y);
    targetFocus = mix(0.16, 0.95, t); // Abajo t=0 -> 0.16 (cerca), Arriba t=1 -> 0.95 (lejos)

    float corridorWidth = 0.44;
    float aberrationStrength = 1.0;

    if (u_subMode < 0.5) {
      corridorWidth = 0.28;
      aberrationStrength = 1.70;
    } else if (u_subMode < 1.5) {
      corridorWidth = 0.44;
      aberrationStrength = 1.15;
    } else if (u_subMode < 2.5) {
      corridorWidth = 0.65;
      aberrationStrength = 0.68;
    } else {
      corridorWidth = 0.85;
      aberrationStrength = 0.30;
    }

    float corridorProfile = corridorWidth * (0.8 + 0.4 * abs(localUV.y - 0.55));
    float distFromAxis = abs(localUV.x - 0.5);

    if (distFromAxis > corridorProfile * 0.5) {
      float lateralDist = distFromAxis - corridorProfile * 0.5;
      extraAberration = pow(lateralDist * 3.2, 1.8) * aberrationStrength;
    }

    if (u_overlayActive > 0.5 && inGlasses > 0.5) {
      float edgeDist = abs(distFromAxis - corridorProfile * 0.5);
      if (edgeDist < 0.006) {
        overlayGlow += 0.90;
      }
      if (distFromAxis > corridorProfile * 0.5) {
        overlayGlow += min(extraAberration * 0.25, 0.40);
      }
    }
  }

  // 5. Salto prismático confinado 100% al interior del cristal de las gafas
  vec2 finalSceneUV = sceneUV + (inGlasses > 0.5 ? vec2(0.0, imageJumpY) : vec2(0.0));
  finalSceneUV = clamp(finalSceneUV, 0.001, 0.999);

  // 6. Radio de desenfoque Circle of Confusion (CoC)
  // Dentro del lente: agudeza según prescripción y aberración lateral progresiva
  float focalDiff = abs(pixelDepth - targetFocus);
  float inGlassesCoc = focalDiff * 28.0 + extraAberration * 24.0;

  // Periferia natural presbita fuera del cristal: el ojo no acomoda en cerca/intermedio
  float presbyopiaCoc = clamp((0.95 - pixelDepth) * 26.0, 0.0, 24.0);

  // Fusión perfecta que llega 100% hasta el bisel del marco
  float coc = mix(presbyopiaCoc, inGlassesCoc, inGlasses);
  coc = min(coc, 32.0);

  // 7. Muestreo Bokeh con Espiral Dorada (Golden Spiral)
  // 100% universalmente compatible sin constructores de arrays
  vec4 colorAccum = vec4(0.0);
  float totalWeight = 0.0;
  vec2 texelSize = 1.0 / u_resolution;

  vec4 centerCol = texture2D(u_sceneTex, finalSceneUV);
  colorAccum += centerCol * 1.5;
  totalWeight += 1.5;

  if (coc > 0.6) {
    for (int i = 0; i < 12; i++) {
      float fi = float(i);
      float r = sqrt((fi + 0.5) / 12.0);
      float theta = fi * 2.39996323; // Golden angle
      vec2 offset = vec2(cos(theta), sin(theta)) * r * coc * texelSize;
      vec2 sampleUV = clamp(finalSceneUV + offset, 0.001, 0.999);
      colorAccum += texture2D(u_sceneTex, sampleUV);
      totalWeight += 1.0;
    }
  }

  vec3 finalColor = colorAccum.rgb / totalWeight;

  // 8. Resplandor Rayos X
  if (overlayGlow > 0.01) {
    vec3 cyanGlow = vec3(0.0, 0.95, 1.0);
    finalColor = mix(finalColor, cyanGlow, overlayGlow * 0.75);
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
