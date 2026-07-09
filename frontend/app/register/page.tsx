'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, displayName, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de créer le compte pour le moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-lueur flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Espace membre</p>
        <h1 className="mt-3 font-display text-3xl italic text-ink">Rejoindre LUEUR</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Nom affiché
            <input
              type="text"
              required
              minLength={2}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-lg border border-line bg-surface px-4 py-2.5 text-ink"
              placeholder="Camille"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-line bg-surface px-4 py-2.5 text-ink"
              placeholder="vous@exemple.fr"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Mot de passe
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-line bg-surface px-4 py-2.5 text-ink"
              placeholder="8 caractères minimum"
            />
          </label>

          {error && <p className="text-sm text-accent" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-pill bg-accent px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Création du compte…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
