import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Public App SVG (Emerald / Cyan Gamer Logo)
const publicSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080a11"/>
      <stop offset="50%" stop-color="#0a1219"/>
      <stop offset="100%" stop-color="#05140f"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  
  <!-- Base Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="url(#accentGrad)" stroke-width="6" opacity="0.6"/>

  <!-- Inner Ambient Glow Circle -->
  <circle cx="256" cy="230" r="140" fill="#10b981" opacity="0.15" filter="url(#glow)"/>

  <!-- Game Controller Icon -->
  <g transform="translate(116, 120)" fill="none" stroke="url(#accentGrad)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">
    <!-- Gamepad Body -->
    <path d="M70 20 C35 20, 15 50, 15 105 C15 170, 45 220, 75 220 C100 220, 110 185, 140 185 C170 185, 180 220, 205 220 C235 220, 265 170, 265 105 C265 50, 245 20, 210 20 Z" fill="#0f172a" fill-opacity="0.85"/>
    <!-- D-Pad Left -->
    <line x1="65" y1="85" x2="95" y2="85" stroke="#10b981" stroke-width="14"/>
    <line x1="80" y1="70" x2="80" y2="100" stroke="#10b981" stroke-width="14"/>
    <!-- Buttons Right -->
    <circle cx="195" cy="85" r="7" fill="#06b6d4" stroke="none"/>
    <circle cx="210" cy="72" r="7" fill="#10b981" stroke="none"/>
    <circle cx="210" cy="98" r="7" fill="#10b981" stroke="none"/>
    <circle cx="225" cy="85" r="7" fill="#06b6d4" stroke="none"/>
  </g>

  <!-- Typography SG MAKER -->
  <text x="256" y="405" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="4">
    SG <tspan fill="#10b981">MAKER</tspan>
  </text>
  <text x="256" y="445" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="18" fill="#94a3b8" letter-spacing="5">
    GAMING STUDIO
  </text>
</svg>
`;

// 2. Admin App SVG (Cyber Cyan & Gold Crown / Shield)
const adminSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="adminBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070b14"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#091428"/>
    </linearGradient>
    <linearGradient id="adminGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <filter id="adminGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  
  <!-- Base Background -->
  <rect width="512" height="512" rx="112" fill="url(#adminBg)"/>
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="url(#adminGold)" stroke-width="6" opacity="0.8"/>

  <!-- Inner Ambient Glow Circle -->
  <circle cx="256" cy="220" r="130" fill="#f59e0b" opacity="0.15" filter="url(#adminGlow)"/>

  <!-- Admin Shield Container -->
  <g transform="translate(136, 100)" fill="none" stroke="url(#adminGold)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
    <path d="M120 20 L220 50 C220 160, 160 215, 120 235 C80 215, 20 160, 20 50 Z" fill="#0b132b" fill-opacity="0.9"/>
    <!-- Crown inside Shield -->
    <path d="M60 135 L80 90 L120 115 L160 90 L180 135 Z" fill="#f59e0b" stroke="#f59e0b" stroke-width="6"/>
    <circle cx="60" cy="85" r="5" fill="#f59e0b"/>
    <circle cx="120" cy="75" r="6" fill="#10b981"/>
    <circle cx="180" cy="85" r="5" fill="#f59e0b"/>
    <!-- Keyhole / Star -->
    <circle cx="120" cy="165" r="10" fill="#06b6d4"/>
    <line x1="120" y1="175" x2="120" y2="195" stroke="#06b6d4" stroke-width="8"/>
  </g>

  <!-- Typography SGM ADMIN -->
  <text x="256" y="405" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="4">
    SGM <tspan fill="#f59e0b">ADMIN</tspan>
  </text>
  <text x="256" y="445" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="18" fill="#38bdf8" letter-spacing="5">
    STUDIO OPERATIONS
  </text>
</svg>
`;

async function run() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), publicSvg.trim());
  fs.writeFileSync(path.join(publicDir, 'admin-icon.svg'), adminSvg.trim());

  // Generate Public Icons
  await sharp(Buffer.from(publicSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Created icon-192.png');

  await sharp(Buffer.from(publicSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Created icon-512.png');

  await sharp(Buffer.from(publicSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Generate Admin Icons
  await sharp(Buffer.from(adminSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'admin-icon-192.png'));
  console.log('Created admin-icon-192.png');

  await sharp(Buffer.from(adminSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'admin-icon-512.png'));
  console.log('Created admin-icon-512.png');

  console.log('All icons generated successfully!');
}

run().catch(console.error);
