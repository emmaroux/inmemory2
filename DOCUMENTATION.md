# Documentation Technique InMemory

## Introduction

InMemory est une plateforme collaborative permettant aux équipes de partager et d'organiser des ressources (articles, tutoriels, outils, etc.). Chaque équipe peut voter pour les ressources qu'elle trouve utiles. L'objectif est de créer une base de connaissances partagée et organisée par les équipes.

## Architecture du Projet

### Structure Monorepo

Le projet est organisé comme un monorepo contenant le frontend et le backend :

```
inmemory2/
├── package.json                 # Orchestration du monorepo
├── inmemory-backend-clean/      # Backend Strapi
│   ├── package.json             # Dépendances spécifiques au backend
│   └── ...
├── inmemory-web/                # Frontend Next.js
│   ├── package.json             # Dépendances spécifiques au frontend
│   └── ...
└── README.md                    # Documentation générale
```

### Scripts disponibles à la racine

| Commande | Description |
|----------|-------------|
| `npm run clean:all` | Supprime tous les dossiers `node_modules` |
| `npm run install:all` | Installe toutes les dépendances (racine, backend, frontend) |
| `npm run dev:all` | Lance le backend et le frontend simultanément |
| `npm run dev:back` | Lance uniquement le backend Strapi |
| `npm run dev:front` | Lance uniquement le frontend Next.js |
| `npm run build:all` | Construit les deux projets pour la production |
| `npm run restart:all` | Redémarre les serveurs backend et frontend |

## Frontend (Next.js)

### Architecture Technique

- Framework: Next.js 14 avec TypeScript
- Styles: Tailwind CSS
- Gestion d'état: React Hooks

### Structure du Projet Frontend

```
inmemory-web/
├── src/                 # Code source
│   ├── app/             # Application Next.js
│   │   ├── components/  # Composants React
│   │   │   ├── resources/ # Composants liés aux ressources
│   │   │   └── ui/        # Composants UI réutilisables
│   │   ├── types/        # Types TypeScript
│   │   └── page.tsx      # Page principale
│   └── styles/           # Styles globaux
├── public/               # Fichiers statiques
└── docs/                 # Documentation
```

### Modèles de Données Frontend

Les principaux types de données sont:
- **Resource**: Ressource partagée (article, tutoriel, etc.)
- **Category**: Catégorie de ressource
- **Team**: Équipe utilisatrice de la plateforme
- **Vote**: Vote d'une équipe pour une ressource

## Backend (Strapi)

### Architecture Technique

- Framework: Strapi v4
- Base de données: PostgreSQL
- Authentification: JWT via Strapi
- Environnement: Node.js

### Structure d'une API dans Strapi

Chaque API dans Strapi doit avoir la structure suivante :

```
src/api/[nom-api]/
├── content-types/
│   └── [nom-api]/
│       └── schema.json    # Définition du modèle
├── controllers/
│   └── [nom-api].js      # Logique de contrôle
├── routes/
│   └── [nom-api].js      # Définition des routes
└── services/
    └── [nom-api].js      # Logique métier
```

## Système d'Authentification

### Types d'Utilisateurs dans Strapi

Strapi distingue deux types d'utilisateurs différents :

1. **Les utilisateurs administrateurs** (Admin Users)
   - Accèdent à l'interface d'administration de Strapi
   - Ont des rôles comme : Super Admin, Editor, Author
   - Utilisent l'endpoint `/admin/login` pour s'authentifier
   - Ne doivent PAS être utilisés pour l'API publique

2. **Les utilisateurs de l'API** (API Users)
   - Utilisent l'application front-end
   - Ont des rôles comme : Authenticated, Public
   - Utilisent l'endpoint `/api/auth/local` pour s'authentifier
   - Sont les utilisateurs à créer pour l'application

### Configuration des Utilisateurs API

1. **Vérifier les Rôles API**
   - Dans Settings > Users & Permissions Plugin > Roles
   - Configurer les permissions pour le rôle "Authenticated"

2. **Créer un Utilisateur API**
   - Aller dans Content Manager > Collection Types > User
   - Créer un nouvel utilisateur avec username, email et mot de passe

