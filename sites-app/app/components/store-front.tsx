"use client";

import { useMemo, useState } from "react";
import { money, Product, products, settings, whatsappUrl } from "../data";
import { ProductCard } from "./product-card";
import { Footer, Header } from "./site-chrome";

export function OrderModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1);
  if (!product) return null;
  const summary = `Bonjour JAWNAH, je souhaite commander ${quantity} × ${product.name}, teinte ${product.shade}. Total estimé : ${money(product.price * quantity)}.`;
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title">
      <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button><div className="eyebrow">Votre sélection</div><h2 id="order-title">Comment souhaitez-vous commander ?</h2>
      <div className="modal-product"><img src={product.image} alt=""/><div><strong>{product.name}</strong><span>Teinte {product.shade}</span><b>{money(product.price)}</b></div></div>
      <label className="quantity">Quantité <span><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}>+</button></span></label>
      <div className="order-total"><span>Montant estimé</span><strong>{money(product.price * quantity)}</strong></div>
      <a className="channel whatsapp" href={whatsappUrl(product, quantity)} target="_blank" rel="noreferrer"><span>WhatsApp</span><small>Message prérempli et prêt à envoyer</small></a>
      <button className="channel snapchat" onClick={async () => { await navigator.clipboard?.writeText(summary); window.open(`https://www.snapchat.com/add/${settings.snapchat}`, "_blank"); }}><span>Snapchat</span><small>Copier la demande puis ouvrir le profil</small></button>
      <p className="modal-note">Aucun paiement en ligne. JAWNAH confirme la disponibilité, la livraison et le règlement directement avec vous.</p>
    </div>
  </div>;
}

