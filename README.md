# Glossy

Glossy est une application vitrine pour une marque de gloss, avec une API .NET et une interface Next.js. Le projet inclut une boutique publique, une authentification JWT, un espace client, une gestion des favoris et une interface admin pour gerer les produits.

## Stack

- **Backend** : .NET 10, ASP.NET Core Web API, Entity Framework Core, SQLite, JWT
- **Frontend** : Next.js 14, React 18, TypeScript, Tailwind CSS
- **Base de donnees** : SQLite locale creee automatiquement au premier lancement

## Fonctionnalites

- Page d'accueil publique
- Catalogue de produits consultable sans compte
- Inscription et connexion par email / mot de passe
- Roles `Client` et `Admin`
- Favoris utilisateur
- Profil utilisateur editable
- Back-office admin pour creer, modifier et supprimer les produits
- Donnees de demonstration au premier lancement

## Structure

```text
gloss-app/
|-- backend/
|   `-- GlossApi/          # API ASP.NET Core
|-- frontend/              # Application Next.js
|-- .gitignore
`-- README.md
```

## Prerequis

- .NET 10 SDK
- Node.js 18 ou plus
- npm

## Demarrage rapide

### 1. Backend

```bash
cd backend/GlossApi
dotnet restore
dotnet run
```

L'API demarre par defaut sur :

```text
http://localhost:5199
```

Swagger est disponible sur :

```text
http://localhost:5199/swagger
```

La base SQLite `gloss.db` est creee automatiquement dans le dossier du backend.

### 2. Frontend

Dans un second terminal :

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Le site demarre sur :

```text
http://localhost:3000
```

## Configuration

### Frontend

Le fichier `frontend/.env.local.example` contient :

```env
NEXT_PUBLIC_API_URL=http://localhost:5199
```

Copie-le en `.env.local` pour le developpement local.

### Backend

La configuration principale se trouve dans `backend/GlossApi/appsettings.json`.

Points importants :

- `ConnectionStrings:Default` pointe vers SQLite (`gloss.db`)
- `Jwt:Key` sert a signer les tokens
- `Cors:AllowedOrigin` doit pointer vers l'URL du frontend

Avant un deploiement reel, remplace la cle JWT de demonstration par une valeur secrete et robuste.

## Compte admin de demonstration

```text
Email: admin@lueur.fr
Mot de passe: Admin123!
```

## Scripts utiles

Backend :

```bash
dotnet restore
dotnet build
dotnet run
```

Frontend :

```bash
npm install
npm run dev
npm run build
npm run start
```

## Notes de developpement

- Les dossiers `node_modules`, `.next`, `bin`, `obj` et la base locale `gloss.db` ne sont pas versionnes.
- Le token JWT est stocke cote client dans `localStorage`. Pour une mise en production, un cookie `httpOnly` serait plus robuste.
- Le build Next.js utilise des polices Google via `next/font`; une connexion internet peut etre necessaire au premier build.
- SQLite convient pour la demo et le developpement local. Pour la production, prevoir PostgreSQL, SQL Server ou une autre base geree.

## Prochaines ameliorations possibles

- Refresh tokens
- Pagination et filtres du catalogue
- Upload de photos produit
- Tableau de bord admin plus complet
- Tests backend avec xUnit
- Tests end-to-end avec Playwright
