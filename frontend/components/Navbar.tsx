'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const linkClass = (href: string) =>
    `text-sm transition-colors hover:text-ink ${pathname === href ? 'text-ink' : 'text-muted'}`;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="container-lueur flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-wide text-ink">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          LUEUR
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/" className={linkClass('/')}>Accueil</Link>
          <Link href="/products" className={linkClass('/products')}>Collection</Link>
          {user && <Link href="/favorites" className={linkClass('/favorites')}>Favoris</Link>}
          {user?.role === 'Admin' && (
            <Link href="/admin/products" className={linkClass('/admin/products')}>Administration</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!isLoading && user && (
            <>
              <Link
                href="/profile"
                className="hidden text-sm text-muted hover:text-ink sm:inline"
              >
                {user.displayName}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-pill border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Déconnexion
              </button>
            </>
          )}
          {!isLoading && !user && (
            <>
              <Link href="/login" className="text-sm text-muted hover:text-ink">Connexion</Link>
              <Link
                href="/register"
                className="rounded-pill bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
