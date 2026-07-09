'use client';

import { useEffect, useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { GlossDrop } from '@/components/GlossDrop';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Product } from '@/lib/types';

const EMPTY_FORM = {
  name: '',
  shade: '',
  description: '',
  price: '',
  colorHex: '#E8A9BD',
  finish: 'Glossy',
  inStock: true,
};

function AdminProductsContent() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = () => {
    setIsLoading(true);
    api.get<Product[]>('/api/products', token).then(setProducts).finally(() => setIsLoading(false));
  };

  useEffect(loadProducts, [token]);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      shade: p.shade,
      description: p.description,
      price: String(p.price),
      colorHex: p.colorHex,
      finish: p.finish,
      inStock: p.inStock,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      name: form.name,
      shade: form.shade,
      description: form.description,
      price: parseFloat(form.price || '0'),
      colorHex: form.colorHex,
      finish: form.finish,
      inStock: form.inStock,
    };
    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, payload, token);
      } else {
        await api.post('/api/products', payload, token);
      }
      cancelEdit();
      loadProducts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'enregistrer ce produit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit définitivement ?')) return;
    await api.delete(`/api/products/${id}`, token);
    loadProducts();
  };

  return (
    <div className="container-lueur py-14">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">Administration</p>
      <h1 className="mt-3 font-display text-3xl italic text-ink">Gestion de la collection</h1>

      {/* Formulaire de création / édition */}
      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-2xl border border-line bg-surface p-6 md:grid-cols-2">
        <h2 className="font-display text-lg text-ink md:col-span-2">
          {editingId ? 'Modifier le produit' : 'Nouveau produit'}
        </h2>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Nom
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-line bg-bg px-4 py-2.5 text-ink" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Teinte
          <input required value={form.shade} onChange={(e) => setForm({ ...form, shade: e.target.value })}
            className="rounded-lg border border-line bg-bg px-4 py-2.5 text-ink" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted md:col-span-2">
          Description
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border border-line bg-bg px-4 py-2.5 text-ink" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Prix (€)
          <input required type="number" step="0.01" min="0" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-lg border border-line bg-bg px-4 py-2.5 text-ink" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Fini
          <input value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })}
            className="rounded-lg border border-line bg-bg px-4 py-2.5 text-ink" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Couleur
          <input type="color" value={form.colorHex} onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
            className="h-11 w-full rounded-lg border border-line bg-bg px-2" />
        </label>
        <label className="flex items-center gap-2 self-end text-sm text-muted">
          <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
          En stock
        </label>

        {error && <p className="text-sm text-accent md:col-span-2" role="alert">{error}</p>}

        <div className="flex gap-3 md:col-span-2">
          <button type="submit" disabled={isSubmitting}
            className="rounded-pill bg-accent px-6 py-3 text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Ajouter le produit'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}
              className="rounded-pill border border-line px-6 py-3 text-sm text-ink hover:border-accent hover:text-accent">
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Liste des produits */}
      <div className="mt-10">
        {isLoading ? (
          <p className="text-muted">Chargement…</p>
        ) : (
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <GlossDrop color={p.colorHex} className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-ink">{p.name}</p>
                  <p className="text-sm text-muted">{p.shade} · {p.price.toFixed(2)} € · {p.inStock ? 'En stock' : 'Rupture'}</p>
                </div>
                <button onClick={() => startEdit(p)}
                  className="rounded-pill border border-line px-4 py-2 text-sm text-ink hover:border-accent hover:text-accent">
                  Modifier
                </button>
                <button onClick={() => handleDelete(p.id)}
                  className="rounded-pill border border-line px-4 py-2 text-sm text-muted hover:border-accent hover:text-accent">
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requireRole="Admin">
      <AdminProductsContent />
    </ProtectedRoute>
  );
}
