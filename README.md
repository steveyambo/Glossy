# JAWNAH / Glossy

Site e-commerce premium pour la marque de gloss **JAWNAH**. L’expérience met en avant la collection, les fiches produit, les favoris et les demandes de commande via WhatsApp ou Snapchat. Aucun paiement par carte n’est intégré.

La version actuellement publiée se trouve dans [`sites-app/`](./sites-app). Elle est hébergée en accès privé avec OpenAI Sites :

**https://jawna-gloss-bf.yambosteve.chatgpt.site**

## Contenu du dépôt

Le dépôt conserve deux implémentations complémentaires :

| Dossier | Rôle | État |
| --- | --- | --- |
| [`sites-app/`](./sites-app) | Expérience JAWNAH premium utilisée par le site publié | Version de référence |
| [`frontend/`](./frontend) | Prototype Next.js 14 consommant l’API .NET | Prototype historique |
| [`backend/GlossApi/`](./backend/GlossApi) | API ASP.NET Core, JWT, SQLite, produits et favoris | Prototype historique |
| [`docs/`](./docs) | Architecture, exploitation et limites connues | Documentation |

## Fonctionnalités de la version de référence

- Accueil immersif et responsive
- Catalogue filtrable et recherche par teinte
- Fiches produit avec disponibilité et favoris
- Demande de commande via WhatsApp ou Snapchat
- Vidéo promotionnelle et comparaison avant/après
- Espace cliente avec connexion gérée par la plateforme
- Tableau de bord administrateur de démonstration
- Schéma D1/Drizzle pour les utilisateurs, produits, ventes, stocks, favoris et avis
- Images produit détourées et carte Open Graph
- Accessibilité clavier, adaptation mobile et réduction des animations

## Démarrage rapide

### Prérequis

- Node.js `>= 22.13.0`
- npm

### Lancer la version JAWNAH actuelle

```bash
cd sites-app
npm ci
npm run dev
```

Puis ouvrir l’adresse locale affichée par le serveur.

### Vérifier le projet

```bash
cd sites-app
npm test
```

La commande construit le site et vérifie le rendu de la boutique et du tableau de bord.

## Configuration métier

Les données de démonstration et les coordonnées sociales se trouvent dans :

```text
sites-app/app/data.ts
```

Avant une utilisation réelle, remplacer notamment :

- le numéro WhatsApp de démonstration ;
- le nom d’utilisateur Snapchat ;
- le compte Instagram ;
- la zone de livraison ;
- les prix et stocks initiaux.

Les médias utilisés par le site se trouvent dans `sites-app/public/`.

## Pages principales

```text
/
/produits
/produits/[slug]
/favoris
/connexion
/inscription
/compte
/contact
/admin
/admin/produits
/admin/stocks
/admin/ventes
/admin/clientes
/admin/avis
/admin/parametres
```

## État de l’administration

L’interface `/admin` présente les écrans, indicateurs et interactions attendus, mais certaines actions utilisent encore des données de démonstration côté navigateur. Le schéma de base de données est prêt dans `sites-app/db/schema.ts`, mais les formulaires admin doivent encore être reliés à des routes serveur protégées avant une utilisation commerciale.

Ne pas considérer le back-office actuel comme une source de vérité pour les stocks ou les ventes.

## Commandes et paiement

Le parcours ne contient ni Stripe, ni PayPal, ni paiement par carte. La cliente choisit le produit et la quantité, puis finalise sa demande directement avec JAWNAH sur WhatsApp ou Snapchat.

## Documentation complémentaire

- [Architecture et flux fonctionnels](./docs/ARCHITECTURE.md)
- [Guide de la version Sites](./sites-app/README.md)
- [API historique ASP.NET Core](./backend/GlossApi)

## Sécurité avant mise en production

- Protéger toutes les écritures admin côté serveur.
- Configurer explicitement les comptes autorisés à administrer le site.
- Stocker les secrets et coordonnées sensibles dans les paramètres d’hébergement.
- Relier les ventes et mouvements de stock dans une transaction cohérente.
- Valider les entrées côté serveur et ajouter une journalisation d’audit.
- Ne jamais committer de mot de passe, clé JWT ou jeton d’accès réel.

## Licence

Projet propriétaire JAWNAH. Aucune licence de réutilisation publique n’est accordée par défaut.
