"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a className="wordmark" href="/" aria-label="JAWNAH accueil">JAWNAH<span>lip gloss</span></a>
      <nav className={open ? "nav-open" : ""} aria-label="Navigation principale">
        <a href="/">Accueil</a><a href="/produits">Nos gloss</a><a href="/#nouveautes">Nouveautés</a><a href="/#maison">À propos</a><a href="/contact">Contact</a>
      </nav>
      <div className="header-actions">
        <a className="icon-link" href="/produits" aria-label="Rechercher">⌕</a><a className="icon-link" href="/favoris" aria-label="Favoris">♡</a><a className="icon-link account-link" href="/compte" aria-label="Compte">○</a>
        <a className="button button-dark header-order" href="/produits">Commander</a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Ouvrir le menu"><span/><span/></button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer" id="maison">
      <div className="footer-brand"><div className="wordmark light">JAWNAH<span>lip gloss</span></div><p>Le geste lumière qui révèle votre sourire. Des formules sensorielles, pensées pour le quotidien.</p></div>
      <div><h3>Explorer</h3><a href="/produits">Nos gloss</a><a href="/favoris">Mes favoris</a><a href="/contact">Contact</a></div>
      <div><h3>La maison</h3><a href="/#maison">Notre histoire</a><a href="/contact">Livraison</a><a href="/contact">Conseils</a></div>
      <div><h3>Nous suivre</h3><a href="https://wa.me/22670000000">WhatsApp</a><a href="https://www.snapchat.com/add/jawna.gloss">Snapchat</a><a href="https://instagram.com/jawna.gloss">Instagram</a></div>
      <div className="footer-bottom"><span>© 2026 JAWNAH. Tous droits réservés.</span><span>Confidentialité · Conditions · Mentions légales</span></div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) { return <><Header />{children}<Footer /></>; }
