# 🤖 AI_CONTEXT.md — Guía Maestra para Agentes de IA y Desarrolladores

> **Documento de Contexto y Especificación Técnica para Optix™**  
> Si eres una IA que retoma este proyecto o un desarrollador continuando el trabajo, **lee atentamente este archivo antes de realizar cualquier cambio**.  
> **Documentación de Usuario:** [🇪🇸 README.md (Español)](README.md) • [🇺🇸 README_EN.md (English)](README_EN.md)

---

## 📌 1. Identidad del Proyecto
* **Nombre Oficial:** Optix™ by Visiometric Labs
* **Organización:** Visiometric Labs
* **Autor / Propietario:** JayzirTech
* **Carpeta Local del Proyecto:** `focal_lengths-simulator`
* **Repositorio Remoto en GitHub:** `https://github.com/visiometric-labs/focal_lengths-simulator.git`
* **URL en Producción (GitHub Pages):** `https://visiometric-labs.github.io/focal_lengths-simulator/`
* **Identidad Visual y Activos Gráficos:**
  - `public/branding/og-card-whatsapp.jpg` (y `og-cover.jpg`): Banner social 3D 1200×630 para WhatsApp, Open Graph y Twitter Cards (`?v=2`).
  - `public/branding/og-card-whatsapp.png`: Versión rasterizada PNG sin pérdidas.
  - `public/branding/favicon.svg`: Isotipo vectorial de montura con doble foco óptico.
  - `public/branding/favicon-opt1.png` / `apple-touch-icon.png`: Versiones PNG rasterizadas.
* **Ecosistema de Hermanos (Visiometric Labs):**
  - `filters-simulator` -> **Chromatis** (Simulador clínico de tratamientos ópticos: Blue Cut, Conducción, Crizal Antirreflejo)
  - `refraction-simulator` -> **Ocularis** (Simulador clínico de refracción óptica, patologías y anatomía ocular)
  - `transitions-simulator` -> **Luminix** (Simulador y probador virtual de lentes fotosensibles y tecnología Transitions)
  - `focal_lengths-simulator` -> **Optix** (Simulador de distancias focales, campos visuales, Minkwitz y 4 gamas progresivas)

---

## 🌿 2. Estrategia de Ramas Git y Despliegue CI/CD
* **Rama de Trabajo Predeterminada:** **`dev`**
  - Cualquier nueva característica, ajuste o sesión de trabajo **debe realizarse en la rama `dev`**.
* **Rama de Producción:** **`main`**
  - Reservada exclusivamente para versiones estables.
  - El flujo `.github/workflows/deploy.yml` compila con `vite build --base=/focal_lengths-simulator/` y despliega automáticamente en **GitHub Pages** únicamente cuando se hace push a `main`.
* **Regla de Oro:** **NUNCA** desarrollar directamente sobre `main` sin pasar por `dev`. Una vez probado en `dev`, se fusiona en `main` mediante fast-forward y se empuja a `origin/main`.

---

## 🔬 3. Arquitectura Implementada y Estado Actual

La plataforma cuenta con una arquitectura de grado clínico renderizada en tiempo real mediante WebGL a 60 FPS:

### A. Motor de Renderizado WebGL y Pipeline de Shaders
* Archivos: `src/engine/webgl-renderer.js`, `src/engine/shaders/focal-vertex.glsl`, `src/engine/shaders/focal-fragment.glsl`.
* **Circle of Confusion (CoC):**
  $$\text{CoC} = |Z_{\text{pixel}} - F_{\text{lens}}| \times 28.0 + \text{Aberración}_{\text{lateral}} \times 24.0$$
* **Muestreo Bokeh con Espiral Dorada (Golden Spiral):** 12 muestras angulares (`theta = fi * 2.39996323`) con radio cuadrático sin constructores dinámicos de arrays (100% compatible con WebGL 1.0 y WebGL 2.0).
* **Teorema de Minkwitz para Progresivos:**
  - Función continua `smoothstep(0.20, 0.80, localUV.y)` mapea de 0.16 (cerca) a 0.95 (lejos).
  - 4 gamas con ensanchamiento de corredor útil: Básica (0.28), Media (0.44), Media-Alta (0.65), Alta (0.85).
* **Bifocal Flat-Top 28:**
  - Pastilla anatómica D-Shape en cada ojo (`cx = 0.32` y `cx = 0.68`) con esquinas inferiores redondeadas.
  - Confinada 100% al interior del cristal (`inGlasses > 0.5`) para no desbordar el marco.
  - Salto prismático vertical (`imageJumpY = 0.022`) en la frontera.

### B. Cinemática Fisiológica de Mirada (POV)
* Archivo: `src/core/camera-controller.js`.
* Rotación de cuello con límites anatómicos ampliados:
  - `maxYaw = 0.88` (giro lateral).
  - `maxPitchUp = 1.05` (mirar hacia el cielo/rascacielos).
  - `maxPitchDown = 1.15` (mirar hacia el escritorio, libreta y teclado).
* Suavizado exponencial (`lerpSpeed = 0.12`) e inercia física con soporte unificado de Pointer Events (táctil, stylus, ratón).

### C. Modo Mostrador / Kiosk (Idle Manager)
* Archivo: `src/core/idle-manager.js`.
* Retorno automático tras **5 minutos** de inactividad con recentrado de cámara y retorno a portada.
* **Preservación de Pantalla Completa:** No expulsa al usuario de fullscreen al regresar a portada, protegiendo el entorno de exhibición en mostrador.
* Override para pruebas rápidas vía URL: `?timeout=2000`.

---

## ⚙️ 4. Parámetros del Shader y Límites de Cámara

### Uniforms del Fragment Shader (`focal-fragment.glsl`)

| Uniform | Tipo | Rango / Valores | Uso |
|---|---|---|---|
| `u_sceneTex` | `sampler2D` | Textura RGB 4K | Escena maestra `skyline-workstation-4k.jpg` |
| `u_depthTex` | `sampler2D` | Textura 8-bit | Mapa fotométrico `skyline-workstation-depth.png` |
| `u_maskTex` | `sampler2D` | Máscara alfa | Apertura binocular de la montura oftálmica |
| `u_camera` | `vec2` | `[-0.88, 0.88]`, `[-1.15, 1.05]` | Coordenadas cinemáticas (yaw, pitch) |
| `u_lensType` | `float` | `0.0`, `1.0`, `2.0` | 0: Monofocal, 1: Bifocal, 2: Progresivo |
| `u_subMode` | `float` | `0.0` a `3.0` | Mono (0=Lejos, 1=Cerca) \| Prog (0=Baja..3=Alta) |
| `u_overlayActive` | `float` | `0.0` o `1.0` | Toggle Rayos X (bioluminiscente cian) |
| `u_resolution` | `vec2` | píxeles | Resolución del canvas para cálculo de texel |
| `u_aspect` | `float` | float | Relación de aspecto del viewport |

---

## 🛡️ 5. Convenciones y Reglas Estrictas de Desarrollo

1. **Cero Emojis en la Interfaz:** Todos los controles usan **iconos SVG vectoriales quirúrgicos**.
2. **Cero Menciones a Precios:** Enfoque 100% clínico y ergonómico (fatiga visual, adaptación, postura cervical).
3. **Optimización de Hardware:** Límite DPR a `Math.min(devicePixelRatio, 2.0)` para garantizar 60 FPS estables sin sobrecalentamiento térmico en tablets.
4. **Commits:** Conventional Commits obligatorios (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`).
5. **Cache Busting:** Mantener `?v=ai-expanded-v6` en texturas 4K y `?v=2` en metadatos de redes sociales de `index.html`.
