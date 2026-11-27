# AI_CONTEXT.md — Optix™ Focal Lengths Simulator

> **Archivo de contexto para agentes de IA.** Resumen ejecutivo del proyecto para onboarding rápido.

## Identidad del Proyecto

| Campo | Valor |
|---|---|
| **Nombre** | Optix™ — Focal Lengths Simulator |
| **Organización** | Visiometric Labs |
| **Autor** | JayzirTech |
| **Repositorio** | `https://github.com/visiometric-labs/focal_lengths-simulator.git` |
| **Producción** | `https://visiometric-labs.github.io/focal_lengths-simulator/` |
| **Stack** | Vanilla JS (ES2020) + WebGL + GLSL + Vite 6 + Sharp |
| **Estado** | ✅ Completado y desplegado |

## ¿Qué es Optix™?

Simulador clínico interactivo en primera persona que permite a pacientes présbitas y profesionales de la optometría experimentar en tiempo real cómo se comporta la visión a través de lentes **Monofocales**, **Bifocales Flat-Top 28** y **Progresivos continuos de 4 gamas**, mediante un motor WebGL que calcula el desenfoque (Circle of Confusion) por píxel a 60 FPS.

## Arquitectura en 3 Capas

1. **Capa de Presentación** (`src/components/`): Preloader, Landing Screen, GlassesHUD, HudHeader, LensSelector, ExperienceCard.
2. **Capa de Lógica** (`src/core/`): CameraController (POV con inercia), EventBus (pub/sub), IdleManager (kiosk), LensesData (specs clínicas), AssetHelper (URLs).
3. **Capa de Renderizado** (`src/engine/`): WebGLRenderer (texturas, quad, uniforms) + shaders GLSL (focal-vertex.glsl, focal-fragment.glsl).

## Assets Críticos

| Archivo | Propósito |
|---|---|
| `public/scenes/skyline-workstation-4k.jpg` | Escena maestra 4K panorámica (3840×2160) |
| `public/scenes/skyline-workstation-depth.png` | Mapa de profundidad calibrado (3840×2160, grayscale 8-bit) |
| `src/engine/shaders/focal-fragment.glsl` | Shader de simulación óptica (CoC, Bokeh, Minkwitz, Image Jump) |

## Ramas Git

- `dev`: desarrollo activo
- `main`: producción (auto-deploy a GitHub Pages vía Actions)

## Convenciones

- **Idioma del código:** Español en comentarios y nombres de UI; inglés en variables y funciones técnicas.
- **Iconografía:** 100% SVG vectorial, cero emojis.
- **Precios:** Cero menciones a precios o costos en la interfaz.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `chore:`).
- **Cache busting:** Query string `?v=ai-expanded-vN` en URLs de assets.

## Parámetros del Shader

| Uniform | Tipo | Uso |
|---|---|---|
| `u_camera` | `vec2` | (yaw, pitch) normalizados del POV |
| `u_lensType` | `float` | 0=Monofocal, 1=Bifocal, 2=Progresivo |
| `u_subMode` | `float` | Mono(0=Lejos,1=Cerca), Prog(0=Baja,1=Media,2=MedAlta,3=Alta) |
| `u_overlayActive` | `float` | 0.0=Off, 1.0=Rayos X activo |
| `u_sceneTex` | `sampler2D` | Textura de escena 4K |
| `u_depthTex` | `sampler2D` | Mapa de profundidad |
| `u_maskTex` | `sampler2D` | Máscara de apertura binocular |

## Límites de Cámara

| Parámetro | Valor |
|---|---|
| `maxYaw` | ±0.88 |
| `maxPitchUp` | 1.05 |
| `maxPitchDown` | 1.15 |
| `sensitivity` | 0.0022 |
| `lerpSpeed` | 0.12 |
| Zoom del shader | 1.72 |
| Offset factors | (0.235, 0.215) |
