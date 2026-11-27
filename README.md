# 📐 Optix™ — Simulador de Distancias Focales por Visiometric Labs

> **Simulador clínico e interactivo en primera persona de diseños de lente oftálmica según campos visuales y distancias focales: Monofocales, Bifocales Flat-Top 28 y Progresivos continuos de 4 gamas, renderizado en tiempo real con WebGL a 60 FPS.**

🌐 **Demo en vivo:** [visiometric-labs.github.io/focal_lengths-simulator](https://visiometric-labs.github.io/focal_lengths-simulator/)
📦 **Repositorio:** [github.com/visiometric-labs/focal_lengths-simulator](https://github.com/visiometric-labs/focal_lengths-simulator)

---

## 📸 Vista Rápida

| Escena Panorámica 4K | Mapa de Profundidad Calibrado |
|---|---|
| `skyline-workstation-4k.jpg` (3840 × 2160) | `skyline-workstation-depth.png` (3840 × 2160) |
| Escena de escritorio con skyline urbano, laptop, libreta, tablet, taza de café y ventanales | Grayscale de 8 bits: cielo ~240, skyline ~232, laptop ~187, teclado ~80, escritorio ~58 |

---

## 🎯 Propósito Clínico y Pedagógico

En la consulta optométrica y en el mostrador de ventas de la óptica, la elección del diseño de lente genera las mayores dudas e incertidumbres en pacientes présbitas:

| Diseño | Pregunta clásica del paciente |
|---|---|
| **Monofocal** | *«¿Por qué con mis gafas de lectura no puedo ver la televisión sin que se nuble todo?»* |
| **Bifocal** | *«¿Por qué veo borroso el monitor del computador si leo perfecto el celular abajo?»* |
| **Progresivo** | *«¿Por qué un amigo me dijo que los multifocales marean al mover los ojos a los lados?»* |

**Optix™** responde a estas preguntas **en primera persona**: el paciente experimenta directamente, a través de una montura oftálmica realista renderizada en WebGL, cómo se comporta cada diseño óptico frente a las distancias de la vida cotidiana.

---

## 👓 Diseños Oftálmicos Implementados

### 1. Lente Monofocal (Potencia Dióptrica Homogénea)
- Potencia constante en toda la superficie del cristal.
- **Modo Lejos (>3 m):** Fondo nítido, laptop y celular borrosos.
- **Modo Cerca (~35 cm):** Celular nítido, todo lo demás desenfocado.

### 2. Lente Bifocal Flat-Top 28
- Dos campos focales separados por una línea recta horizontal.
- **Zona superior:** Enfoque a infinito.
- **Pastilla inferior (D-Shape 28 mm):** Enfoque a ~35 cm.
- Demuestra el **salto de imagen** (*Image Jump*) por discontinuidad prismática.
- Demuestra el **punto ciego intermedio** (~70 cm): la laptop queda borrosa en ambas zonas.

### 3. Lente Progresivo / Multifocal (4 Gamas)
- Gradación dióptrica continua y suave de arriba hacia abajo.
- **Selector de 4 gamas** con corredor visual de distinto ancho:

| Gama | Corredor Útil | Aberraciones Laterales |
|---|---|---|
| Básica (Tradicional) | ~30% | Notorias y tempranas |
| Media (Digital Convencional) | ~45% | Moderadas y suavizadas |
| Media Alta (Free-Form) | ~65% | Reducidas y ergonómicas |
| Alta (Personalizado Premium) | ~85% | Mínimas en bordes extremos |

---

## ⚡ Arquitectura Técnica

### Motor de Renderizado WebGL
A diferencia de simuladores basados en fotos estáticas, **Optix™ usa una única imagen maestra nítida y calcula el desenfoque en tiempo real** mediante un fragment shader GLSL.

```
┌─────────────────────────────────────────────────────────┐
│                   GPU (Fragment Shader)                  │
│                                                         │
│  Textura 0: Escena 4K (skyline-workstation-4k.jpg)      │
│  Textura 1: Mapa de Profundidad (depth.png)             │
│  Textura 2: Máscara de Apertura Binocular (generada)    │
│                                                         │
│  Uniforms: u_camera, u_lensType, u_subMode,             │
│            u_overlayActive, u_resolution, u_aspect       │
│                                                         │
│  ➜ Cálculo CoC (Circle of Confusion) por píxel          │
│  ➜ Muestreo Bokeh con Espiral Dorada (12 muestras)      │
│  ➜ Aberración lateral Minkwitz para progresivos          │
│  ➜ Salto prismático para bifocales                       │
│  ➜ Visión periférica presbita fuera de las gafas         │
└─────────────────────────────────────────────────────────┘
```

### Fórmula del Circle of Confusion (CoC)

Para cada píxel, el shader calcula:

$$\text{CoC} = |Z_{\text{pixel}} - F_{\text{lens}}| \times 28 + \text{Aberración}_{\text{lateral}} \times 24$$

Donde:
- $Z_{\text{pixel}}$ = profundidad real del píxel (leída del mapa de profundidad)
- $F_{\text{lens}}$ = distancia focal objetivo del lente en ese punto de la montura
- $\text{Aberración}_{\text{lateral}}$ = astigmatismo marginal fuera del corredor (solo progresivos, según el Teorema de Minkwitz)

### Escena Maestra y Mapa de Profundidad

| Asset | Resolución | Formato | Descripción |
|---|---|---|---|
| `skyline-workstation-4k.jpg` | 3840 × 2160 | JPEG 98% | Panorama AI-expandido de escritorio con skyline urbano |
| `skyline-workstation-depth.png` | 3840 × 2160 | PNG 8-bit grayscale | Mapa de profundidad calibrado por zona |

**Rangos de profundidad del mapa:**

| Zona de la Escena | Valor (0-255) | Profundidad normalizada |
|---|---|---|
| Cielo abierto | ~247 | 0.97 (infinito) |
| Skyline / rascacielos | ~232 | 0.91 |
| Pantalla del laptop | ~187 | 0.73 |
| Teclado | ~80 | 0.31 |
| Escritorio (borde inferior) | ~58 | 0.23 |
| Objetos cercanos (libreta, tablet, taza) | ~40-55 | 0.16-0.22 |

---

## 🏛️ Estructura del Proyecto

```
focal_lengths-simulator/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI/CD: Build Vite + Deploy a GitHub Pages (rama main)
├── docs/
│   └── assets/
│       └── optix-office-reference.jpg # Imagen de referencia de la escena original
├── public/
│   ├── manifest.json                  # PWA Web App Manifest (fullscreen, any orientation)
│   ├── branding/
│   │   ├── favicon.svg                # Favicon vectorial SVG (Gafas POV Split)
│   │   ├── favicon-opt1.png           # Favicon PNG 32×32
│   │   ├── apple-touch-icon.png       # Apple Touch Icon 180×180
│   │   └── og-cover.jpg              # Open Graph / WhatsApp / LinkedIn 1200×630
│   └── scenes/
│       ├── skyline-workstation-4k.jpg  # Escena maestra 4K panorámica (AI-expandida)
│       ├── skyline-workstation-depth.png # Mapa de profundidad calibrado 4K
│       ├── office-master.jpg           # Escena original 2.7K (legado)
│       └── office-depth.png            # Mapa de profundidad original (legado)
├── scripts/
│   ├── generate-depth-map.cjs         # Generador de mapa de profundidad (Node + Sharp)
│   └── generate-branding.cjs          # Generador de favicon y OG cover (Node + Sharp)
├── src/
│   ├── main.js                         # Orquestador maestro de la aplicación
│   ├── components/
│   │   ├── preloader.js               # Preloader dinámico circular con spinner SVG fotónico
│   │   ├── landing-screen.js          # Portada de bienvenida y gestión de fullscreen
│   │   ├── glasses-hud.js             # Montura oftálmica binocular SVG en primera persona
│   │   ├── hud-header.js              # Cabecera HUD: logo, Mapa Óptico, Centrar, Fullscreen
│   │   ├── lens-selector.js           # Selector de diseño y gama con iconografía SVG pura
│   │   └── experience-card.js         # Ficha explicativa clínica del paciente (colapsable)
│   ├── core/
│   │   ├── camera-controller.js       # Controlador cinemático POV con inercia y lerp
│   │   ├── event-bus.js               # Bus de eventos desacoplado (pub/sub)
│   │   ├── idle-manager.js            # Temporizador de inactividad (5 min / override URL)
│   │   ├── asset-helper.js            # Resolución universal de URLs (Vite, GH Pages, relativo)
│   │   └── lenses-data.js            # Especificaciones clínicas de los 3 diseños y 4 gamas
│   ├── engine/
│   │   ├── webgl-renderer.js          # Motor WebGL: texturas, quad, uniforms y render loop
│   │   └── shaders/
│   │       ├── focal-vertex.glsl      # Vertex shader: coordenadas UV de pantalla completa
│   │       └── focal-fragment.glsl    # Fragment shader: CoC, Bokeh, Minkwitz, Image Jump
│   └── styles/
│       ├── theme.css                  # Design system médico oscuro (colores, tipografía)
│       ├── layout.css                 # Layout de viewport, canvas y capas HUD
│       ├── landing.css                # Estilos del preloader y la portada de bienvenida
│       └── components.css             # Selectores, tarjetas, píldoras y botones HUD
├── index.html                          # Documento HTML principal con metadatos SEO/OG
├── package.json                        # Dependencias: Vite 6, Sharp (dev)
└── vite.config.js                      # Configuración Vite: base dinámica, ES2020, puerto 3000
```

---

## 🚀 Instalación y Desarrollo Local

### Requisitos
- **Node.js** ≥ 18 (recomendado v22)
- **npm** ≥ 9

### Instalación

```bash
git clone https://github.com/visiometric-labs/focal_lengths-simulator.git
cd focal_lengths-simulator
npm install
```

### Servidor de Desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador. Vite ofrece HMR (Hot Module Replacement) instantáneo.

### Build de Producción

```bash
npm run build
```

Genera el bundle optimizado en `dist/` con base path `/focal_lengths-simulator/` para GitHub Pages.

### Preview del Build

```bash
npm run preview
```

### Scripts Auxiliares

| Comando | Descripción |
|---|---|
| `npm run generate:depth` | Regenera `office-depth.png` desde el pipeline SVG/Sharp |
| `npm run generate:branding` | Regenera favicon, apple-touch-icon y og-cover.jpg |

---

## 🌐 Despliegue (CI/CD)

El proyecto se despliega automáticamente en **GitHub Pages** mediante GitHub Actions:

1. **Trigger:** Cada push a la rama `main` (o dispatch manual).
2. **Build:** `npm ci && npx vite build --base=/focal_lengths-simulator/`
3. **Deploy:** `actions/deploy-pages@v4` publica el directorio `dist/`.

**URL de producción:** https://visiometric-labs.github.io/focal_lengths-simulator/

### Flujo de Ramas

```
dev ──────────────────► main (merge) ──────► GitHub Pages (auto-deploy)
  (desarrollo activo)      (producción)          (CI/CD Action)
```

---

## 🎛️ Flujo de la Aplicación

```
Preloader Circular ──► Portada de Bienvenida ──► Simulador POV (WebGL + HUD)
   (precarga GPU)         (Landing Screen)           (Experiencia Interactiva)
                              │                              │
                              │  «Iniciar Experiencia»       │  Arrastrar = Mover mirada
                              │  → requestFullscreen()       │  Selector inferior = Cambiar lente
                              │                              │  Mapa Óptico = Rayos X toggle
                              │                              │  Logo = Volver a portada
                              │                              │
                              │◄──── Inactividad 5 min ──────│
                              │◄──── Clic en Logo ───────────│
```

### Modo Mostrador / Kiosk
- Tras **5 minutos** de inactividad, la app regresa automáticamente a la portada.
- Para testing rápido, añade `?timeout=2000` a la URL (valor en milisegundos).
- Se reinicia con cualquier interacción: `pointerdown`, `pointermove`, `touchstart`, `wheel`, `keydown`.

---

## 🎨 Identidad Visual

| Elemento | Especificación |
|---|---|
| **Nombre de marca** | Optix™ |
| **Favicon** | Gafas POV Split con doble foco (SVG vectorial) |
| **Tipografías** | Plus Jakarta Sans (UI) + JetBrains Mono (datos técnicos) |
| **Paleta** | Fondo abisal `#070F1E`, cian fotónico `#00F2FE`, azul clínico `#38BDF8` |
| **Iconografía** | 100% SVG vectorial — cero emojis en la interfaz |
| **Open Graph** | Tarjeta 1200 × 630 px para WhatsApp, Telegram y LinkedIn |

---

## ✅ Criterios de Calidad

| Criterio | Estado |
|---|---|
| Renderizado a 60 FPS en desktop y tablets | ✅ |
| Pantalla completa automática al iniciar | ✅ |
| Preloader circular dinámico SVG | ✅ |
| Modo mostrador con retorno automático tras 5 min | ✅ |
| Monofocal: imposibilidad de enfocar dos distancias | ✅ |
| Bifocal: Image Jump + punto ciego intermedio | ✅ |
| Progresivo: 4 gamas con ensanchamiento de corredor | ✅ |
| Mapa de profundidad calibrado a la escena 4K real | ✅ |
| Escena panorámica AI-expandida sin bordes espejeados | ✅ |
| Iconografía SVG pura (cero emojis) | ✅ |
| Cero menciones a precios en la UI | ✅ |
| DPR limitado a 2.0 para rendimiento térmico | ✅ |
| Tolerancia a pérdida de contexto WebGL | ✅ |
| PWA manifest con `display: fullscreen` | ✅ |
| Metadatos OG completos para redes sociales | ✅ |
| CI/CD automático en GitHub Pages | ✅ |

---

## 📝 Historial de Cambios

| Commit | Descripción |
|---|---|
| `98e466b` | Mapa de profundidad alineado con la escena real 4K (v6) |
| `5b1df62` | Panorama AI-expandida sin espejeado lateral + pitch extendido |
| `6ddad92` | Vista completa del escritorio + mapa de profundidad de precisión |
| `0de45f3` | Outpainting lateral y vertical 4K con POV calibrado |
| `0945a3b` | Profundidad fotométrica de precisión (ventana, laptop, objetos cercanos) |
| `946dec3` | Escena definitiva 4K skyline con mapa de profundidad focal |
| `0bc5f17` | Pastillas bifocales más amplias para lectura cómoda |
| `2fb2449` | Pastillas D-shape confinadas 100% al interior del marco |
| `aacd18e` | Escena panorámica 2.7K con rango POV extendido |
| `bbc1499` | 9 puntos de feedback clínico y ergonómico resueltos |
| `f97d188` | Implementación completa del simulador WebGL + HUD clínico |
| `11ef39c` | Setup inicial del proyecto, CI y documentación conceptual |

---

## 🏢 Autoría y Licencia

- **Organización:** Visiometric Labs
- **Autor:** JayzirTech
- **Licencia:** Privada / Todos los derechos reservados
- **Año:** 2026

---

*Documento generado el 27 de noviembre de 2026. Para la especificación técnica completa del diseño óptico y la arquitectura del shader, consultar [CONCEPT.md](./CONCEPT.md).*
