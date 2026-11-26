# 📐 Focal Lengths Simulator by Visiometric Labs
> **Simulador Clínico e Interactivo de Diseños de Lente Oftálmica según Campos Visuales y Distancias Focales**  
> *Monofocales • Bifocales • Progresivos (Multifocales) • Ocupacionales*  
> *Repositorio Oficial:* `https://github.com/visiometric-labs/focal_lengths-simulator.git`  
> *Carpeta Local:* `focal_lengths-simulator`  
> *Organización:* Visiometric Labs | *Autoría:* JayzirTech

---

## 🎯 1. Visión y Propósito del Proyecto

En la consulta optométrica y el mostrador de ventas, la elección del diseño de lente genera las mayores dudas, temores y objeciones de compra en los pacientes:

1. **La barrera del Progresivo:**  
   * *«¿Por qué un progresivo cuesta más que un monofocal o un bifocal?»*  
   * *«Un amigo me dijo que los progresivos marean o no sirven para bajar escaleras.»*
2. **El dilema del Bifocal:**  
   * *«¿Por qué veo borroso el computador con mis bifocales si veo bien de lejos y leo el celular?»*  
   * *«¿Por qué siento que el suelo salta cuando camino?»* (El salto de imagen).
3. **La limitación del Monofocal:**  
   * *«¿Por qué tengo que quitarme y ponerme las gafas a cada rato para ver a distintas distancias?»*

**Focal Lengths Simulator** nace para ser la herramienta visual interactiva que permite al paciente **experimentar en primera persona** cómo se ve el mundo a través de cada uno de estos diseños, entendiendo de forma intuitiva sus zonas de enfoque, sus campos de visión y sus aberraciones laterales.

---

## 👓 2. Los 4 Diseños Oftálmicos a Demostrar

### 2.1 Lentes Monofocales (Un solo foco)
* **Arquitectura Óptica:** Potencia dióptrica constante en toda la lente.
* **Comportamiento en Simulación:**
  * Visión nítida al 100% en una distancia seleccionada (ej. Lejos **o** Cerca).
  * **Sin aberraciones laterales:** Campo visual claro de extremo a extremo.
  * **Limitación interactiva:** Al mirar objetos fuera de su rango focal (ej. mirar el celular con monofocal de lejos), el objeto se muestra desenfocado.

### 2.2 Lentes Bifocales (Doble foco con línea divisoria)
* **Arquitectura Óptica:** Dos potencias divididas físicamente por una medialuna o línea horizontal (*flat-top*).
* **Comportamiento en Simulación:**
  * Zona superior: Visión lejana clara.
  * Zona inferior (pastilla): Visión cercana nítida.
  * **El Salto de Imagen (*Image Jump*):** Al mover la mirada verticalmente cruzando la línea divisoria, los objetos sufren un salto brusco de posición y escala.
  * **El Punto Ciego Intermedio:** La zona del computador y el teclado (60 cm - 1 m) permanece desenfocada.

### 2.3 Lentes Progresivos / Multifocales (Gradación continua)
* **Arquitectura Óptica:** Cambio gradual y suave de potencia de arriba hacia abajo sin líneas visibles.
  * Zona superior: Visión lejana.
  * Corredor intermedio central: Pantallas, computador, tablero del auto.
  * Zona inferior: Lectura y celular.
* **Comportamiento en Simulación:**
  * Transición suave y continua entre todas las distancias.
  * **Simulación física de Aberraciones Laterales (Astigmatismo Marginal):** Zonas de desenfoque a los lados del corredor.
  * **Comparativa de Gamas de Progresivos:**
    * *Gama Estándar / Tradicional:* Corredor estrecho, mayores zonas laterales borrosas.
    * *Gama Digital Free-Form:* Corredor más amplio, transición suave.
    * *Gama Personalizada / Premium:* Corredor panorámico de alta fidelidad, mínima aberración periférica.

### 2.4 Lentes Ocupacionales (Office / De Escritorio)
* **Arquitectura Óptica:** Progresivo optimizado exclusivamente para interiores.
* **Comportamiento en Simulación:**
  * Elimina la zona de lejos exterior.
  * Expande masivamente el corredor intermedio (monitores múltiples) y la zona de cerca (documentos).
  * Demuestra la postura ergonómica del cuello frente a la pantalla.

---

## 💬 3. Ejes de Discusión para el Plan de Trabajo

Antes de programar, definamos juntos los siguientes pilares de la experiencia:

### Eje A: El Escenario Interactivo y los Planos de Profundidad
Para demostrar estos lentes necesitamos un entorno visual con **múltiples planos de profundidad simultáneos**:
* **Plano Lejano (> 3-4 metros):** Ventana con paisaje exterior, persona entrando a la habitación, televisión o cuadro en la pared.
* **Plano Intermedio (~ 60 - 80 cm):** Monitor de computador de escritorio o laptop con texto/gráficos.
* **Plano Cercano (~ 35 - 40 cm):** Celular en la mano, libro o documento de lectura.

### Eje B: Mecánicas de Interacción del Paciente / Asesor
* ¿Cómo interactúa el usuario para probar el enfoque?
  * *Opción 1: Movimiento de mirada / arrastre vertical y horizontal:* El usuario desplaza el punto de enfoque o el ángulo de visión para experimentar qué parte de la lente está usando.
  * *Opción 2: Selector de objetos de interés:* Clic en "Ver Celular", "Ver Computador" o "Ver al Fondo" para que la lente y el ojo se acomoden automáticamente según el diseño activo.
  * *Opción 3: Mapa de calor / Visualizador de aberraciones:* Un botón tipo "Rayos X" que colorea las zonas de la lente (verde = nítido, amarillo = transición, rojo = aberración lateral).

### Eje C: Nombre de Marca en la Suite Visiometric Labs
Recordemos los nombres de sus hermanos:
* **Ocularis** (Refracción y Patologías)
* **Chromatis** (Filtros y Tratamientos)
* **Luminix** (Lentes Fotosensibles y Transitions)
* ¿Qué nombre bautizará a este nuevo integrante? *(Podemos proponer nombres dedicados a la distancia focal, enfoque, profundidad y geometría óptica).*

---

## 🏛️ 4. Estructura del Ecosistema

```
Proyecto Ópticas/
├── refraction-simulator/       --> Ocularis (Refracción, Anatomía y Patologías)
├── filters-simulator/          --> Chromatis (Filtros: Blue Cut, Conducción, AR)
├── transitions-simulator/      --> Luminix (Fotosensibles, Transitions, Avatar 3D)
└── focal_lengths-simulator/    --> Nuevo Módulo (Monofocal, Bifocal, Progresivo)
    ├── .gitignore
    ├── CONCEPT.md
    └── README.md
```
