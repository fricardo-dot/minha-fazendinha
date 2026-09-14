// Gera os ícones PNG da PWA a partir de um SVG próprio (galinha em fundo verde).
// Uso: npm run icons   (só precisa rodar quando o desenho do ícone mudar; os PNGs ficam versionados em public/icons)
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';

const INK = '#5B3D2E';

function iconSvg({ padding }) {
  // padding: fração da borda mantida livre (ícones "maskable" precisam de ~20%)
  const inner = 1 - padding * 2;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#B7E9F7"/>
      <stop offset=".55" stop-color="#C9ECF7"/>
      <stop offset=".55" stop-color="#8FD36A"/>
      <stop offset="1" stop-color="#67B94A"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#g)"/>
  <circle cx="420" cy="92" r="46" fill="#FFD24A" stroke="#F0B429" stroke-width="6"/>
  <g transform="translate(${256 - 200 * inner} ${256 - 200 * inner + 24 * inner}) scale(${2 * inner})">
    <ellipse cx="100" cy="192" rx="62" ry="9" fill="rgba(60,40,20,.16)"/>
    <g stroke="#F0A030" stroke-width="7" stroke-linecap="round" fill="none">
      <path d="M84 156v26M74 184h20M84 182l-8 8M84 182l8 8"/>
      <path d="M116 156v26M106 184h20M116 182l-8 8M116 182l8 8"/>
    </g>
    <path d="M40 112c-18-10-26-34-16-50 6 12 14 16 22 18-6-12-4-24 4-32 4 14 12 20 20 24" fill="#FFF0D0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="100" cy="122" rx="62" ry="50" fill="#FFF6E4" stroke="${INK}" stroke-width="4.5"/>
    <path d="M62 118c10-16 40-20 56-8-10 22-40 30-56 8z" fill="#FFE8C4" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="132" cy="70" r="36" fill="#FFF6E4" stroke="${INK}" stroke-width="4.5"/>
    <path d="M112 42c-2-14 8-20 14-12 2-14 16-16 18-4 6-8 18-4 14 8-4 8-10 10-18 10h-20c-4 0-8-1-8-2z" fill="#E0574B" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M162 72l26 6-26 10z" fill="#F0A030" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M156 88c6 2 8 12 2 18s-14 0-12-8" fill="#E0574B" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="142" cy="68" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <circle cx="144" cy="69" r="4.2" fill="${INK}"/>
    <circle cx="146" cy="66" r="1.5" fill="#fff"/>
    <circle cx="122" cy="84" r="6" fill="#FFB5C2" opacity=".8"/>
  </g>
</svg>`;
}

mkdirSync('public/icons', { recursive: true });
const normal = Buffer.from(iconSvg({ padding: 0.06 }));
const maskable = Buffer.from(iconSvg({ padding: 0.18 }));

await sharp(normal).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(normal).resize(512, 512).png().toFile('public/icons/icon-512.png');
await sharp(normal).resize(180, 180).png().toFile('public/icons/apple-touch-icon.png');
await sharp(maskable).resize(512, 512).png().toFile('public/icons/maskable-512.png');
writeFileSync('public/icons/icon.svg', iconSvg({ padding: 0.06 }).trim());
console.log('Ícones gerados em public/icons');
