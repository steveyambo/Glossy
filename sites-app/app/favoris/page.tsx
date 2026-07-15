"use client";

import { useEffect, useState } from "react";
import { Product, products } from "../data";
import { ProductCard, readFavorites } from "../components/product-card";
import { OrderModal } from "../components/store-front";
import { PageShell } from "../components/site-chrome";

export default function FavoritesPage() {
  const [ids, setIds] = useState<string[]>([]); const [order, setOrder] = useState<Product | null>(null);
  useEffect(() => setIds(readFavorites()), []); const items = products.filter(p => ids.includes(p.id));
  return <PageShell><main><section className="page-hero"><div><div className="eyebrow">Votre sélection</div><h1>Mes favoris</h1><p>Retrouvez en un regard les gloss qui vous font briller.</p></div></section><section className="section catalog"><div className="product-grid">{items.map(p => <ProductCard key={p.id} product={p} onOrder={setOrder}/>)}</div>{!items.length && <div className="favorites-empty"><span>♡</span><h2>Votre sélection attend son premier éclat.</h2><p>Ajoutez un cœur sur vos gloss préférés pour les retrouver ici.</p><a href="/produits" className="button button-dark">Découvrir la collection</a></div>}</section><OrderModal product={order} onClose={() => setOrder(null)}/></main></PageShell>;
}
