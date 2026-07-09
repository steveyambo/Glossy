'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/lib/types';

export function ProtectedRoute({
  children,
  requireRole,
}: {
  children: React.ReactNode;
  requireRole?: Role;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
    } else if (requireRole && user.role !== requireRole) {
      router.replace('/');
    }
  }, [isLoading, user, requireRole, router]);

  if (isLoading || !user || (requireRole && user.role !== requireRole)) {
    return (
      <div className="container-lueur py-24 text-center text-muted">
        Chargement…
      </div>
    );
  }

  return <>{children}</>;
}
