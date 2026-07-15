# JAWNAH Sites App

Application de référence du site JAWNAH, construite avec Vinext, React, TypeScript, Cloudflare Workers, D1 et Drizzle ORM.

## Objectif

Présenter les gloss JAWNAH dans une expérience premium et permettre aux clientes de préparer une demande de commande via WhatsApp ou Snapchat, sans paiement en ligne.

## Installation

```bash
npm ci
npm run dev
```

Node.js `>= 22.13.0` est requis.

## Commandes disponibles

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur local |
| `npm run build` | Produit le build Vinext/Cloudflare |
| `npm test` | Construit puis vérifie les rendus principaux |
| `npm run db:generate` | Génère une migration après modification du schéma Drizzle |

## Organisation

```text
app/
├── components/          Composants boutique et administration
├── produits/            Catalogue et fiches produit
├── favoris/             Favoris locaux pour les visiteurs
├── compte/              Espace cliente
├── admin/               Écrans du back-office
├── data.ts              Produits et paramètres de démonstration
└── globals.css          Direction artistique responsive

db/
└── schema.ts            Modèle relationnel Drizzle/D1

drizzle/                 Migrations SQL versionnées
public/                  Images, vidéo et carte Open Graph
tests/                   Vérifications du rendu serveur
```

## Configuration des commandes sociales

Modifier `app/data.ts` pour les valeurs locales de démonstration :

```ts
export const settings = {
  whatsapp: "22670000000",
  snapchat: "jawna.gloss",
  instagram: "jawna.gloss",
  delivery: "Livraison à Ouagadougou et partout au Burkina Faso",
};
```

Le numéro WhatsApp doit contenir l’indicatif pays, sans espace ni signe `+`.

## Données

Le schéma définit les tables suivantes :

- `users`
- `product_categories`
- `products`
- `product_images`
- `favorites`
- `sales`
- `sale_items`
- `stock_movements`
- `reviews`
- `site_settings`

Après une modification de `db/schema.ts` :

```bash
npm run db:generate
```

Inspecter toujours la migration SQL générée avant publication.

## Authentification

`app/chatgpt-auth.ts` utilise l’identité transmise par l’hébergement Sites. Les pages publiques restent accessibles sans connexion. L’espace cliente peut afficher l’utilisateur authentifié.

Le rôle administrateur n’est pas encore appliqué à toutes les routes de modification. Les futures actions serveur devront vérifier le rôle `ADMIN` sans se fier à l’interface cliente.

## Limites actuelles

- L’administration affiche des données de démonstration.
- Les modifications admin ne sont pas toutes persistées dans D1.
- Les favoris visiteurs sont enregistrés localement dans le navigateur.
- Les coordonnées WhatsApp et Snapchat sont encore des valeurs de démonstration.
- Aucun paiement en ligne n’est prévu.

## Déploiement

Le projet est lié à OpenAI Sites par `.openai/hosting.json`. Un déploiement doit être construit, enregistré comme version, puis publié avec le contrôle d’accès approprié.

Le site hébergé reste privé tant que son accès n’est pas ouvert ou que des personnes précises ne sont pas invitées.
