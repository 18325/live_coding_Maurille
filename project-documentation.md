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
- Gestion d'états de chargement et d'erreurs

## Configuration et Installation

### Variables d'environnement

#### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://notesapp_user:NoteApp123@notesapp.u9apgmv.mongodb.net/notesapp?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
```

**Points importants:**
- Le backend tourne sur le port **5000** (pas 3000)
- MongoDB Atlas est configuré avec le cluster `notesapp.u9apgmv.mongodb.net`
- CORS accepte les connexions depuis les ports 3000 et 3001

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Points importants:**
- L'API URL pointe vers le port **5000** du backend
- Socket.io se connecte également au port 5000

### Installation

#### Backend
```bash
cd notes-app-backend
npm install
npm run dev
```

#### Frontend
```bash
cd notes-app
npm install
npm start
```

### Scripts PowerShell (Démarrage rapide)

Deux scripts PowerShell sont disponibles à la racine du projet:

- `start-backend.ps1`: Lance le serveur backend
- `start-frontend.ps1`: Lance l'application frontend

## Design System

### Principes de design

L'application suit une philosophie de **design minimaliste équilibré** qui combine:
- Propreté et professionnalisme
- Visibilité des informations importantes
- Expérience utilisateur fluide
- Touches visuelles modernes

### Palette de couleurs

**Couleurs principales:**
- `gray-900` (#111827): Texte principal, boutons primaires, éléments actifs
- `gray-700` (#374151): Texte secondaire
- `gray-600` (#4B5563): Texte tertiaire
- `gray-300` (#D1D5DB): Bordures
- `gray-200` (#E5E7EB): Bordures légères
- `gray-100` (#F3F4F6): Backgrounds secondaires
- `gray-50` (#F9FAFB): Backgrounds clairs
- `white` (#FFFFFF): Background principal

**Couleurs d'accent:**
- `green-500` (#10B981): Indicateur de collaboration en temps réel
- `green-700` (#047857): Texte d'état actif
- `green-50` (#ECFDF5): Background d'état actif

**Couleurs de feedback:**
- `red-700` (#B91C1C): Erreurs (texte)
- `red-50` (#FEF2F2): Erreurs (background)

### Composants UI

#### Boutons

**Bouton primaire:**
```tsx
className="px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
```

**Bouton secondaire:**
```tsx
className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
```

#### Inputs

**Input standard:**
```tsx
className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
```

#### Cards

**Note card:**
```tsx
className="p-4 mb-3 rounded-lg cursor-pointer border transition-all"
// Active state:
className="border-gray-900 bg-gray-50 shadow-md"
// Hover state:
className="border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
```

#### Badges

**Badge utilisateur:**
```tsx
className="px-4 py-2 bg-gray-100 rounded-lg"
```

**Badge date:**
```tsx
// Active
className="text-xs px-2 py-1 rounded bg-gray-900 text-white"
// Inactive
className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600"
```

**Badge tag:**
```tsx
className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm"
```

**Badge collaboration:**
```tsx
className="flex items-center px-4 py-3 bg-green-50 border border-green-200 rounded-lg"
```

### Structure des pages

#### Page de Login

**Caractéristiques:**
- Background: Gradient subtil `from-gray-50 to-gray-100`
- Carte centrale avec `rounded-2xl`, `shadow-lg`, bordure
- Logo: Icône de note dans un carré noir arrondi (16×16)
- Titre: "Welcome to Notes" en `text-3xl font-bold`
- Input avec label visible
- Bouton "Get Started" avec shadow

#### Header

**Structure:**
- Logo (icône + texte "Notes") à gauche
- Username dans un badge gris arrondi
- Bouton Logout noir avec coins arrondis

**Code:**
```tsx
<div className="flex items-center space-x-3">
  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
    {/* SVG Icon */}
  </div>
  <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
