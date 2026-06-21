# Restaurant Manager

Application de gestion de restaurant couvrant **9 fonctionnalités** : authentification par code PIN, gestion des catégories, des plats (avec jointure catégorie), des tables et du personnel, plan de salle, prise de commande, modification de commande et clôture/facturation d'une table, écran cuisine (KDS) et gestion des réservations. Construite en ASP.NET Core (Clean Architecture, Dapper) côté backend et Angular standalone côté frontend.

## Fonctionnalités

1. **Authentification par PIN** (cookie de session, rôles Serveur / Gestionnaire / Cuisine).
2. **Catégories** — CRUD complet (gestionnaire).
3. **Plats** — CRUD avec jointure catégorie, recherche et filtre (gestionnaire).
4. **Plan de salle & prise de commande** — transaction Dapper, prix unitaires archivés (serveur).
5. **Modification de commande & clôture** — ajout de plats à une commande en cours, facturation et libération de la table.
6. **Écran cuisine (KDS)** — polling toutes les 5 s, chronomètre, validation des plats préparés.
7. **Personnel** — CRUD des utilisateurs, PIN haché BCrypt (gestionnaire).
8. **Tables** — CRUD avec règle métier (suppression interdite si table occupée).
9. **Réservations** — CRUD mettant en valeur le trigger MySQL anti-chevauchement.

## Prérequis

| Outil | Version requise | Version utilisée |
|-------|-----------------|------------------|
| .NET SDK | 8.0.x | 8.0.416 |
| Node.js | 20.x ou supérieur | 24.x |
| Angular CLI | 17.x ou supérieur — *optionnel, requis seulement pour `ng serve`* | 21.x |
| MySQL | 8.x ou supérieur | 9.x |

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/hsx1111/RestaurantManager.git
   cd RestaurantManager
   ```

2. **Créer la base de données**
   Cette étape doit être exécutée avec un **compte administrateur MySQL** (`root` ou équivalent) : le script effectue des opérations d'administration (création de base, de tables et d'un utilisateur, attribution de droits). Il crée la base `Restaurant_manager`, les tables, le trigger anti-chevauchement des réservations **et** l'utilisateur applicatif `restaurant_app` (droits CRUD uniquement). L'application, elle, se connectera ensuite avec ce compte limité — jamais en root.
   Sous **macOS / Linux** (ou l'invite de commandes `cmd` de Windows) :
   ```bash
   mysql -u root -p < database/Creation_tables.sql
   ```
   Sous **Windows / PowerShell**, l'opérateur `<` n'est pas supporté : utilisez plutôt un pipe (adaptez le chemin de `mysql.exe` à votre version) :
   ```powershell
   Get-Content database\Creation_tables.sql | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
   ```
   *(Si votre compte `root` MySQL n'a pas de mot de passe, retirez l'option `-p`.)*

3. **Lancer le backend**
   ```bash
   cd backend
   dotnet restore
   dotnet run --project RestaurantManager.API
   ```
   L'API démarre sur **http://localhost:5080**. Au premier démarrage sur une base vide, le `DataSeeder` insère automatiquement les données de démonstration (utilisateurs, clients, catégories, plats, tables).

4. **Lancer le frontend** (dans un autre terminal)
   ```bash
   cd frontend/restaurant-manager-frontend
   npm install
   ```
   Puis démarrer le serveur de développement, au choix :
   ```bash
   npm start      # ne requiert aucune installation globale (utilise le CLI Angular local)
   ```
   ```bash
   ng serve       # alternative si le CLI Angular est installé globalement (npm install -g @angular/cli)
   ```
   Les deux commandes sont équivalentes : `npm start` exécute le script `start` du `package.json`, qui lance `ng serve` via le CLI Angular **installé localement** par `npm install` — aucune installation globale n'est donc nécessaire. `ng serve` fait exactement la même chose mais suppose le CLI Angular **installé globalement** (`npm install -g @angular/cli`). En cas de doute, privilégiez `npm start`. Ouvrir ensuite **http://localhost:4200**.

## Comptes de démonstration

| Code PIN | Utilisateur | Rôle |
|----------|-------------|------|
| `1234` | Marie Dubois | Gestionnaire |
| `5678` | Jean Martin | Serveur |
| `9999` | Cuistot Cuisine | Cuisine |

## Architecture

Le backend suit une **Clean Architecture** en trois projets, avec les dépendances toujours dirigées vers l'intérieur (vers `Core`) :

- **`RestaurantManager.API`** — contrôleurs REST « minces », authentification par cookie, CORS, et un **`GlobalExceptionHandlerMiddleware`** qui traduit de façon centralisée les exceptions métier en codes HTTP (401 / 404 / 409 / 400 / 500).
- **`RestaurantManager.Core`** — le cœur indépendant : `Models` (entités), `DTOs`, `Enums`, `Exceptions`, contrats de repositories (`Interfaces`) et la **logique métier dans `UseCases`** (interfaces dans `UseCases/Abstractions`). Les contrôleurs ne dépendent que des UseCases ; les UseCases appellent les repositories.
- **`RestaurantManager.Infrastructure`** — implémentations Dapper des repositories (transactions, multi-mapping `splitOn`) et `DataSeeder`.

Chaque couche expose une méthode d'extension `ServiceCollectionExtension` (`AddCoreServices()` / `AddInfrastructureServices()`) appelée depuis `Program.cs` pour l'injection de dépendances.

```
            ┌───────────────────────────────────────┐
            │                  API                   │  Contrôleurs REST, cookie auth,
            │   (ASP.NET Core + Middleware global)   │  CORS, mapping exceptions → HTTP
            └─────────────┬─────────────┬────────────┘
                          │             │
                          ▼             ▼
        ┌────────────────────────┐   ┌──────────────────────────────┐
        │     Infrastructure     │──▶│             Core             │
        │  Repositories Dapper   │   │  Models, DTOs, Enums,        │
        │  (transactions, JOIN)  │   │  Interfaces, Exceptions,     │
        │  DataSeeder            │   │  UseCases (logique métier)   │
        └────────────────────────┘   └──────────────────────────────┘
              (Infrastructure → Core, Core ne dépend de rien)
