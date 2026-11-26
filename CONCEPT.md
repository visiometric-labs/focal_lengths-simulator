# 📐 Optix — Focal Lengths Simulator by Visiometric Labs
> **Simulador Clínico e Interactivo de Diseños de Lente Oftálmica según Campos Visuales y Distancias Focales**  
> *Monofocales (Lejos / Cerca) • Bifocales Flat-Top 28 • Progresivos Continuos (4 Gamas)*  
> *Repositorio Oficial:* `https://github.com/visiometric-labs/focal_lengths-simulator.git`  
> *Rama de Desarrollo:* `dev`  
> *Organización:* Visiometric Labs | *Autoría:* JayzirTech  
> *Estado:* Fase 0 — Especificación Técnica y Documentación Maestra Aprobada

---

## 🎯 1. Propósito Clínico y Pedagógico

En la consulta optométrica y el mostrador de ventas, la elección del diseño de lente genera las mayores dudas, temores e incertidumbres en los pacientes présbitas:

1. **El dilema del Monofocal:**
   * *«¿Por qué si me mandan gafas de lectura no puedo levantar la vista para ver televisión o saludar a alguien sin que todo se nuble y me maree?»*
   * *«¿Por qué con mis gafas de lejos no puedo leer los mensajes de mi celular?»*
2. **El punto ciego y salto del Bifocal:**
   * *«¿Por qué veo borroso el monitor del computador con mis bifocales si veo bien de lejos y leo perfecto el celular?»*
   * *«¿Por qué siento que los escalones saltan o se deforman cuando bajo una escalera?»*
3. **El temor a la adaptación del Progresivo:**
   * *«¿Por qué un amigo me dijo que los multifocales marean al mover los ojos a los lados?»*
   * *«¿Cuál es la diferencia real en la visión entre una gama básica y una gama alta personalizada?»*

**Optix** nace para responder a estas preguntas en primera persona: el paciente o profesional experimenta directamente a través de una montura oftálmica realista cómo se comporta cada diseño óptico frente a las distancias de la vida cotidiana.

---

## 👓 2. Especificación de Diseños Oftálmicos

El simulador implementa de manera estricta los 3 diseños ópticos universales (con exclusión del lente ocupacional para mantener foco y agilidad en consulta):

### 2.1 Lentes Monofocales (Potencia Dióptrica Homogénea)
* **Arquitectura Óptica:** Potencia constante en toda la superficie de la lente, libre de aberraciones cilíndricas marginales.
* **Modos Seleccionables:**
  * **Modo Lejos (Visión Lejana / Conducción / TV):**
    * Fondo de la oficina (>3 m): **100% Nítido**.
    * Laptop (~70 cm) y Smartphone (~35 cm): **Completamente desenfocados**.
  * **Modo Cerca (Visión Próxima / Lectura / Celular):**
    * Smartphone (~35 cm): **100% Nítido y de máximo contraste**.
    * Laptop (~70 cm): **Leve desenfoque**.
    * Fondo de la oficina (>3 m): **Profundamente desenfocado y borroso**, simulando el mareo que produce caminar con gafas de lectura puestas.

### 2.2 Lentes Bifocales (Diseño Flat-Top 28)
* **Arquitectura Óptica:** Dos campos focales separados por una línea recta horizontal con medialuna inferior de 28 mm.
* **Comportamiento en Simulación:**
  * **Zona Superior:** Enfoque a infinito (Fondo de oficina nítido).
  * **Pastilla Inferior (Flat-Top):** Enfoque próximo (Smartphone nítido al alinear la pastilla con la mirada).
  * **El Salto de Imagen (*Image Jump*):** Desplazamiento prismático vertical abrupto en el borde superior de la pastilla debido a la discontinuidad del centro óptico. Al cruzar la línea divisoria con la mirada, los objetos sufren un salto instantáneo.
  * **El Punto Ciego Intermedio:** La zona del computador y el teclado (~70 cm) permanece **desenfocada tanto por arriba como por abajo**, demostrando clínicamente por qué el bifocal es inadecuado para trabajar en pantallas digitales.

