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

## 🌄 3. La Escena Maestra de Demostración: Oficina y Espacio de Trabajo

La imagen de referencia oficial (`docs/assets/optix-office-reference.jpg`) fue seleccionada y optimizada porque reúne de forma natural y simultánea los **tres planos focales de la vida cotidiana moderna**:

1. **Plano Cercano (~30 - 40 cm) — Smartphone (Inferior Izquierda):**
   * Brazo sosteniendo el teléfono con mensajes de texto de alta definición.
   * **Comportamiento en Monofocal Lejos:** Completamente desenfocado e ilegible.
   * **Comportamiento en Bifocal:** Nítido al alinear la pastilla inferior.
   * **Comportamiento en Progresivo:** Nítido en el tercio inferior del cristal.

2. **Plano Intermedio (~60 - 80 cm) — Laptop y Taza de Café (Centro Derecha):**
   * Pantalla con gráficas analíticas de ventas Q3, tablas de datos y métricas.
   * **El Talón de Aquiles del Bifocal:** Queda exactamente en el punto ciego (entre la visión lejana y la pastilla de lectura), viéndose borroso y forzando la postura del paciente.
   * **La Gran Venta del Progresivo:** Se lee con nitidez perfecta a través del corredor intermedio.

3. **Plano Lejano (> 3 - 5 metros) — Oficina Abierta y Compañeros (Superior / Fondo):**
   * Compañeros de trabajo en sus escritorios, pasillos y luz natural de fondo.
   * **Comportamiento en Monofocal Cerca (Gafas de lectura):** Fondo totalmente borroso y mareante al levantar la vista.
   * **Comportamiento en Bifocal y Progresivo:** Totalmente nítido en la mitad superior del cristal.

---

## 🎛️ 4. Mecánica de Navegación y Control en 1ª Persona

* **Perspectiva en 1ª Persona (POV):** El paciente observa el espacio a través de la montura oftálmica.
* **Control Gestual Intuitivo (Drag / Touch / Mouse):**
  * El paciente arrastra con su dedo en pantallas táctiles (iPads, tablets en mostrador) o con el mouse para subir o bajar la cabeza suavemente.
  * Al mover la mirada arriba o abajo, experimenta físicamente qué zona de la lente está alineada con cada objeto y cómo se aclara o desenfoca.
* **Los 3 Lentes Oficiales:**
  1. **Monofocal**
  2. **Bifocal** (con pastilla visible y salto de imagen)
  3. **Progresivo** (con corredor continuo y aberraciones laterales)

---

## 🏛️ 5. Estructura del Ecosistema

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
