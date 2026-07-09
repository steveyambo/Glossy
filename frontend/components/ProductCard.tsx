'use client';

import Link from 'next/link';
import { GlossDrop } from './GlossDrop';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
  onToggleFavorite?: (id: number) => void;
  favoriteBusy?: boolean;
}

export function ProductCard({ product, onToggleFavorite, favoriteBusy }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-transform duration-300 hover:-translate-y-1">
      {/* reflet glossy qui balaie la carte au survol */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
        <div className="absolute -top-1/2 left-0 h-[220%] w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-sheen" />
      </div>

      <Link href={`/products/${product.id}`} className="block">
        <div className="relative flex aspect-square items-center justify-center bg-surface2 p-8">
          <GlossDrop color={product.colorHex} className="h-32 w-32 drop-shadow-lg" />
          {!product.inStock && (
            <span className="absolute left-3 top-3 rounded-pill border border-line bg-bg/80 px-3 py-1 text-xs text-muted">
              Rupture
            </span>
          )}
        </div>
      </Link>

      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <Link href={`/products/${product.id}`}>
            <h3 className="truncate font-display text-lg text-ink">{product.name}</h3>
          </Link>
          <p className="mt-0.5 text-sm text-muted">{product.shade} · {product.finish}</p>
          <p className="mt-2 font-display text-base text-accent">{product.price.toFixed(2)} €</p>
        </div>

        {onToggleFavorite && (
          <button
            type="button"
            disabled={favoriteBusy}
            onClick={() => onToggleFavorite(product.id)}
            aria-pressed={product.isFavorite}
            aria-label={product.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="shrink-0 rounded-full border border-line p-2 text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={product.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s-7.5-4.6-10-9.1C.5 8 2.3 4.5 5.8 4c2-.3 3.9.7 6.2 3 2.3-2.3 4.2-3.3 6.2-3 3.5.5 5.3 4 3.8 7.9-2.5 4.5-10 9.1-10 9.1Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