### 2.3 Lentes Progresivos / Multifocales (Gradación Continua y Suave)
* **Arquitectura Óptica:** Incremento dióptrico suave, gradual y continuo a lo largo del meridiano vertical (sin líneas divisorias ni saltos de imagen).
* **Distribución Focal Vertical:**
  * Tercio superior: Campo de visión lejana (>3 m).
  * Corredor intermedio central: Campo para distancias medias (laptop y monitores a ~70 cm).
  * Tercio inferior: Campo de lectura y visión próxima (smartphone a ~35 cm).
* **Física de Aberraciones Laterales (Teorema de Minkwitz):**
  * Toda adición dióptrica vertical genera inevitablemente astigmatismo marginal a los lados del pasillo.
  * El desenfoque es gradual y lateral, permitiendo visión nítida en el corredor central y requiriendo un movimiento natural de cuello para enfocar objetos periféricos.
* **Selector de 4 Gamas de Progresivos:**
  1. **Gama Baja (Diseño Tradicional / Esferotórico):**
     * Ancho del corredor útil: **~30%** del cristal.
     * Aberraciones laterales notorias y tempranas. Exige giros marcados de cuello para enfocar pantallas o lectura.
  2. **Gama Media (Digital Convencional):**
     * Ancho del corredor útil: **~45%** del cristal.
     * Reducción moderada de aberraciones, facilitando el uso en oficina.
  3. **Gama Media Alta (Digital Free-Form de Superficie Interna):**
     * Ancho del corredor útil: **~65%** del cristal.
     * Corredor intermedio balanceado, transiciones muy suaves, menor sensación de balanceo.
  4. **Gama Alta (Personalizado / Panorámico Premium):**
     * Ancho del corredor útil: **~85%** del cristal.
     * Aberraciones marginales mínimas relegadas a los extremos del bisel. Máxima libertad de movimiento ocular natural.

---

## 🌄 3. La Escena Maestra y el Mapa de Profundidad

### 3.1 Escena Fotográfica: `office-master.jpg`
* **Resolución base:** 1024 × 571 píxeles (formato 16:9 de alto rendimiento).
* **Plano 1 — Smartphone en mano (Abajo Izquierda):** Distancia ~35 cm (Profundidad z ≈ 0.15).
* **Plano 2 — Laptop y Escritorio (Centro Derecha):** Distancia ~70 cm (Profundidad z ≈ 0.50).
* **Plano 3 — Oficina Abierta y Fondo (Superior / Profundidad):** Distancia >3 m (Profundidad z ≈ 0.95).

### 3.2 Mapa de Profundidad: `office-depth.png`
* Generación interna mediante pipeline calibrado de Node/Sharp/Canvas para segmentar con exactitud los 3 planos de profundidad y sus gradientes.
* Codificación en escala de grises de 8 bits:
  * Primer plano (Smartphone): ~0.15 (grises oscuros).
  * Plano medio (Laptop y escritorio): ~0.50 (gris intermedio).
  * Plano lejano (Fondo de oficina): ~0.95 (casi blanco).

---

## ⚡ 4. Arquitectura de Renderizado (Shader WebGL 2D)

### 4.1 Principio de Funcionamiento
A diferencia de simuladores basados en intercambio de fotos estáticas, **Optix utiliza una única imagen maestra nítida y calcula el desenfoque en tiempo real**.

1. **Entradas al Shader:**
   * Textura 0: `office-master.jpg` (RGB nítido).
   * Textura 1: `office-depth.png` (Mapa de profundidad).
   * Parámetros uniformes (Uniforms):
     * Inclinación de la cabeza (`pitch`, `yaw`).
     * Tipo de lente activo (`LENS_TYPE`: 0 = Monofocal, 1 = Bifocal, 2 = Progresivo).
     * Sub-modo / Gama (`SUB_MODE`: Lejos/Cerca, o Gamas 0, 1, 2, 3).
     * Toggle de "Modo Rayos X" (`u_showOverlay`: 0.0 o 1.0).

