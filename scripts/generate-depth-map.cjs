const fs = require('fs');
const path = require('path');
const sharp = require('../../filters-simulator/node_modules/sharp');

const outDir = path.resolve(__dirname, '../public/scenes');
const aiImageSrc = 'C:/Users/jayzi/.gemini/antigravity/brain/c7987174-1c52-4bb0-9046-fc447b9a738b/ophthalmology_pov_office_focal_depths_final_1795709937753.jpg';
const masterJpgPath = path.join(outDir, 'office-master.jpg');
const depthPngPath = path.join(outDir, 'office-depth.png');

async function generateMasterAndDepth() {
  const width = 2752;
  const height = 1536;

  console.log('1. Escalando con Lanczos3 y unsharp mask la nueva escena AI a 2.7K...');
  await sharp(aiImageSrc)
    .resize(width, height, { kernel: 'lanczos3' })
    .linear(1.06, -6) // Realce sutil de contraste y saturación
    .modulate({ brightness: 1.0, saturation: 1.04 })
    .sharpen({ sigma: 1.2, m1: 1.1, m2: 2.2 }) // Textos del smartphone, dashboard y gráficos hipernítidos
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile(masterJpgPath);
  console.log('office-master.jpg generado con éxito en:', masterJpgPath);

  console.log('2. Generando mapa de profundidad calibrado para la nueva escena...');
  // Mapa de profundidad fotométrico multicapa con 4 planos focales:
  // 1. Cerca (~30-35cm, z ≈ 0.16 / valor 41): Manos con smartphone, hoja clínica, taza
  // 2. Intermedio (~70cm, z ≈ 0.50 / valor 128): Monitor con dashboard, teclado, ratón
  // 3. Medio (~1.5-2.5m, z ≈ 0.72 / valor 184): Pizarrón con notas, estantería, lámpara
  // 4. Lejos (>4m, z ≈ 0.95-1.0 / valor 245-255): Mesa de reunión, reloj, ventanal panorámico con rascacielos
  const depthSvg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradiente general de fondo (lejos) -->
      <linearGradient id="deep-room-depth" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#C0C0C0" />   <!-- Pared izquierda: 192 -->
        <stop offset="45%" stop-color="#E8E8E8" />  <!-- Pared central: 232 -->
        <stop offset="70%" stop-color="#F8F8F8" />  <!-- Ventanales con rascacielos: 248 -->
        <stop offset="100%" stop-color="#FFFFFF" /> <!-- Cielo exterior infinito: 255 -->
      </linearGradient>

      <!-- Gradiente del pizarrón blanco en pared izquierda (~1.8m) -->
      <linearGradient id="whiteboard-depth" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#B8B8B8" />   <!-- 184 (z ≈ 0.72) -->
        <stop offset="100%" stop-color="#C4C4C4" /> <!-- 196 -->
      </linearGradient>

      <!-- Gradiente del monitor panorámico y teclado (~70cm) -->
      <radialGradient id="monitor-depth" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#7C7C7C" />   <!-- 124 (z ≈ 0.49) -->
        <stop offset="80%" stop-color="#848484" />  <!-- 132 -->
        <stop offset="100%" stop-color="#929292" /> <!-- 146 -->
      </radialGradient>

      <!-- Gradiente de la superficie de la mesa de madera -->
      <linearGradient id="desk-depth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#949494" />   <!-- Borde posterior mesa: 148 -->
        <stop offset="50%" stop-color="#808080" />  <!-- Zona teclado: 128 -->
        <stop offset="100%" stop-color="#686868" /> <!-- Borde frontal: 104 -->
      </linearGradient>

      <!-- Gradiente de smartphone y manos (Cerca ~35cm) -->
      <radialGradient id="phone-depth" cx="38%" cy="55%" r="48%">
        <stop offset="0%" stop-color="#242424" />   <!-- Celular: 36 (z ≈ 0.14) -->
        <stop offset="60%" stop-color="#2C2C2C" />  <!-- Dedos y muñeca: 44 (z ≈ 0.17) -->
        <stop offset="100%" stop-color="#555555" /> <!-- Borde mesa -->
      </radialGradient>

      <!-- Gradiente del reporte clínico en papel y taza (Cerca ~35cm) -->
      <radialGradient id="paper-mug-depth" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#262626" />   <!-- Papel: 38 (z ≈ 0.15) -->
        <stop offset="70%" stop-color="#323232" />  <!-- Taza y bolígrafo: 50 -->
        <stop offset="100%" stop-color="#606060" /> <!-- Unión con mesa -->
      </radialGradient>

      <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="28" />
      </filter>
    </defs>

    <!-- 1. Plano Lejano / Infinito (z ≈ 0.90 - 1.0) -->
    <rect width="${width}" height="${height}" fill="url(#deep-room-depth)" />

    <!-- Sala de reuniones y ventanal al fondo (z ≈ 0.88 - 0.95) -->
    <g filter="url(#soft-blur)">
      <!-- Ventanales y rascacielos (Derecha superior) -->
      <rect x="1400" y="0" width="1352" height="1100" fill="#F4F4F4" />
      <!-- Mesa de reunión con compañeros -->
      <ellipse cx="2300" cy="850" rx="420" ry="240" fill="#D0D0D0" />
    </g>

    <!-- 2. Plano Medio: Pizarrón izquierdo, estantería y lámpara (z ≈ 0.70 - 0.75) -->
    <g filter="url(#soft-blur)">
      <!-- Pizarrón blanco en pared izquierda -->
      <rect x="40" y="80" width="820" height="680" rx="20" fill="url(#whiteboard-depth)" />
      <!-- Estantería y lámpara de pie -->
      <rect x="880" y="240" width="460" height="700" fill="#AEAEAE" />
    </g>

    <!-- 3. Plano Intermedio: Mesa de trabajo, Monitor con dashboard, teclado y ratón (z ≈ 0.48 - 0.55) -->
    <g filter="url(#soft-blur)">
      <!-- Superficie amplia del escritorio de madera -->
      <path d="M 80 880 L 2752 760 L 2752 1536 L 80 1536 Z" fill="url(#desk-depth)" />
      <!-- Pantalla panorámica del monitor central -->
      <rect x="1350" y="420" width="700" height="540" rx="14" fill="url(#monitor-depth)" />
      <!-- Soporte, teclado ergonómico y ratón -->
      <ellipse cx="1500" cy="1120" rx="420" ry="160" fill="#787878" />
    </g>

    <!-- 4. Primer Plano: Manos con smartphone, hoja clínica, taza y bolígrafo (z ≈ 0.12 - 0.18) -->
    <g filter="url(#soft-blur)">
      <!-- Brazo izquierdo, manos y smartphone -->
      <path d="M 0 1150 
               C 220 1150, 480 1020, 680 940 
               C 880 880, 1160 980, 1160 1250 
               C 1160 1450, 920 1536, 0 1536 Z" 
            fill="url(#phone-depth)" />
      <!-- Foco nítido en el smartphone -->
      <ellipse cx="940" cy="1180" rx="180" ry="240" fill="#202020" />

      <!-- Reporte clínico en papel y taza de café a la derecha -->
      <ellipse cx="2180" cy="1380" rx="420" ry="200" fill="url(#paper-mug-depth)" />
      <!-- Taza con logo -->
      <ellipse cx="2340" cy="1150" rx="140" ry="120" fill="#242424" />
    </g>
  </svg>`;

  await sharp(Buffer.from(depthSvg))
    .resize(width, height)
    .grayscale()
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(depthPngPath);

  console.log('office-depth.png generado con éxito en:', depthPngPath);
}

generateMasterAndDepth().catch(console.error);