export function Catalog({ title = "Trouvez votre éclat", intro = "Trois finis, une même obsession : la lumière." }: { title?: string; intro?: string }) {
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("Toutes"); const [order, setOrder] = useState<Product | null>(null);
  const filters = ["Toutes", "Transparent", "Pailleté", "Rouge", "Disponible", "Nouveautés", "Populaires"];
  const list = useMemo(() => products.filter(p => {
    const matchesQuery = `${p.name} ${p.shade}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "Toutes" || p.category === filter || (filter === "Disponible" && p.stock > 0) || (filter === "Nouveautés" && p.badge === "Nouveau") || (filter === "Populaires" && p.badge === "Populaire");
    return matchesQuery && matchesFilter;
  }), [query, filter]);
  return <section className="catalog section" id="nouveautes"><div className="section-heading split"><div><div className="eyebrow">La collection</div><h2>{title}</h2><p>{intro}</p></div><label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher une teinte" aria-label="Rechercher une teinte"/></label></div>
    <div className="filter-row" role="group" aria-label="Filtrer les produits">{filters.map(f => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div>
    <div className="product-grid">{list.map(product => <ProductCard key={product.id} product={product} onOrder={setOrder}/>)}</div>{list.length === 0 && <p className="empty-state">Aucune teinte ne correspond à votre recherche.</p>}<OrderModal product={order} onClose={() => setOrder(null)}/>
  </section>;
}

function BeforeAfter() {
  const [position, setPosition] = useState(52);
  return <section className="before-section section"><div className="section-heading centered"><div className="eyebrow">L'effet JAWNAH</div><h2>La lumière change tout.</h2><p>Faites glisser pour révéler la brillance JAWNAH.</p></div><div className="comparison">
    <img src="/lips-before.webp" alt="Lèvres naturelles avant application du gloss"/><div className="after-image" style={{ width: `${position}%` }}><img src="/lips-after.webp" alt="Lèvres brillantes après application du gloss"/></div><span className="comparison-label before">Avant</span><span className="comparison-label after">Après</span><div className="slider-line" style={{ left: `${position}%` }}><span>↔</span></div><input type="range" min="5" max="95" value={position} onChange={e => setPosition(Number(e.target.value))} aria-label="Comparer avant et après"/>
  </div></section>;
}

export function StoreFront() {
  const [order, setOrder] = useState<Product | null>(null);
  return <><Header/><main>
    <section className="hero">
      <div className="aura aura-one"/><div className="aura aura-two"/>
      <div className="floating-gloss gloss-one"><img src="/gloss-sienna-cutout.png" alt="Gloss rouge Sienna"/></div><div className="floating-gloss gloss-two"><img src="/gloss-star-cutout.png" alt="Gloss nacré Star"/></div><div className="floating-gloss gloss-three"><img src="/gloss-magic-cutout.png" alt="Gloss transparent Magic"/></div>
      <div className="hero-copy"><div className="eyebrow">Gloss couture · Brillance miroir</div><h1>Révélez l’éclat<br/><em>de vos lèvres</em></h1><p>Des gloss lumineux, confortables et irrésistibles conçus pour faire briller chaque sourire.</p><div className="hero-actions"><a className="button button-dark" href="#nouveautes">Découvrir les gloss</a><button className="button button-glass" onClick={() => setOrder(products[0])}>Commander maintenant</button></div></div>
      <a className="scroll-hint" href="#rituel"><span>Découvrir</span><i>↓</i></a>
    </section>

    <section className="manifesto section"><div className="eyebrow">Notre signature</div><p>Un éclat qui attire la lumière.<br/>Une texture qui se fait <em>oublier.</em></p><div className="manifesto-notes"><span>01 · Non collant</span><span>02 · Ultra lumineux</span><span>03 · Confort sensoriel</span></div></section>

    <section className="film-section" id="rituel"><video autoPlay muted loop playsInline preload="metadata" poster="/lips-after.webp"><source src="/jawna-video.mp4" type="video/mp4"/></video><div className="film-shade"/><div className="film-copy"><div className="eyebrow light-text">Le rituel lumière</div><h2>Une brillance qui se révèle<br/>à chaque passage</h2><p>Une texture légère, lumineuse et confortable pour sublimer naturellement vos lèvres.</p><a className="button button-light" href="#nouveautes">Voir la collection</a></div></section>

    <Catalog/>
    <BeforeAfter/>
    <section className="benefits section"><div className="benefit"><span>✦</span><h3>Brillance miroir</h3><p>Un fini laqué qui capte instantanément la lumière.</p></div><div className="benefit"><span>≈</span><h3>Texture légère</h3><p>Une sensation souple et confortable, jamais collante.</p></div><div className="benefit"><span>◇</span><h3>Reflets irisés</h3><p>Des micro-nacres fines, sans effet granuleux.</p></div><div className="benefit"><span>◷</span><h3>Confort longue durée</h3><p>Des lèvres enveloppées et lumineuses plus longtemps.</p></div></section>

    <section className="testimonials section"><div className="section-heading centered"><div className="eyebrow">Vos mots brillent aussi</div><h2>Adopté par vos lèvres.</h2></div><div className="review-grid"><blockquote><div>★★★★★</div><p>« Star illumine sans en faire trop. La texture est tellement douce que j'oublie que je le porte. »</p><footer><span>AM</span><b>Aminata</b><small>Lip Gloss Star</small></footer></blockquote><blockquote><div>★★★★★</div><p>« Le rouge Sienna est intense, mais reste élégant. Mon nouveau geste avant de sortir. »</p><footer><span>SK</span><b>Salimata</b><small>Lip Gloss Sienna</small></footer></blockquote><blockquote><div>★★★★★</div><p>« Magic donne exactement cet effet lèvres mouillées que je cherchais, sans coller. »</p><footer><span>FA</span><b>Fatou</b><small>Lip Gloss Magic</small></footer></blockquote></div></section>
    <section className="cta-section"><div><div className="eyebrow">Votre éclat vous attend</div><h2>Prête à faire<br/><em>briller votre sourire ?</em></h2><p>Choisissez votre teinte et finalisez votre commande avec nous, simplement.</p><a className="button button-light" href="/produits">Choisir mon gloss</a></div><div className="cta-products"><img src="/gloss-star-cutout.png" alt="Gloss Star"/><img src="/gloss-sienna-cutout.png" alt="Gloss Sienna"/></div></section>
  </main><Footer/><OrderModal product={order} onClose={() => setOrder(null)}/></>;
}