</div>
```

#### Sidebar (NotesList)

**Caractéristiques:**
- Titre "YOUR NOTES" en uppercase, semibold
- Inputs avec bordures arrondies et focus ring
- Bouton "Create" avec coins arrondis et `whitespace-nowrap` (évite le débordement)
- Placeholder descriptif "Search notes"

#### Éditeur de notes

**Toolbar:**
- Boutons texte simple: B, I, List, Code, Quote
- Bouton Preview/Edit avec état actif
- Dropdown Export (Markdown/Text)

**Footer:**
- Background `bg-gray-50`
- Section Tags avec label "TAGS" en uppercase
- Tags affichés comme badges blancs avec bordure
- Indicateur de collaboration en badge vert vif

### Hiérarchie visuelle

**Informations prioritaires (très visibles):**
1. Username de l'utilisateur connecté (badge gris dans header)
2. Bouton Logout (noir, bien visible)
3. Notes actives (bordure noire, shadow)
4. Utilisateurs en train d'éditer (badge vert vif)
5. Titres de notes (font-semibold, text-base)

**Informations secondaires:**
1. Dates de modification (badges gris/noir selon état)
2. Tags (badges avec bordures)
3. Aperçu du contenu (text-sm)

**Informations tertiaires:**
1. Placeholders
2. Labels de formulaire

## Fonctionnalités avancées

### Markdown Preview
- Bascule entre mode édition et aperçu Markdown
- Utilise `marked` pour le rendu
- Styling personnalisé pour les éléments Markdown

### Export de notes
- Export au format Markdown (.md)
- Export au format texte brut (.txt)
- Téléchargement automatique via Blob API

### Collaboration en temps réel

**Indicateurs visuels:**
- Point vert clignotant pour les éditeurs actifs
- Liste des usernames en cours d'édition
- Badge vert vif "currently editing" dans le footer

**Synchronisation:**
- Debounce de 500ms sur les modifications de contenu
- Mise à jour instantanée des autres utilisateurs
- Gestion des conflits via timestamps

## Points de maintenance importants

### Configuration critique

1. **Port Backend**: Toujours 5000 (pas 3000)
2. **CORS**: Configure pour accepter ports 3000 et 3001
3. **MongoDB**: Connection string sans chevrons autour du mot de passe
4. **Socket Delay**: 500ms de délai avant connexion socket (voir AuthContext)

### Dépendances importantes

**Frontend:**
- `lodash`: Utilisé pour debounce dans NotesContext
- `marked`: Rendu Markdown
- `socket.io-client`: Communication temps réel
- `axios`: Appels API

**Backend:**
- `mongoose`: ODM MongoDB
- `socket.io`: WebSocket serveur
- `cors`: Gestion CORS
- `express`: Framework web

### Structure de logging

Des logs détaillés sont en place pour le débogage:
- AuthContext: Logs de connexion/déconnexion
- API Service: Logs des erreurs réseau
- Socket Handlers: Logs des événements temps réel

### Scripts de démarrage

**Backend:**
```json
"dev": "ts-node src/server.ts"
```

**Frontend:**
```json
"start": "react-scripts start"
```

### Conventions de code

**Styling:**
- Utiliser les coins arrondis (`rounded-lg`, `rounded-2xl`)
- Toujours ajouter `transition-all` ou `transition-colors` pour les animations
- Utiliser `shadow-sm`, `shadow-md`, `shadow-lg` pour la profondeur
- Focus rings: `focus:ring-2 focus:ring-gray-900`

**Composants:**
- Un composant par fichier
- Props typées avec TypeScript
- Hooks personnalisés pour la logique réutilisable

**État:**
- Context API pour l'état global
- useState pour l'état local des composants
- Éviter la duplication d'état

## Troubleshooting

### Problème: Login ne fonctionne pas
- Vérifier que le backend tourne sur le port 5000
- Vérifier le fichier .env du frontend (API_URL doit pointer vers 5000)
- Vérifier les logs dans la console navigateur et terminal backend

### Problème: Socket.io ne se connecte pas
- Vérifier le délai de 500ms dans AuthContext
- Vérifier la configuration CORS du backend
- Vérifier que SOCKET_URL pointe vers le bon port

### Problème: MongoDB connection failed
- Vérifier que le mot de passe n'a pas de chevrons
- Vérifier l'accès réseau dans MongoDB Atlas (IP whitelist)
- Vérifier que l'utilisateur MongoDB a les bonnes permissions

### Problème: Notes ne se synchronisent pas
- Vérifier la connexion Socket.io dans les DevTools
- Vérifier les événements socket dans la console
- Vérifier que le debounce fonctionne (500ms)

## Future Enhancements

Pistes d'amélioration pour les prochaines versions:

1. **Authentification sécurisée**: Ajouter JWT et mots de passe
2. **Mode sombre**: Toggle pour thème sombre
3. **Notifications**: Système de notifications push
4. **Versioning**: Historique des modifications de notes
5. **Partage**: Partage de notes via liens
6. **Rich Text Editor**: WYSIWYG editor complet
7. **Offline Mode**: Support PWA avec cache
8. **Performance**: Virtualisation pour grandes listes de notes