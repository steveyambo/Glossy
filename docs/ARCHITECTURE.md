# Architecture JAWNAH

## Vue d’ensemble

La version de référence est une application Vinext compatible Cloudflare Workers. Le rendu public est organisé autour de composants React, tandis que le modèle de données est décrit avec Drizzle ORM pour Cloudflare D1.

```text
Navigateur
   │
   ├── Pages publiques et catalogue
   ├── Favoris temporaires du visiteur
   └── Connexion gérée par Sites
           │
           ▼
Vinext / React Server Components
           │
           ├── Médias statiques dans public/
           └── D1 via le binding logique DB
```

## Flux de commande

1. La cliente consulte le catalogue ou une fiche produit.
2. Elle sélectionne un produit et une quantité.
3. Le site calcule un montant estimé.
4. Pour WhatsApp, le site génère un message prérempli et encodé.
5. Pour Snapchat, le site copie un résumé puis ouvre le profil de la marque.
6. La disponibilité, la livraison et le règlement sont confirmés hors du site.

Aucune donnée bancaire ne doit être demandée ou stockée.

## Catalogue

Les produits de démonstration sont définis dans `sites-app/app/data.ts`. Chaque entrée contient :

- identifiant ;
- nom et slug ;
- teinte et catégorie ;
- prix ;
- stock affiché ;
- badge ;
- image détourée ;
- résumé marketing ;
- couleur d’ambiance.

Les fiches produit sont générées à partir du slug dans `app/produits/[slug]/page.tsx`.

## Favoris

Les visiteurs non connectés utilisent actuellement `localStorage` avec la clé `jawna-favorites`. Cette donnée est locale à l’appareil et ne doit pas être considérée comme durable.

L’évolution prévue consiste à synchroniser les favoris avec la table `favorites` pour les clientes authentifiées, tout en conservant une fusion des favoris locaux lors de la première connexion.

## Authentification et autorisation

L’identité est lue depuis les en-têtes fournis par Sites. L’authentification indique qui est la personne ; elle ne suffit pas à lui donner des droits administrateur.

Pour chaque écriture admin :

1. récupérer l’utilisateur côté serveur ;
2. retrouver son enregistrement dans `users` ;
3. vérifier `role === "ADMIN"` ;
4. valider la requête ;
5. exécuter l’opération en base ;
6. retourner une réponse sans données sensibles.

## Stocks et ventes

Le modèle prévoit `sales`, `sale_items` et `stock_movements`.

Une vente confirmée devra :

1. vérifier le stock disponible ;
2. déduire les quantités ;
3. marquer la vente comme confirmée ;
4. créer un mouvement `OUT` ;
5. effectuer ces opérations de manière atomique.

Une annulation après déduction devra restaurer le stock une seule fois et créer un mouvement `RESTORE`.

## Frontière entre démonstration et production

| Domaine | Aujourd’hui | Cible production |
| --- | --- | --- |
| Catalogue | Données TypeScript | Produits D1 administrables |
| Favoris visiteur | Stockage navigateur | Fusion avec D1 après connexion |
| Tableau admin | Interface de démonstration | Routes serveur avec rôle `ADMIN` |
| Stocks | Valeurs de démonstration | Transactions et historique D1 |
| Ventes | Lignes fictives | Enregistrement manuel persistant |
| Paramètres sociaux | `app/data.ts` | Table `site_settings` ou variables d’hébergement |

## Ancienne implémentation

Les dossiers `frontend/` et `backend/` contiennent un prototype séparé : Next.js 14 côté client et ASP.NET Core/SQLite côté API. Il peut servir de référence pour les contrôleurs CRUD et l’authentification JWT, mais il n’alimente pas le site Sites actuellement publié.

Éviter de mélanger directement les deux modèles d’authentification. Toute migration doit choisir une source de vérité unique pour les utilisateurs et les rôles.
