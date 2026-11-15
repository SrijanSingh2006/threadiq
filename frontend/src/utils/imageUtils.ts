export function getProductFallbackImage(
  name?: string,
  category?: string,
  brand?: string
): string {
  const safeName = name || 'Fashion Item';
  const cat = category || 'Apparel';
  const br = brand || 'ThreadIQ';

  // Words for initials
  const words = safeName.trim().split(/\s+/).filter(Boolean);
  const initials = words.length >= 2
    ? `${words[0][0]}${words[1][0]}`.toUpperCase()
    : safeName.slice(0, 2).toUpperCase();

  // Color palettes tailored for fashion categories
  const palettes = [
    { bg1: '#312e81', bg2: '#4f46e5', accent: '#c7d2fe', text: '#ffffff' }, // Indigo / Classic
    { bg1: '#881337', bg2: '#e11d48', accent: '#fecdd3', text: '#ffffff' }, // Rose / Ethnic
    { bg1: '#064e3b', bg2: '#059669', accent: '#a7f3d0', text: '#ffffff' }, // Emerald / Eco
    { bg1: '#0c4a6e', bg2: '#0284c7', accent: '#bae6fd', text: '#ffffff' }, // Sky / Activewear
    { bg1: '#4c1d95', bg2: '#7c3aed', accent: '#ddd6fe', text: '#ffffff' }, // Violet / Designer
    { bg1: '#78350f', bg2: '#d97706', accent: '#fde68a', text: '#ffffff' }, // Amber / Warm
    { bg1: '#1e293b', bg2: '#334155', accent: '#cbd5e1', text: '#ffffff' }, // Slate / Modern Minimal
  ];

  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = (hash << 5) - hash + safeName.charCodeAt(i);
    hash |= 0;
  }
  const theme = palettes[Math.abs(hash) % palettes.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 420" width="320" height="420">
  <defs>
    <linearGradient id="grad_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="60%" stop-color="${theme.bg2}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </linearGradient>
    <pattern id="pattern_${Math.abs(hash)}" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.08)"/>
    </pattern>
  </defs>
  <rect width="320" height="420" fill="url(#grad_${Math.abs(hash)})"/>
  <rect width="320" height="420" fill="url(#pattern_${Math.abs(hash)})"/>
  
  <g transform="translate(160, 160)">
    <circle cx="0" cy="0" r="56" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
    <text x="0" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="38" font-weight="800" fill="${theme.text}" text-anchor="middle" letter-spacing="2">${initials}</text>
  </g>

  <g transform="translate(160, 260)">
    <rect x="-70" y="-14" width="140" height="28" rx="14" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
    <text x="0" y="4" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700" fill="${theme.accent}" text-anchor="middle" letter-spacing="1.5">${br.toUpperCase()}</text>
  </g>

  <text x="160" y="315" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="600" fill="${theme.text}" text-anchor="middle" opacity="0.95">${cat}</text>
  <text x="160" y="380" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9" font-weight="600" fill="${theme.accent}" text-anchor="middle" letter-spacing="2" opacity="0.75">THREADIQ FASHION INTELLIGENCE</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement>,
  name?: string,
  category?: string,
  brand?: string
): void {
  const target = e.currentTarget;
  target.onerror = null;
  target.removeAttribute('crossorigin');
  target.removeAttribute('referrerpolicy');
  target.src = getProductFallbackImage(name, category, brand);
}
