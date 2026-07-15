import type { Metadata } from "next";
import { Catalog } from "../components/store-front";
import { PageShell } from "../components/site-chrome";

export const metadata: Metadata = { title: "Nos gloss", description: "Découvrez les gloss JAWNAH et trouvez votre éclat." };
export default function ProductsPage() { return <PageShell><main><section className="page-hero"><div><div className="eyebrow">JAWNAH collection</div><h1>Tous nos gloss</h1><p>Des teintes signatures aux reflets cristallins, imaginées pour accompagner chaque lumière et chaque sourire.</p></div></section><Catalog title="Choisissez votre lumière" intro="Filtrez par fini, par teinte ou par disponibilité."/></main></PageShell>; }
