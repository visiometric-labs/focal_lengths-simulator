const fs = require('fs');
const path = require('path');
const sharp = require('../../filters-simulator/node_modules/sharp');

const outDir = path.resolve(__dirname, '../public/scenes');
const realOfficeSrc = path.resolve(__dirname, '../../filters-simulator/public/scenes/office-real.jpg');
const masterJpgPath = path.join(outDir, 'office-master.jpg');
const depthPngPath = path.join(outDir, 'office-depth.png');

async function generateMasterAndDepth() {
  const width = 2752;
  const height = 1536;

  console.log('1. Generando placa fotográfica 2.7K ultranítida office-master.jpg...');
  await sharp(realOfficeSrc)
    .resize(width, height)
    .linear(1.18, -12) // Mayor contraste y negros profundos
    .modulate({ brightness: 0.98, saturation: 1.08 })
    .sharpen({ sigma: 1.3, m1: 1.2, m2: 2.5 }) // Textos del monitor y celular hipernítidos
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(masterJpgPath);
  console.log('office-master.jpg generado con éxito en:', masterJpgPath);

  console.log('2. Generando mapa de profundidad 2.7K calibrado office-depth.png...');
  // Mapa de profundidad fotográfico con gradientes continuos y desenfoque gausiano:
  // Fondo lejano (>3m): valor 242-255 (blanco / gris muy claro)
  // Escritorio / Laptop intermedia (~70cm): valor 128 (gris medio)
  // Celular y mano en primer plano (~35cm): valor 38 (gris oscuro / casi negro)
  const depthSvg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradiente general de profundidad del espacio de oficina (fondo hacia mesa) -->
      <linearGradient id="office-room-depth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FAFAFA" />   <!-- Techo / fondo infinito: 250 -->
        <stop offset="42%" stop-color="#E8E8E8" />  <!-- Paredes y compañeros: 232 -->
        <stop offset="68%" stop-color="#B0B0B0" />  <!-- Borde lejano del escritorio: 176 -->
        <stop offset="100%" stop-color="#888888" /> <!-- Plano mesa general: 136 -->
      </linearGradient>

      <!-- Gradiente de la zona intermedia de la Laptop y escritorio -->
      <radialGradient id="laptop-depth" cx="58%" cy="56%" r="38%">
        <stop offset="0%" stop-color="#7C7C7C" />   <!-- Pantalla laptop (~70 cm): 124 -->
        <stop offset="65%" stop-color="#8E8E8E" />  <!-- Teclado y taza: 142 -->
        <stop offset="100%" stop-color="#A5A5A5" /> <!-- Transición al fondo -->
      </radialGradient>

      <!-- Gradiente de Smartphone en mano (Primer plano ~35 cm) -->
      <radialGradient id="phone-depth" cx="18%" cy="78%" r="35%">
        <stop offset="0%" stop-color="#242424" />   <!-- Celular (~35 cm): 36 -->
        <stop offset="45%" stop-color="#2E2E2E" />  <!-- Pantalla y mano: 46 -->
        <stop offset="75%" stop-color="#484848" />  <!-- Muñeca y antebrazo: 72 -->
        <stop offset="100%" stop-color="#808080" /> <!-- Unión con la mesa -->
      </radialGradient>

      <filter id="soft-blur" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="24" />
      </filter>
    </defs>

    <!-- 1. Fondo completo de la oficina (Profundidad z ≈ 0.90 - 1.0) -->
    <rect width="${width}" height="${height}" fill="url(#office-room-depth)" />

    <!-- 2. Plano medio: Escritorio, Laptop y taza de café (Profundidad z ≈ 0.48 - 0.55) -->
    <g filter="url(#soft-blur)">
      <!-- Superficie de la mesa -->
      <path d="M 322 753 L 2752 645 L 2752 1536 L 484 1536 Z" fill="#8C8C8C" opacity="0.85" />
      <!-- Silueta amplia de laptop y área de trabajo central -->
      <ellipse cx="1558" cy="887" rx="752" ry="484" fill="url(#laptop-depth)" />
    </g>

    <!-- 3. Primer plano: Brazo, mano y Smartphone (Profundidad z ≈ 0.12 - 0.20) -->
    <g filter="url(#soft-blur)">
      <!-- Antebrazo y mano que entra desde la esquina inferior izquierda -->
      <path d="M 0 860 
               C 268 860, 645 914, 779 1102 
               C 913 1264, 860 1452, 645 1536 
               L 0 1536 Z" 
            fill="url(#phone-depth)" />
      <!-- Foco preciso en el cuerpo del smartphone -->
      <ellipse cx="456" cy="1210" rx="376" ry="295" fill="#242424" opacity="0.95" />
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
