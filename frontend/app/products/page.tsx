'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const { token, refreshProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<Product[]>('/api/products', token)
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, [token]);

  const toggleFavorite = async (id: number) => {
    if (!token) return;
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setBusyId(id);
    try {
      if (product.isFavorite) {
        await api.delete(`/api/favorites/${id}`, token);
      } else {
        await api.post(`/api/favorites/${id}`, undefined, token);
      }
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)));
    } catch (err) {
      if (!(err instanceof ApiError)) console.error(err);
    } finally {
      setBusyId(null);
      refreshProfile();
    }
  };

  return (
    <div className="container-lueur py-14">
      <div className="mb-10 max-w-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Collection</p>
        <h1 className="mt-3 font-display text-3xl italic text-ink">Chaque teinte, une lumière différente</h1>
      </div>

      {isLoading ? (
        <p className="text-muted">Chargement de la collection…</p>
      ) : products.length === 0 ? (
        <p className="text-muted">Aucun produit pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onToggleFavorite={token ? toggleFavorite : undefined}
              favoriteBusy={busyId === p.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
