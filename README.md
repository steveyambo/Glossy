# LUEUR - Site vitrine gloss avec authentification

Projet complet : backend **.NET 10** (API JWT, roles Client/Admin) + frontend **Next.js 14** (App Router, Tailwind).

## Structure

```text
gloss-app/
|-- backend/GlossApi/     # API .NET (auth, produits, favoris)
`-- frontend/             # Site Next.js
```

## Fonctionnalites

- **Vitrine publique** : page d'accueil + collection de gloss, consultables sans compte
- **Authentification** : inscription / connexion par email + mot de passe, JWT
- **Roles** : `Client` (par defaut a l'inscription) et `Admin`
- **Espace membre** : favoris (ajouter/retirer un produit), profil editable
- **Espace admin** : creation, modification, suppression des produits (`/admin/products`)
- Base de donnees SQLite auto-creee et pre-remplie au premier lancement (6 produits + 1 compte admin)

## 1. Lancer le backend

Prerequis : .NET 10 SDK

```bash
cd backend/GlossApi
dotnet restore
dotnet run
```

L'API demarre sur `http://localhost:5199` (Swagger disponible sur `/swagger`).
La base `gloss.db` (SQLite) et les donnees de demo sont creees automatiquement.

**Compte admin de demonstration :** `admin@lueur.fr` / `Admin123!`

Avant un deploiement reel : change la cle `Jwt:Key` dans `appsettings.json` (elle sert a signer les tokens) et remplace SQLite par une base plus robuste si besoin (PostgreSQL, SQL Server...).

## 2. Lancer le frontend

Prerequis : Node.js 18+

```bash
cd frontend
npm install
cp .env.local.example .env.local   # verifie que l'URL pointe vers ton backend
npm run dev
```

Le site est disponible sur `http://localhost:3000`.

## Notes techniques

- Le token JWT est stocke cote client dans `localStorage` (`contexts/AuthContext.tsx`). Pour une mise en production, envisage un cookie `httpOnly` pose par le backend plutot que du `localStorage`, plus robuste contre le XSS.
- Les visuels produits sont des illustrations SVG generees (pas de photographie), pour rester 100% autonome sans dependance a des images externes.
- `npm audit` peut signaler des vulnerabilites connues sur Next.js 14.x. Pour un projet de demonstration/apprentissage ce n'est pas bloquant ; pour de la production, prevois une mise a niveau ou surveille les correctifs de la branche 14.2.x.
- La compilation Next.js telecharge les polices Google Fonts (Fraunces, Manrope) au moment du build ; une connexion internet est necessaire lors du premier `npm run build` / `npm run dev`.

## Etapes suivantes possibles

- Rafraichissement de token (refresh token) pour eviter la deconnexion apres expiration du JWT
- Pagination / filtres sur la collection
- Upload de vraies photos produit (actuellement remplacees par des illustrations)
- Tests automatises (xUnit cote API, Playwright cote front)
