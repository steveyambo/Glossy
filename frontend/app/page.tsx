'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlossDrop } from '@/components/GlossDrop';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Product } from '@/lib/types';

const HERO_SHADES = ['#7A1F2B', '#E8A9BD', '#D9BB8E', '#4A2438'];

export default function HomePage() {
  const { token, refreshProfile } = useAuth();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    api.get<Product[]>('/api/products', token).then((all) => setFeatured(all.slice(0, 3))).catch(() => {});
  }, [token]);

  const toggleFavorite = async (id: number) => {
    if (!token) return;
    const product = featured.find((p) => p.id === id);
    if (!product) return;
    setBusyId(id);
    try {
      if (product.isFavorite) {
        await api.delete(`/api/favorites/${id}`, token);
      } else {
        await api.post(`/api/favorites/${id}`, undefined, token);
      }
      setFeatured((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)));
    } catch (err) {
      if (!(err instanceof ApiError)) console.error(err);
    } finally {
      setBusyId(null);
      refreshProfile();
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-lueur grid gap-12 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center animate-fadeUp">
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Collection permanente</p>
            <h1 className="mt-4 font-display text-5xl italic leading-[1.05] text-ink md:text-6xl">
              Un éclat qui
              <br />
              n&apos;appartient qu&apos;à vous.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              LUEUR conçoit des gloss à la texture fondante et au fini miroir,
              formulés pour révéler la lumière naturelle de chaque teint.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-pill bg-accent px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
              >
                Voir la collection
              </Link>
              <Link
                href="/register"
                className="rounded-pill border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Créer mon espace
              </Link>
            </div>
          </div>

          {/* Signature visuelle : gouttes de gloss qui dérivent doucement */}
          <div className="relative flex items-center justify-center">
            <div className="grid grid-cols-2 gap-6">
              {HERO_SHADES.map((color, i) => (
                <div
                  key={color}
                  className="animate-drift"
                  style={{ animationDelay: `${i * 1.6}s` }}
                >
                  <GlossDrop
                    color={color}
                    className={`h-28 w-28 drop-shadow-xl md:h-36 md:w-36 ${i % 2 === 1 ? 'mt-10' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-lueur py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl italic text-ink">Les incontournables</h2>
          <Link href="/products" className="text-sm text-muted hover:text-ink">
            Toute la collection →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-muted">Chargement de la collection…</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onToggleFavorite={token ? toggleFavorite : undefined}
                favoriteBusy={busyId === p.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
