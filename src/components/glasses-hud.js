/**
 * Montura Oftálmica en Primera Persona (HUD POV Binocular Realista)
 * Representa la montura física a 14 mm del vértice corneal con DoF fisiológico
 */
export class GlassesHUD {
  constructor(containerElement) {
    this.container = containerElement;
    this.element = null;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'glasses-hud-layer';

    // SVG Panorámico Binocular 1920x1080 (16:9)
    this.element.innerHTML = `
      <svg id="glasses-svg" width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Desenfoque de Profundidad de Campo (DoF): marco a 14 mm de la córnea -->
          <filter id="dof-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>

          <!-- Sombra suave de oclusión del marco con el rostro -->
          <filter id="peripheral-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="0" dy="4" />
            <feComponentTransfer><feFuncA type="linear" slope="0.45" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          <!-- Gradiente de Titanio / Acetato Negro Mate -->
          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E293B" stop-opacity="0.96" />
            <stop offset="40%" stop-color="#0F172A" stop-opacity="0.98" />
            <stop offset="70%" stop-color="#090D16" stop-opacity="0.98" />
            <stop offset="100%" stop-color="#1E293B" stop-opacity="0.96" />
          </linearGradient>

          <!-- Bisel interno del cristal facetado -->
          <linearGradient id="bevelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.50)" />
            <stop offset="45%" stop-color="rgba(255, 255, 255, 0.08)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.35)" />
          </linearGradient>
        </defs>

        <!-- Sombra perimetral facial -->
        <g filter="url(#peripheral-shadow)" opacity="0.60">
          <path d="M 120 110 
                   C 600 75, 1320 75, 1800 110 
                   C 1880 480, 1870 780, 1760 950 
                   C 1420 1020, 1150 1010, 1020 930 
                   C 990 890, 960 875, 930 890 
                   C 900 930, 770 1010, 500 1020 
                   C 280 1020, 190 980, 160 950 
                   C 50 780, 40 480, 120 110 Z" 
                fill="none" stroke="#000000" stroke-width="26" />
        </g>

        <!-- Montura Oftálmica Realista Vectorial HD -->
        <g id="glasses-frame-group">
          <!-- Borde exterior del marco -->
          <path d="M 120 110 
                   C 600 75, 1320 75, 1800 110 
                   C 1880 480, 1870 780, 1760 950 
                   C 1420 1020, 1150 1010, 1020 930 
                   C 990 890, 960 875, 930 890 
                   C 900 930, 770 1010, 500 1020 
                   C 280 1020, 190 980, 160 950 
                   C 50 780, 40 480, 120 110 Z" 
                fill="none" 
                stroke="url(#frameGradient)" 
                stroke-width="16" 
                stroke-linejoin="round"
                filter="url(#dof-blur)" />

          <!-- Bisel interno de laboratorio del cristal óptico -->
          <path d="M 128 118 
                   C 605 83, 1315 83, 1792 118 
                   C 1868 480, 1858 775, 1752 942 
                   C 1415 1010, 1148 1000, 1022 922 
                   C 992 882, 960 868, 928 882 
                   C 898 922, 772 1000, 505 1010 
                   C 285 1010, 195 972, 168 942 
                   C 60 775, 50 480, 128 118 Z" 
                fill="none" 
                stroke="url(#bevelGradient)" 
                stroke-width="3" 
                stroke-linejoin="round" />
        </g>
      </svg>
    `;

    this.container.appendChild(this.element);
  }
}
