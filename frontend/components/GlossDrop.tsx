'use client';

/**
 * Goutte de gloss stylisée : forme organique + reflet lumineux.
 * Sert de substitut visuel à la photographie produit, cohérent avec
 * l'identité "verre/liquide" de la marque.
 */
export function GlossDrop({ color, className = '' }: { color: string; className?: string }) {
  const gradId = `sheen-${color.replace('#', '')}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="white" stopOpacity="0.85" />
          <stop offset="18%" stopColor="white" stopOpacity="0.25" />
          <stop offset="45%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </radialGradient>
        <filter id={`blur-${color.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <path
        d="M100 18C126 18 172 58 176 104C180 150 142 182 100 182C58 182 22 150 24 106C26 60 74 18 100 18Z"
        fill={`url(#${gradId})`}
      />
      <ellipse cx="72" cy="58" rx="18" ry="10" fill="white" opacity="0.55" filter={`url(#blur-${color.replace('#', '')})`} />
    </svg>
  );
}
