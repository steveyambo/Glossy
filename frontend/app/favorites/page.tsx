'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';

function FavoritesContent() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .get<Product[]>('/api/favorites', token)
      .then(setFavorites)
      .finally(() => setIsLoading(false));
  }, [token]);

  const remove = async (id: number) => {
    if (!token) return;
    setBusyId(id);
    try {
      await api.delete(`/api/favorites/${id}`, token);
      setFavorites((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container-lueur py-14">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">Espace membre</p>
      <h1 className="mt-3 font-display text-3xl italic text-ink">Vos favoris</h1>

      {isLoading ? (
        <p className="mt-8 text-muted">Chargement…</p>
      ) : favorites.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-surface px-8 py-12 text-center">
          <p className="text-muted">Vous n&apos;avez pas encore ajouté de favoris.</p>
          <Link href="/products" className="mt-4 inline-block text-accent hover:underline">
            Découvrir la collection
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((p) => (
            <ProductCard key={p.id} product={p} onToggleFavorite={remove} favoriteBusy={busyId === p.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}
