"use client";

import { useState } from "react";
import { PageShell } from "../components/site-chrome";
import { settings } from "../data";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return <PageShell><main><section className="page-hero contact-hero"><div><div className="eyebrow">Parlons beauté</div><h1>Nous sommes là<br/><em>pour vous.</em></h1><p>Une question sur une teinte, la livraison ou votre commande ? Écrivez-nous sur votre canal préféré.</p></div></section><section className="contact-grid section"><div className="contact-cards"><a href={`https://wa.me/${settings.whatsapp}`} target="_blank"><span>WA</span><div><small>Réponse rapide</small><h2>WhatsApp</h2><p>Conseil teinte, disponibilité et livraison.</p></div><b>↗</b></a><a href={`https://www.snapchat.com/add/${settings.snapchat}`} target="_blank"><span>SC</span><div><small>Retrouvez-nous</small><h2>Snapchat</h2><p>@{settings.snapchat}</p></div><b>↗</b></a><div className="delivery-card"><span>⌂</span><div><small>Zone de livraison</small><h2>Burkina Faso</h2><p>{settings.delivery}</p></div></div></div><form className="contact-form" onSubmit={e => { e.preventDefault(); setSent(true); }}><div className="eyebrow">Message</div><h2>Écrivez à la maison JAWNAH.</h2><label>Votre prénom<input required placeholder="Aminata"/></label><label>Votre e-mail<input required type="email" placeholder="vous@exemple.com"/></label><label>Votre sujet<select><option>Conseil sur une teinte</option><option>Disponibilité d’un gloss</option><option>Livraison</option><option>Autre question</option></select></label><label>Votre message<textarea required rows={5} placeholder="Comment pouvons-nous vous aider ?"/></label><button className="button button-dark" type="submit">Envoyer le message</button>{sent && <p className="form-success">Merci ! Votre message de démonstration a bien été préparé.</p>}</form></section></main></PageShell>;
}