2. **Cálculo del Desenfoque (Circle of Confusion — CoC):**
   * En cada píxel, el shader determina cuál es la distancia focal objetivo $F_{lens}(x, y)$ que ofrece el cristal en ese punto:
     * Para Monofocal: $F_{lens} = \text{constante}$.
     * Para Bifocal: $F_{lens} = F_{cerca}$ si está dentro de la pastilla Flat-Top, o $F_{lejos}$ si está arriba. Se aplica salto prismático $\Delta UV$ en la frontera.
     * Para Progresivo: $F_{lens}(y)$ sigue una función suave sigmoide / cúbica que interpola $F_{lejos} \to F_{inter} \to F_{cerca}$ sin saltos.
   * Se compara la distancia real del píxel $Z_{pixel}$ con la distancia focal $F_{lens}$:
     $$\text{CoC} = k \cdot |Z_{pixel} - F_{lens}|$$
   * En Progresivos, se suma la aberración lateral fuera del corredor:
     $$\text{Aberración Lateral} = g(\text{gama}) \cdot \text{distanciaAlCorredor}^2$$

3. **Visión Periférica (Fuera de las Gafas):**
   * Fuera de la montura oftálmica, la escena se renderiza con un desenfoque natural leve constante (Opción A), simulando el ojo del paciente sin corrección óptica y resaltando el beneficio del lente.

4. **Optimización de Hardware (DPR Limit):**
   * El contexto WebGL se limitará a `Math.min(window.devicePixelRatio || 1, 2.0)` para garantizar 60 FPS estables en iPads y tablets sin recalentamiento.

5. **Tolerancia a Pérdida de Contexto:**
   * Soporte nativo para eventos `webglcontextlost` y `webglcontextrestored`, permitiendo restablecer texturas y shaders de inmediato si la tablet se suspende y reactiva.

---

## 🎛️ 5. Flujo de Navegación, Pantalla Completa y UI

### 5.1 Flujo de Arranque: Preloader Dinámico $\to$ Portada $\to$ Experiencia
1. **Fase 1 — Preloader Dinámico Circular (Sin barra de carga):**
   * Spinner circular vectorial basado en el concepto óptico de arco azul con flecha direccional y estela de partículas/puntos decrecientes en rotación suave.
   * Totalmente dinámico y reactivo a la precarga de texturas, fuentes y shaders en GPU.
   * Acompañado de leyenda clínica minimalista: *«Calibrando motor óptico focal...»*.
2. **Fase 2 — Portada de Bienvenida (Landing Screen):**
   * Diseño médico-clínico premium con título, descripción y botón destacado **«Iniciar Experiencia»**.
   * **Control de Fullscreen en Portada:** Solo permite salir de pantalla completa si ya estuviera activo; no permite entrar desde aquí.
3. **Fase 3 — Inicio de la Experiencia:**
   * Al hacer clic en «Iniciar Experiencia», la aplicación solicita **pantalla completa automática** (`requestFullscreen()`) y revela el simulador.
4. **Fase 4 — Dentro de la Experiencia (Simulador Activo):**
   * Control interactivo en el HUD superior:
     * Si está en fullscreen $\to$ Botón para salir manualmente.
     * Si el usuario sale $\to$ Botón para volver a entrar a fullscreen manualmente.

### 5.2 Gestor de Inactividad y Retorno Automático a Portada (Modo Mostrador / Kiosk)
* **Objetivo:** Cuando un paciente o cliente termina de ver el simulador en la tablet y se retira, la aplicación debe volver automáticamente al estado inicial para recibir al siguiente usuario.
* **Comportamiento por defecto:**
  * Si transcurren **5 minutos continuos de inactividad** (300,000 ms) dentro de la experiencia, la aplicación:
    1. Cierra automáticamente modales o fichas abiertas.
    2. Restablece la cámara al centro (`pitch = 0, yaw = 0`).
    3. Sale de la experiencia y retorna a la Portada de Bienvenida.
    4. Sale de pantalla completa si el navegador lo requiere o mantiene el estado seguro.
* **Parámetro de Pruebas (Test Mode Override):**
  * Se implementa soporte para el parámetro URL `/?timeout=X` (ejemplo: `/?timeout=2000`).
  * Si el parámetro está presente, el gestor de inactividad adoptará ese valor en milisegundos para permitir pruebas y QA inmediatas sin tener que esperar 5 minutos reales.
