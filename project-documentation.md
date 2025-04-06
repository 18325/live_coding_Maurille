# Documentation - Application de Notes Collaborative

## Architecture du projet

### Architecture générale
L'application suit une architecture client-serveur avec:
- **Frontend**: Application React en TypeScript utilisant Context API pour la gestion d'état
- **Backend**: API REST Node.js/Express avec MongoDB comme base de données
- **Communication en temps réel**: Via Socket.io pour les modifications collaboratives

### Structure des dossiers
Le projet est divisé en deux parties principales:

#### Backend
```
notes-app-backend/
├── src/
│   ├── config/         # Configuration (db, env)
│   ├── models/         # Modèles Mongoose
│   ├── routes/         # Routes API REST
│   ├── controllers/    # Logique métier
│   ├── socketHandlers/ # Gestionnaires temps réel
│   └── server.ts       # Point d'entrée
```

#### Frontend
```
notes-app/
├── src/
│   ├── components/     # Composants React
│   ├── context/        # Providers de contexte
│   ├── hooks/          # Hooks personnalisés
│   ├── services/       # Services (API, Socket)
│   ├── types/          # Définitions TypeScript
│   ├── App.tsx         # Composant racine
│   └── index.tsx       # Point d'entrée
```

## Fonctionnalités implémentées

### 1. Authentification simplifiée
- Login avec nom d'utilisateur uniquement
- Persistance de session via localStorage
- Création automatique de compte lors du premier login

### 2. Gestion des notes
- Création, lecture, mise à jour et suppression de notes
- Support pour titre, contenu et tags
- Formatage basique (gras, italique, listes)

### 3. Collaboration en temps réel
- Édition collaborative via Socket.io
- Visibilité des utilisateurs éditant la même note
- Mise à jour en temps réel du contenu

### 4. Organisation et recherche
- Filtrage par tags
- Recherche textuelle dans titres et contenus
- Tri par date de création/modification

## Architecture technique

### Backend

#### Modèles de données
- **User**: Stocke les informations d'utilisateur (username)
- **Note**: Stocke les informations de note (titre, contenu, tags, créateur, éditeurs)

#### API REST
- Routes `/api/users` pour la gestion des utilisateurs
- Routes `/api/notes` pour la gestion des notes
- Contrôleurs séparés pour une meilleure organisation

#### Socket.io
- Gestion des connexions/déconnexions
- Suivi des utilisateurs actifs
- Suivi des notes en cours d'édition
- Diffusion des modifications en temps réel

### Frontend

#### Gestion d'état
- Context API pour la gestion globale de l'état:
  - `AuthContext`: Gestion de l'authentification
  - `NotesContext`: Gestion des notes et de l'édition

#### Communication
- Appels API REST via Axios pour les opérations CRUD
- Socket.io-client pour la communication en temps réel

#### Interface utilisateur
- Design responsive avec Tailwind CSS
- Composants modulaires réutilisables
- Gestion d'états de charg