```

## Stack utilisée

- **Backend** : .NET 8, ASP.NET Core (Web API), Dapper, MySQL, BCrypt.Net-Next (hachage des codes PIN), authentification par cookie de session.
- **Frontend** : Angular 17+ (composants standalone, nouvelle syntaxe de contrôle de flux `@if`/`@for`/`@switch`), TypeScript, gestion d'état par signals/services, Reactive Forms, guards fonctionnels, CSS pur.

## Structure du projet

```
.
├── backend/
│   ├── RestaurantManager.API/
│   │   ├── Controllers/                # Auth, Categorie, Plat, Table, Commande,
│   │   │                               # Cuisine, Utilisateur, Client, Reservation, Health
│   │   ├── Middleware/                 # GlobalExceptionHandlerMiddleware
│   │   └── Program.cs
│   ├── RestaurantManager.Core/
│   │   ├── Models/                     # Entités POCO
│   │   ├── DTOs/                       # DTOs écrits à la main
│   │   ├── Enums/
│   │   ├── Exceptions/                 # Exceptions métier
│   │   ├── Interfaces/                 # Contrats de repositories
│   │   ├── UseCases/                   # Logique métier (+ Abstractions/)
│   │   └── ServiceCollectionExtension.cs
│   ├── RestaurantManager.Infrastructure/
│   │   ├── Repositories/               # Implémentations Dapper
│   │   ├── DataSeeder.cs
│   │   └── ServiceCollectionExtension.cs
│   └── RestaurantManager.sln
├── database/
│   └── Creation_tables.sql            # Schéma + trigger + utilisateur applicatif
├── frontend/
│   └── restaurant-manager-frontend/
│       └── src/app/
│           ├── pages/        # login, categories, plats, tables, personnel,
│           │                 # plan-salle, commande, table-detail, reservations, cuisine
│           ├── services/     # auth, categorie, plat, table, utilisateur,
│           │                 # commande, cuisine, client, reservation, toast
│           ├── guards/       # auth.guard, role.guard
│           ├── layouts/      # app-layout (barre latérale)
│           ├── components/   # confirm-dialog, menu-panier
│           └── models/
└── README.md
```