* **Detección de Interacción:**
  * El temporizador se reinicia ante cualquier evento del usuario: `pointerdown`, `pointermove`, `touchstart`, `touchmove`, `wheel`, `keydown` o clics en la interfaz.

### 5.3 Navegación 100% Gestual y Orgánica
* Se excluyen botones artificiales de salto rápido.
* El usuario interactúa **arrastrando libremente la pantalla** (Touch en tablets o Mouse en PC).
* La cinemática de la cámara (`CameraController`) cuenta con inercia física, suavizado exponencial (`lerp`) y límites anatómicos de rotación de cuello.

### 5.4 Iconografía Vectorial Quirúrgica (Cero Emojis)
* Todos los controles utilizan **iconos SVG vectoriales limpios** (sin emojis):
  * **Monofocal:** Icono SVG de lente simple con un único foco central.
  * **Bifocal Flat-Top:** Icono SVG con la silueta de la medialuna y línea horizontal de la pastilla.
  * **Progresivo:** Icono SVG con curvas bioluminiscentes estilizadas en forma de reloj de arena.
  * **Submodos Lejos / Cerca:** Iconos vectoriales de horizonte lejano y lectura en proximidad.
  * **Gamas de Progresivo:** Iconos de apertura de corredor (Baja, Media, Media Alta, Alta).

### 5.5 Overlay Pedagógico: "Modo Rayos X / Mapa del Lente" (Toggle)
* Botón interactivo en el HUD superior: `[ SVG Mapa Óptico ]`.
* Al activarse, superpone líneas bioluminiscentes sutiles en el cristal:
  * **Progresivo:** Dibuja el corredor central (embudo/reloj de arena) y la zona de aberraciones marginales sombreada, evidenciando cómo la gama alta ensancha el corredor.
  * **Bifocal:** Dibuja la línea divisoria y la pastilla Flat-Top 28.
  * **Monofocal:** Dibuja el marco de zona única homogénea.

### 5.6 Tarjeta de Experiencia del Paciente
* Widget flotante colapsable que explica en tiempo real:
  * Zona activa de visión.
  * Estado de acomodación / enfoque.
  * Sensación visual del ojo.

### 5.7 Guía de Mostrador para el Óptico (Modal Pedagógico)
* **Regla Estricta:** Cero menciones a precios, cotizaciones o justificaciones de costo monetario.
* **Enfoque 100% Clínico:**
  * Beneficios ergonómicos (postura natural de cuello y espalda).
  * Confort y fatiga visual frente a pantallas.
  * Transición de mirada natural sin saltos.
  * Tiempos y facilidad de adaptación según la amplitud del corredor.

---

## 🎨 6. Identidad Visual, Branding y Metadatos Oficiales

### 6.1 Favicon Oficial Aprobado: «Opción 4 — Gafas POV Split con Doble Foco»
* **Concepto Visual:** Silueta minimalista de montura oftálmica de titanio donde el cristal superior muestra la visión lejana clara y la pastilla inferior iluminada en cian representa el campo de lectura de alta definición.
* **Archivos a Generar en `public/branding/`:**
  * `favicon.svg`: Vectorial SVG puro de alta definición para navegadores modernos.
  * `favicon-opt1.png` / `favicon.ico`: 32 × 32 px para compatibilidad legacy.
  * `apple-touch-icon.png`: 180 × 180 px con esquinas redondeadas automáticas para dispositivos iOS.

### 6.2 Metadatos Oficiales HTML / SEO
* **Título de la Página (`<title>`):**
  `Optix™ | Simulador de Diseños de Lente y Campos Visuales`
* **Descripción Oficial (`<meta name="description">`):**
  `Simulador clínico interactivo en primera persona de diseños oftálmicos según campos visuales y distancias focales: Monofocal (Lejos/Cerca), Bifocal Flat-Top y Progresivo continuo a 60 FPS por Visiometric Labs • JayzirTech.`

