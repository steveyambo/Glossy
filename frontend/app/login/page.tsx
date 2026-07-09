'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de se connecter pour le moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-lueur flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Espace membre</p>
        <h1 className="mt-3 font-display text-3xl italic text-ink">Content de vous revoir</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-muted/60"
              placeholder="vous@exemple.fr"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Mot de passe
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-line bg-surface px-4 py-2.5 text-ink"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-sm text-accent" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-pill bg-accent px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Créer un compte
          </Link>
        </p>

        <p className="mt-8 rounded-lg border border-line bg-surface/60 px-4 py-3 text-xs text-muted">
          Compte de démonstration admin : <code>admin@lueur.fr</code> / <code>Admin123!</code>
        </p>
      </div>
    </div>
  );
}
