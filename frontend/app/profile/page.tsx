'use client';

import { useState, FormEvent, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { UserProfile } from '@/lib/types';

function ProfileContent() {
  const { user, token, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (user) setDisplayName(user.displayName);
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await api.put<UserProfile>('/api/users/me', { displayName }, token);
      await refreshProfile();
      setStatus('saved');
    } catch (err) {
      setStatus('error');
      if (!(err instanceof ApiError)) console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="container-lueur max-w-lg py-14">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">Espace membre</p>
      <h1 className="mt-3 font-display text-3xl italic text-ink">Mon profil</h1>

      <dl className="mt-8 space-y-3 rounded-2xl border border-line bg-surface p-6">
        <div className="flex justify-between text-sm">
          <dt className="text-muted">Email</dt>
          <dd className="text-ink">{user.email}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-muted">Rôle</dt>
          <dd className="text-ink">{user.role === 'Admin' ? 'Administrateur' : 'Cliente / Client'}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-muted">Membre depuis</dt>
          <dd className="text-ink">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</dd>
        </div>
      </dl>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Nom affiché
          <input
            type="text"
            required
            minLength={2}
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); setStatus('idle'); }}
            className="rounded-lg border border-line bg-surface px-4 py-2.5 text-ink"
          />
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="rounded-pill bg-accent px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {status === 'saved' && <span className="text-sm text-accent">Profil mis à jour.</span>}
          {status === 'error' && <span className="text-sm text-accent">Une erreur est survenue.</span>}
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