### 6.3 Imagen de Portada y Tarjeta de Redes Sociales (Open Graph)
* **Archivo:** `public/branding/og-cover.jpg`
* **Dimensiones:** 1200 × 630 px (formato 1.91:1 para WhatsApp, Telegram y LinkedIn).
* **Composición:** Fondo azul abisal (`#020617` a `#070F1E`) con acentos fotónicos bioluminiscentes, tipografía oficial *Optix™*, chips de los 3 lentes y créditos *«Visiometric Labs • JayzirTech • 60 FPS WebGL»*.

---

## 🏛️ 7. Estructura de Módulos Prevista

```
focal_lengths-simulator/
├── .github/workflows/deploy.yml
├── docs/
│   └── assets/optix-office-reference.jpg
├── public/
│   ├── branding/
│   │   ├── favicon.svg
│   │   └── og-cover.jpg
│   └── scenes/
│       ├── office-master.jpg       (1024x571 Escena nítida de referencia)
│       └── office-depth.png        (Mapa de profundidad en escala de grises generado)
├── src/
│   ├── components/
│   │   ├── preloader.js            (Controlador de precarga con spinner circular fotónico)
│   │   ├── landing-screen.js       (Portada de bienvenida y gestión fullscreen)
│   │   ├── glasses-hud.js          (Montura binocular y siluetas)
│   │   ├── lens-selector.js        (Selector principal y submodos con SVG)
│   │   ├── experience-card.js      (Ficha explicativa de experiencia)
│   │   ├── pitch-modal.js          (Modal clínico de mostrador sin precios)
│   │   └── optical-overlay.js      (Renderizado del modo Rayos X / Corredor)
│   ├── core/
│   │   ├── camera-controller.js    (Física cinemática de mirada e inercia)
│   │   ├── idle-manager.js         (Temporizador de inactividad 5 min / override ?timeout=)
│   │   ├── event-bus.js            (Bus de eventos desacoplado)
│   │   └── lenses-data.js          (Especificaciones clínicas y datos de gamas)
│   ├── engine/
│   │   ├── webgl-renderer.js       (Inicialización de canvas WebGL y gestión de texturas)
│   │   └── shaders/
│   │       ├── focal-vertex.glsl   (Paso de coordenadas UV y proyección)
│   │       └── focal-fragment.glsl (Shader CoC, salto de imagen, astigmatismo y DoF)
│   ├── styles/
│   │   ├── theme.css               (Design System médico oscuro de Visiometric Labs)
│   │   ├── layout.css              (Distribución de HUD y canvas a pantalla completa)
│   │   ├── landing.css             (Estilos de preloader circular y bienvenida)
│   │   └── components.css          (Estilos de selectores, tarjetas y modales)
│   └── main.js                     (Punto de entrada y orquestador)
├── scripts/
│   └── generate-depth-map.js       (Script para generar y calibrar office-depth.png)
├── index.html
├── package.json
└── vite.config.js
```

---

## ✅ 8. Criterios de Aceptación y Validación

1. **Fluidez 60 FPS:** El Shader WebGL debe renderizar a 60 cuadros por segundo en pantallas de escritorio y tablets táctiles sin caídas de cuadros (tope DPR 2.0).
2. **Ciclo Fullscreen:** Transición automática a pantalla completa al iniciar la experiencia, con controles manuales estrictamente respetados según el estado (portada vs experiencia).
3. **Preloader Circular Dinámico:** Animación continua de arco vectorial con estela de partículas, sin barras lineales.
4. **Modo Mostrador (Inactividad):** Retorno automático a la portada tras 5 minutos sin interacción, con bypass de testing configurable vía `/?timeout=2000`.
5. **Fidelidad Clínica:**
   * El monofocal debe demostrar la imposibilidad de enfocar dos distancias a la vez.
   * El bifocal debe evidenciar el *Image Jump* y la imposibilidad de enfocar la laptop.
   * El progresivo debe mostrar continuidad vertical total en el pasillo, con ensanchamiento progresivo del campo útil en las gamas Baja $\to$ Media $\to$ Media Alta $\to$ Alta.
6. **Cero Violaciones de Política de Precios:** Ni la interfaz ni los modales deben contener precios o justificaciones monetarias.
7. **Iconografía SVG Pura:** Cero emojis en botones, tabs y selectores.
8. **Respeto a la Directiva de Documentación:** No se generará código hasta la aprobación explícita del usuario.