3. **Authentification côté Front-end**
   ```typescript
   // Fonction d'authentification
   async function login(identifier: string, password: string) {
     try {
       const response = await fetch('http://localhost:1337/api/auth/local', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           identifier,
           password,
         }),
       });
   
       const data = await response.json();
       if (data.jwt) {
         // Stocker le token JWT
         localStorage.setItem('token', data.jwt);
         return data.user;
       } else {
         throw new Error(data.error?.message || 'Erreur d\'authentification');
       }
     } catch (error) {
       console.error('Erreur de login:', error);
       throw error;
     }
   }
   
   // Utilisation du token dans les requêtes
   async function fetchResourcesWithAuth() {
     const token = localStorage.getItem('token');
     
     const response = await fetch('http://localhost:1337/api/resources', {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
     
     return response.json();
   }
   ```

## API Endpoints et Intégration

### Endpoints Principaux

#### Ressources
```
GET /api/resources
GET /api/resources/:id
```

#### Catégories
```
GET /api/categories
GET /api/categories/:id
```

#### Votes
```
GET /api/votes
POST /api/votes
```

#### Équipes
```
GET /api/teams
GET /api/teams/:id
```

### Paramètres de Requête

#### Pagination
```
?pagination[page]=1&pagination[pageSize]=10
```

#### Population des Relations
```
?populate[category]=true&populate[votes][populate][team]=true
```

#### Filtrage
```
?filters[title][$contains]=recherche
```

### Format de Réponse de l'API

L'API utilise le format standard de Strapi v5 avec des attributs imbriqués:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Titre de ressource",
        "createdAt": "2023-01-01T12:00:00.000Z",
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Catégorie"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 2,
      "total": 36
    }
  }
}
```

### Exemple d'Intégration

```typescript
// Récupération des ressources avec leurs relations
async function fetchResourcesWithRelations() {
  const response = await fetch(
    'http://localhost:1337/api/resources?populate[category]=true&populate[votes][populate][team]=true'
  );
  const data = await response.json();
  
  const resources = data.data.map(resource => {
    const attributes = resource.attributes;
    return {
      id: resource.id,
      title: attributes.title,
      category: attributes.category.data 
        ? {
            id: attributes.category.data.id,
            name: attributes.category.data.attributes.name
          }
        : null,
      votes: attributes.votes.data.map(vote => ({
        id: vote.id,
        team: vote.attributes.team.data
          ? {
              id: vote.attributes.team.data.id,
              name: vote.attributes.team.data.attributes.name
            }
          : null
      }))
    };
  });
  
  return resources;
}
```

### Adaptateurs d'API

Pour simplifier l'intégration, un ensemble d'adaptateurs d'API est disponible :

#### Utilisation du Service API

```typescript
import { ApiService } from './api-adapters';

// Récupérer toutes les ressources avec leurs relations
const resources = await ApiService.getResourcesWithRelations();

// Récupérer une ressource spécifique avec ses relations
const resource = await ApiService.getResource(1);

// Créer un vote pour une ressource
await ApiService.createVote({
  resource: 1,
  team: 1,
  value: 1
});
```

#### Utilisation des Hooks React

```typescript
import { useResources, useResource } from './api-adapters';

// Dans un composant React
function ResourceList() {
  const { 
    resources, 
    isLoading, 
    error, 
    pagination,
    changePage
  } = useResources({
    page: 1,
    pageSize: 10
  });
  
  // ...
}

function ResourceDetail({ id }) {
  const { 
    resource, 
    isLoading, 
    error,
    createVote,
    createComment
  } = useResource(id);
  
  // ...
}
```

### Gestion des Erreurs API

Les erreurs sont retournées au format suivant :
```typescript
{
  data: null,
  error: {
    status: number,    // Code HTTP
    name: string,      // Nom de l'erreur
    message: string,   // Message d'erreur
    details: object    // Détails supplémentaires
  }
}
```

## Bonnes Pratiques et Dépannage

### Intégration Frontend-Backend

#### Accès aux Données dans le Format Standard

```typescript
// Accès aux attributs de base
const title = resource.attributes.title;

// Accès à une relation
const categoryName = resource.attributes.category.data?.attributes.name;

