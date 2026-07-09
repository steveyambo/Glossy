'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GlossDrop } from '@/components/GlossDrop';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, user, refreshProfile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<Product>(`/api/products/${id}`, token)
      .then(setProduct)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      });
  }, [id, token]);

  const toggleFavorite = async () => {
    if (!token || !product) return;
    setBusy(true);
    try {
      if (product.isFavorite) {
        await api.delete(`/api/favorites/${product.id}`, token);
      } else {
        await api.post(`/api/favorites/${product.id}`, undefined, token);
      }
      setProduct({ ...product, isFavorite: !product.isFavorite });
    } finally {
      setBusy(false);
      refreshProfile();
    }
  };

  if (notFound) {
    return (
      <div className="container-lueur py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Ce produit n&apos;existe pas.</h1>
        <button onClick={() => router.push('/products')} className="mt-4 text-accent hover:underline">
          Retour à la collection
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className="container-lueur py-24 text-center text-muted">Chargement…</div>;
  }

  return (
    <div className="container-lueur grid gap-12 py-14 md:grid-cols-2">
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-line bg-surface2">
        <GlossDrop color={product.colorHex} className="h-56 w-56 drop-shadow-xl" />
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">{product.finish}</p>
        <h1 className="mt-3 font-display text-4xl italic text-ink">{product.name}</h1>
        <p className="mt-1 text-muted">{product.shade}</p>
        <p className="mt-6 font-display text-2xl text-accent">{product.price.toFixed(2)} €</p>
        <p className="mt-6 max-w-md leading-relaxed text-muted">{product.description}</p>

        {!product.inStock && (
          <p className="mt-4 inline-block w-fit rounded-pill border border-line px-4 py-1.5 text-sm text-muted">
            Actuellement en rupture de stock
          </p>
        )}

        <div className="mt-8 flex gap-4">
          {user ? (
            <button
              onClick={toggleFavorite}
              disabled={busy}
              className={`rounded-pill px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50 ${
                product.isFavorite
                  ? 'border border-accent text-accent hover:bg-accent hover:text-bg'
                  : 'bg-accent text-bg hover:opacity-90'
              }`}
            >
              {product.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="rounded-pill bg-accent px-6 py-3 text-sm font-medium text-bg hover:opacity-90"
            >
              Se connecter pour ajouter aux favoris
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
