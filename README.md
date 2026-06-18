# Restaurant Manager

Application de gestion de restaurant (authentification par code PIN, gestion des catégories et des plats, plan de salle, prise de commande et écran cuisine KDS), construite en ASP.NET Core (Clean Architecture, Dapper) côté backend et Angular standalone côté frontend.

## Prérequis

| Outil | Version requise | Version utilisée |
|-------|-----------------|------------------|
| .NET SDK | 8.0.x | 8.0.416 |
| Node.js | 20.x ou supérieur | 24.x |
| Angular CLI | 17.x ou supérieur (syntaxe `@if`/`@for`/`@switch`) | 21.x |
| MySQL | 8.x ou supérieur | 9.x |

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/hsx1111/RestaurantManager.git
   cd RestaurantManager
   ```

2. **Créer la base de données**
   Se connecter à MySQL en tant que `root` et exécuter le script. Il crée la base `Restaurant_manager`, les tables, le trigger anti-chevauchement des réservations **et** l'utilisateur applicatif `restaurant_app` (droits CRUD uniquement).
   ```bash
   mysql -u root -p < database/Creation_tables.sql
   ```

3. **Lancer le backend**
   ```bash
   cd backend
   dotnet restore
   dotnet run --project RestaurantManager.API
   ```
   L'API démarre sur **http://localhost:5080**. Au premier démarrage sur une base vide, le `DataSeeder` insère automatiquement les données de démonstration (utilisateurs, client, catégories, plats, tables).

4. **Lancer le frontend** (dans un autre terminal)
   ```bash
   cd frontend/restaurant-manager-frontend
   npm install
   ng serve
   ```
   Ouvrir **http://localhost:4200**.

## Comptes de démonstration

| Code PIN | Utilisateur | Rôle |
|----------|-------------|------|
| `1234` | Marie Dubois | Gestionnaire |
| `5678` | Jean Martin | Serveur |
| `9999` | Cuistot Cuisine | Cuisine |

## Architecture

Le backend suit une **Clean Architecture** en trois projets. La couche `API` expose les contrôleurs REST et dépend de `Core` et `Infrastructure`. La couche `Infrastructure` contient les implémentations Dapper des repositories et dépend de `Core`. La couche `Core` (entités, DTOs, interfaces, services métier, exceptions) ne dépend d'**aucune** autre couche : c'est le cœur indépendant de l'application. Les dépendances pointent donc toujours vers l'intérieur (vers `Core`).

```
            ┌──────────────────────────────┐
            │             API              │   Contrôleurs REST, auth cookie, CORS
            │     (ASP.NET Core Web API)   │
            └───────────┬───────────┬──────┘
                        │           │
                        ▼           ▼
        ┌────────────────────┐   ┌───────────────────────┐
        │   Infrastructure   │──▶│         Core          │
        │  Repositories      │   │  Entités, DTOs,       │
        │  Dapper + MySQL    │   │  interfaces, services │
        │  DataSeeder        │   │  exceptions           │
        └────────────────────┘   └───────────────────────┘
                 (Infrastructure → Core, Core ne dépend de rien)
```

## Stack utilisée

- **Backend** : .NET 8, ASP.NET Core (Web API), Dapper, MySQL, BCrypt.Net-Next (hachage des codes PIN), authentification par cookie.
- **Frontend** : Angular 17+ (composants standalone, nouvelle syntaxe de contrôle de flux `@if`/`@for`/`@switch`), TypeScript, gestion d'état par signals/services, CSS pur.

## Structure du projet

```
.
├── backend/
│   ├── RestaurantManager.API/             # Contrôleurs, Program.cs, appsettings
│   ├── RestaurantManager.Core/            # Entités, DTOs, interfaces, services, exceptions, enums
│   ├── RestaurantManager.Infrastructure/  # Repositories Dapper, DataSeeder
│   └── RestaurantManager.sln
├── database/
│   └── Creation_tables.sql                # Schéma + trigger + utilisateur applicatif
├── frontend/
│   └── restaurant-manager-frontend/
│       └── src/app/
│           ├── pages/        # login, categories, plats, plan-salle, commande, cuisine
│           ├── services/     # auth, categorie, plat, table, commande, cuisine, toast
│           ├── guards/       # auth.guard, role.guard
│           ├── layouts/      # app-layout
│           ├── components/   # confirm-dialog
│           └── models/
└── README.md
```
