"use client";

import { useEffect, useState } from "react";
import { money, Product } from "../data";

const key = "jawna-favorites";
export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}

export function ProductCard({ product, onOrder }: { product: Product; onOrder: (p: Product) => void }) {
  const [favorite, setFavorite] = useState(false);
  useEffect(() => setFavorite(readFavorites().includes(product.id)), [product.id]);
  const toggle = () => {
    const list = readFavorites();
    const next = list.includes(product.id) ? list.filter(id => id !== product.id) : [...list, product.id];
    localStorage.setItem(key, JSON.stringify(next)); setFavorite(next.includes(product.id));
  };
  return (
    <article className="product-card">
      <div className="shine"/><span className="badge">{product.badge}</span>
      <button className={`heart ${favorite ? "active" : ""}`} onClick={toggle} aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}>{favorite ? "♥" : "♡"}</button>
      <a href={`/produits/${product.slug}`} className="product-visual" style={{ "--tint": product.color } as React.CSSProperties}><img src={product.image} alt={`Gloss JAWNAH ${product.shade}`} loading="lazy" /></a>
      <div className="product-info"><div className="eyebrow">JAWNAH · {product.category}</div><h3>{product.name}</h3><p>{product.summary}</p><div className="product-meta"><strong>{money(product.price)}</strong><span className={product.stock < 8 ? "low-stock" : "in-stock"}>{product.stock < 8 ? `Plus que ${product.stock}` : "En stock"}</span></div>
      <div className="card-actions"><a className="button button-ghost" href={`/produits/${product.slug}`}>Voir le produit</a><button className="button button-dark" onClick={() => onOrder(product)}>Commander</button></div></div>
    </article>
  );
}