// Accès à une collection de relations
const votes = resource.attributes.votes.data || [];
votes.forEach(vote => {
  const teamName = vote.attributes.team.data?.attributes.name;
});
```

### Gestion des Erreurs

#### Bonnes Pratiques
1. **Gestion indépendante des erreurs** pour chaque type de données
2. **États de chargement granulaires** qui décrivent précisément l'étape en cours
3. **Gestion des données manquantes** avec des valeurs par défaut
4. **Affichage contextuel des erreurs** selon leur gravité

#### Erreurs Courantes avec Strapi

Si vous recevez une erreur 500 sur un endpoint Strapi, vérifiez:
1. La structure complète du modèle (fichiers manquants)
2. Les permissions dans l'interface d'administration
3. La cohérence des noms entre les différents fichiers
4. Les logs du serveur

## Création d'un Projet Strapi Complet à Partir de Zéro

### 1. Installation et Configuration Initiale

```bash
npx create-strapi-app@latest my-project --quickstart
```

### 2. Configuration de la Base de Données

Pour PostgreSQL, créer un fichier `config/database.js` :
```javascript
module.exports = {
  connection: {
    client: 'postgres',
    connection: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
  },
};
```

### 3. Configuration des Middlewares

Créer un fichier `config/middlewares.js` :
```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 4. Configuration des Plugins

Créer un fichier `config/plugins.js` :
```javascript
module.exports = {
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
};
```

### 5. Création des Types de Contenu

Pour chaque modèle de données (resource, category, team, vote, comment), créer la structure suivante :

1. **Via l'Interface d'Administration :**
   - Aller dans Content-Type Builder
   - Créer un nouveau type de collection
   - Ajouter les champs et relations nécessaires

2. **Ou Manuellement :**
   - Créer la structure de dossiers appropriée
   - Définir les schemas, contrôleurs, routes et services

Par exemple, pour le modèle "Resource" :
```json
// src/api/resource/content-types/resource/schema.json
{
  "kind": "collectionType",
  "collectionName": "resources",
  "info": {
    "singularName": "resource",
    "pluralName": "resources",
    "displayName": "Resource"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text",
      "required": true
    },
    "imageUrl": {
      "type": "string"
    },
    "link": {
      "type": "string"
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category",
      "inversedBy": "resources"
    }
  }
}
```

### 6. Configuration des Permissions

1. Aller dans Settings > Users & Permissions Plugin > Roles
2. Configurer les permissions pour chaque rôle :
   - Public : Lecture seule (find, findOne)
   - Authenticated : Lecture, création, modification (find, findOne, create, update)

### 7. Optimisation pour la Production

1. **Configuration CORS :**
```javascript
// config/middlewares.js
{
  name: 'strapi::cors',
  config: {
    origin: ['http://localhost:3000', 'https://votre-app.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    keepHeaderOnError: true,
  },
},
```

2. **Caching :**
```javascript
// config/plugins.js
'rest-cache': {
  config: {
    provider: {
      name: 'memory',
      options: {
        max: 32767,
        maxAge: 3600,
      },
    },
    strategy: {
      contentTypes: [
        'api::resource.resource',
        'api::category.category',
      ],
      maxAge: 3600000,
    },
  },
},
```

## Création d'un Projet Next.js

1. **Installation**
   ```bash
   npx create-next-app my-project
   ```

2. **Configuration de Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Connexion à l'API Strapi**
   - Créer un fichier `.env.local` avec `NEXT_PUBLIC_API_URL=http://localhost:1337`
   - Créer un service d'API pour gérer les requêtes

4. **Démarrage**
   ```bash
   npm run dev
   ```

## Conseils pour le Développement

1. **Intégration API**
   - Utiliser fetch ou axios avec la gestion appropriée des erreurs
   - Toujours vérifier les réponses et gérer les cas d'erreur
   - Fournir des valeurs par défaut pour les champs potentiellement manquants

2. **TypeScript**
   - Définir des interfaces pour tous les modèles de données
   - Utiliser des types pour les props des composants
   - Éviter `any` autant que possible

3. **Débogage**
   - Consulter les logs du serveur Strapi
   - Utiliser la console du navigateur pour le frontend
   - Outils Redux DevTools pour le débogage d'état

## Extensions Futures

Voir le fichier `BACKLOG.md` pour les évolutions futures du projet, notamment:
1. Développement d'une extension Chrome
2. Développement d'une application mobile

## Références et Documentation

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Strapi](https://docs.strapi.io)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs) 