# Glossy

Glossy est une application e-commerce de demonstration pour une marque de gloss. Elle combine une API ASP.NET Core et une interface Next.js pour proposer un catalogue public, une authentification, des favoris, un profil client et un espace admin.

Ce README sert de guide de reprise projet : il explique comment lancer l'application, comment elle est organisee, comment les principales fonctionnalites circulent entre le frontend et le backend, et quelles sont les prochaines implementations recommandees.

## Sommaire

- [Vue d'ensemble](#vue-densemble)
- [Stack technique](#stack-technique)
- [Fonctionnalites actuelles](#fonctionnalites-actuelles)
- [Structure du projet](#structure-du-projet)
- [Installation et lancement](#installation-et-lancement)
- [Configuration](#configuration)
- [Comptes de demonstration](#comptes-de-demonstration)
- [Architecture fonctionnelle](#architecture-fonctionnelle)
- [Endpoints API](#endpoints-api)
- [Guide pour les prochaines implementations](#guide-pour-les-prochaines-implementations)
- [Qualite, securite et production](#qualite-securite-et-production)
- [Roadmap conseillee](#roadmap-conseillee)

## Vue d'ensemble

L'application est decoupee en deux parties :

- Le **backend** expose une API REST securisee par JWT.
- Le **frontend** consomme cette API et affiche l'experience utilisateur.

En local, le frontend tourne sur `http://localhost:3000` et communique avec l'API sur `http://localhost:5199`.

```text
Navigateur
   |
   |  Next.js pages / components
   v
Frontend: http://localhost:3000
   |
   |  fetch via frontend/lib/api.ts
   v
Backend: http://localhost:5199
   |
   |  Entity Framework Core
   v
SQLite: gloss.db
```

## Stack technique

### Backend

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- JWT Bearer authentication
- Swagger pour tester l'API

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- App Router

## Fonctionnalites actuelles

- Page d'accueil publique
- Catalogue de produits
- Detail d'un produit
- Inscription utilisateur
- Connexion utilisateur
- Authentification par token JWT
- Roles `Client` et `Admin`
- Profil utilisateur
- Ajout et retrait de favoris
- Back-office admin pour creer, modifier et supprimer des produits
- Donnees de demonstration creees automatiquement au premier lancement

## Structure du projet

```text
gloss-app/
|-- backend/
|   `-- GlossApi/
|       |-- Controllers/       # Routes API
|       |-- Data/              # DbContext + seed de donnees
|       |-- DTOs/              # Objets d'entree/sortie de l'API
|       |-- Models/            # Entites EF Core
|       |-- Services/          # Auth, mot de passe, JWT
|       |-- Program.cs         # Configuration globale de l'API
|       |-- appsettings.json   # Configuration locale
|       `-- GlossApi.csproj
|
|-- frontend/
|   |-- app/                   # Pages Next.js
|   |-- components/            # Composants reutilisables
|   |-- contexts/              # AuthContext
|   |-- lib/                   # Client API + types TypeScript
|   |-- package.json
|   `-- .env.local.example
|
|-- .gitignore
`-- README.md
```

## Installation et lancement

### Prerequis

- .NET 10 SDK
- Node.js 18 ou plus
- npm
- Git

### 1. Lancer le backend

Depuis la racine du projet :

```bash
cd backend/GlossApi
dotnet restore
dotnet run
```

L'API demarre sur :

```text
http://localhost:5199
```

Swagger est disponible ici :

```text
http://localhost:5199/swagger
```

Au premier lancement, l'application cree automatiquement :

- la base SQLite `gloss.db`
- un compte admin de demonstration
- une collection initiale de produits

### 2. Lancer le frontend

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

Sur Windows PowerShell, si `cp` ne fonctionne pas, utiliser :

```powershell
Copy-Item .env.local.example .env.local
```

## Configuration

### Frontend

Le fichier `frontend/.env.local.example` contient :

```env
NEXT_PUBLIC_API_URL=http://localhost:5199
```

Cette variable indique au frontend ou trouver l'API.

Pour le developpement local :

```bash
cd frontend
cp .env.local.example .env.local
```

### Backend

La configuration backend se trouve dans :

```text
backend/GlossApi/appsettings.json
```

Parametres importants :

- `ConnectionStrings:Default` : chemin de la base SQLite
- `Jwt:Issuer` : emetteur du token
- `Jwt:Audience` : client attendu pour le token
- `Jwt:Key` : cle secrete de signature
- `Jwt:ExpiryMinutes` : duree de validite du token
- `Cors:AllowedOrigin` : URL du frontend autorisee

Pour la production, ne pas garder la cle JWT actuelle. Elle est seulement la pour le developpement.

## Comptes de demonstration

Compte admin cree automatiquement :

```text
Email: admin@lueur.fr
Mot de passe: Admin123!
Role: Admin
```

Les comptes crees via l'inscription ont le role :

```text
Client
```

## Architecture fonctionnelle

### Authentification

1. L'utilisateur s'inscrit ou se connecte depuis le frontend.
2. Le frontend appelle `/api/auth/register` ou `/api/auth/login`.
3. Le backend verifie les informations et genere un token JWT.
4. Le frontend stocke le token dans `localStorage`.
5. Les requetes protegees ajoutent ce token dans le header `Authorization`.

Fichiers principaux :

- `frontend/contexts/AuthContext.tsx`
- `frontend/lib/api.ts`
- `backend/GlossApi/Controllers/AuthController.cs`
- `backend/GlossApi/Services/TokenService.cs`
- `backend/GlossApi/Services/PasswordService.cs`

### Produits

Les produits sont stockes dans SQLite via Entity Framework Core. Le catalogue est public, mais la creation, la modification et la suppression sont reservees aux admins.

Fichiers principaux :

- `backend/GlossApi/Models/Product.cs`
- `backend/GlossApi/DTOs/ProductDtos.cs`
- `backend/GlossApi/Controllers/ProductsController.cs`
- `frontend/app/products/page.tsx`
- `frontend/app/products/[id]/page.tsx`
- `frontend/app/admin/products/page.tsx`

### Favoris

Les favoris sont lies a l'utilisateur connecte. Un produit peut etre ajoute ou retire des favoris uniquement si un token valide est fourni.

Fichiers principaux :

- `backend/GlossApi/Models/Favorite.cs`
- `backend/GlossApi/Controllers/FavoritesController.cs`
- `frontend/app/favorites/page.tsx`
- `frontend/components/ProductCard.tsx`

### Profil utilisateur

Le profil permet de recuperer l'utilisateur courant et de modifier son nom d'affichage.

Fichiers principaux :

- `backend/GlossApi/Controllers/UsersController.cs`
- `frontend/app/profile/page.tsx`
- `frontend/contexts/AuthContext.tsx`

## Endpoints API

### Auth

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Creer un compte client |
| `POST` | `/api/auth/login` | Public | Connecter un utilisateur |

### Produits

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Public | Lister les produits |
| `GET` | `/api/products/{id}` | Public | Recuperer un produit |
| `POST` | `/api/products` | Admin | Creer un produit |
| `PUT` | `/api/products/{id}` | Admin | Modifier un produit |
| `DELETE` | `/api/products/{id}` | Admin | Supprimer un produit |

### Favoris

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| `GET` | `/api/favorites` | Connecte | Lister mes favoris |
| `POST` | `/api/favorites/{productId}` | Connecte | Ajouter un favori |
| `DELETE` | `/api/favorites/{productId}` | Connecte | Retirer un favori |

### Utilisateur

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| `GET` | `/api/users/me` | Connecte | Recuperer mon profil |
| `PUT` | `/api/users/me` | Connecte | Modifier mon profil |

## Guide pour les prochaines implementations

Cette section explique comment continuer le projet sans casser l'architecture existante.

### Ajouter un champ a un produit

Exemple : ajouter `Brand`, `ImageUrl` ou `Category`.

1. Ajouter la propriete dans `backend/GlossApi/Models/Product.cs`.
2. Ajouter la meme information dans `backend/GlossApi/DTOs/ProductDtos.cs`.
3. Mettre a jour le mapping dans `ProductsController.cs`.
4. Mettre a jour les donnees de demo dans `SeedData.cs`.
5. Ajouter le champ cote frontend dans `frontend/lib/types.ts`.
6. Afficher ou modifier le champ dans les pages concernees.

Fichiers a verifier ensuite :

- `frontend/components/ProductCard.tsx`
- `frontend/app/products/[id]/page.tsx`
- `frontend/app/admin/products/page.tsx`

### Ajouter une nouvelle page frontend

Exemple : page `about`, page `contact` ou page `orders`.

1. Creer un dossier dans `frontend/app/`.
2. Ajouter un fichier `page.tsx`.
3. Si la page doit etre accessible depuis le menu, modifier `frontend/components/Navbar.tsx`.
4. Si la page consomme l'API, utiliser `frontend/lib/api.ts`.
5. Si la page depend de l'utilisateur connecte, utiliser `useAuth()` depuis `AuthContext`.

Exemple de structure :

```text
frontend/app/contact/page.tsx
```

### Ajouter une route API

Exemple : ajouter des commandes, des avis clients ou un panier.

1. Creer un modele dans `backend/GlossApi/Models/`.
2. Ajouter un `DbSet` dans `GlossDbContext.cs`.
3. Ajouter les DTOs dans `backend/GlossApi/DTOs/`.
4. Creer un controller dans `backend/GlossApi/Controllers/`.
5. Proteger la route avec `[Authorize]` si elle demande une connexion.
6. Proteger avec `[Authorize(Roles = Roles.Admin)]` si elle doit etre reservee aux admins.
7. Ajouter les appels cote frontend dans les pages ou composants concernes.

### Ajouter une fonctionnalite admin

Pour une fonctionnalite reservee aux admins :

1. Verifier le role cote backend avec `[Authorize(Roles = Roles.Admin)]`.
2. Ne jamais faire confiance uniquement au frontend pour la securite.
3. Cote frontend, masquer l'interface admin si `user.role !== 'Admin'`.
4. Tester l'action avec un compte admin et avec un compte client.

### Ajouter un upload d'image produit

Implementation conseillee :

1. Ajouter un champ `ImageUrl` au modele `Product`.
2. Commencer simple avec une URL saisie dans le formulaire admin.
3. Ensuite seulement, ajouter un vrai upload fichier.
4. Pour la production, stocker les images dans un service dedie comme Azure Blob Storage, S3, Cloudinary ou equivalent.

Eviter de stocker les fichiers uploades directement dans Git.

### Ajouter des tests

Priorite conseillee :

1. Tests unitaires backend pour les services (`PasswordService`, `TokenService`).
2. Tests d'integration API pour auth, produits et favoris.
3. Tests frontend sur les composants critiques.
4. Tests end-to-end avec Playwright pour les parcours utilisateur.

Parcours e2e prioritaires :

- inscription
- connexion
- consultation du catalogue
- ajout aux favoris
- modification du profil
- creation d'un produit admin

## Qualite, securite et production

### Points a ameliorer avant production

- Remplacer la cle JWT de demonstration.
- Deplacer les secrets dans des variables d'environnement.
- Remplacer SQLite par une base geree si le trafic augmente.
- Ajouter une vraie gestion de refresh token.
- Eviter `localStorage` pour le JWT en production et preferer un cookie `httpOnly`.
- Ajouter une validation plus stricte des DTOs.
- Ajouter des tests automatises.
- Ajouter une gestion centralisee des erreurs.
- Ajouter des logs applicatifs exploitables.

### Dossiers ignores par Git

Les elements suivants ne doivent pas etre versionnes :

- `node_modules/`
- `.next/`
- `bin/`
- `obj/`
- `.env.local`
- `gloss.db`
- fichiers de logs

Ils sont deja couverts par `.gitignore`.

## Roadmap conseillee

### Court terme

- Corriger les textes ou accents mal encodes dans les donnees de demo.
- Ajouter des filtres simples sur le catalogue.
- Ajouter une recherche produit.
- Ajouter un champ image ou imageUrl aux produits.
- Ameliorer les messages d'erreur cote frontend.

### Moyen terme

- Ajouter un panier.
- Ajouter une page commande.
- Ajouter un historique des commandes.
- Ajouter une gestion de stock plus precise.
- Ajouter des tests d'integration API.

### Long terme

- Ajouter un vrai systeme de paiement.
- Ajouter une gestion des livraisons.
- Ajouter un tableau de bord admin.
- Ajouter des statistiques de vente.
- Deployer le frontend et le backend sur des services cloud.

## Commandes utiles

Backend :

```bash
cd backend/GlossApi
dotnet restore
dotnet build
dotnet run
```

Frontend :

```bash
cd frontend
npm install
npm run dev
npm run build
npm run start
```

Git :

```bash
git status
git add .
git commit -m "Description courte"
git push
```

## Resolution de problemes courants

### Le frontend ne trouve pas l'API

Verifier que :

- le backend tourne bien sur `http://localhost:5199`
- `frontend/.env.local` existe
- `NEXT_PUBLIC_API_URL=http://localhost:5199`
- le frontend a ete redemarre apres modification du fichier `.env.local`

### Erreur CORS

Verifier dans `backend/GlossApi/appsettings.json` :

```json
"Cors": {
  "AllowedOrigin": "http://localhost:3000"
}
```

### La base de donnees contient de mauvaises donnees

En developpement, il est possible de supprimer `backend/GlossApi/gloss.db`, puis de relancer le backend. La base sera recreee avec les donnees de demo.

### Une route protegee renvoie 401

Verifier que :

- l'utilisateur est connecte
- le token est present dans `localStorage`
- la requete envoie le header `Authorization: Bearer <token>`
- le token n'a pas expire

### Une route admin renvoie 403

Le compte connecte n'a probablement pas le role `Admin`. Utiliser le compte admin de demonstration ou modifier le role en base pendant le developpement.
