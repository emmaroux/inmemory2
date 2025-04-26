# Documentation InMemory

## ⚠️ PRÉ-REQUIS CRITIQUES POUR STRAPI

### 1. Structure des Données
La structure des données retournée par Strapi dépend de la version et de la configuration. Dans notre cas :
- Les données sont directement accessibles à la racine des objets (PAS dans `attributes`)
- Exemple : `item.title` au lieu de `item.attributes.title`
- Les relations sont des tableaux directs : `item.votes` au lieu de `item.attributes.votes.data`

### 2. Population des Relations
Pour récupérer les relations, utiliser :
```typescript
// ✅ CORRECT
?populate[category]=true&populate[votes]=true&populate[comments]=true

// ❌ INCORRECT - Ne pas utiliser
?populate=* ou ?populate[relation]=*
```

### 3. Transformation des Données
```typescript
// ✅ CORRECT
const resource = {
  title: item.title,
  votes: (item.votes || []).map(vote => ({
    value: vote.value,
    userId: vote.user?.id
  }))
};

// ❌ INCORRECT
const resource = {
  title: item.attributes.title,
  votes: item.attributes.votes.data.map(vote => ({
    value: vote.attributes.value,
    userId: vote.attributes.user.data.id
  }))
};
```

### 4. Points de Vigilance
- Toujours vérifier la présence des données avec des valeurs par défaut
- Utiliser l'opérateur optionnel `?.` pour les relations
- Logger la structure des données en cas de doute
- Tester les requêtes dans l'interface admin de Strapi avant implémentation

---

## État actuel du projet

### Fonctionnalités opérationnelles

1. **Affichage des ressources**
   - Liste des ressources avec pagination
   - Affichage en grille avec des cartes
   - Gestion des images (avec fallback sur les initiales si pas d'image)
   - Affichage des métadonnées (date de publication, nombre de votes, commentaires)

2. **Filtrage par catégories**
   - Sélecteur de catégories fonctionnel
   - Possibilité de voir toutes les ressources
   - Mise à jour dynamique de l'affichage

3. **Interface utilisateur**
   - Design responsive
   - Composants réutilisables
   - Gestion des états de chargement
   - Gestion des erreurs

### Architecture technique

1. **Frontend (Next.js)**
   - Structure en composants React
   - Gestion d'état avec React Hooks
   - Typage TypeScript
   - Styling avec Tailwind CSS

2. **Backend (Strapi)**
   - API REST pour les ressources
   - Gestion des catégories
   - Système de pagination
   - Relations entre les modèles (ressources, catégories, équipes)

## Défis et points d'attention

### Authentification et autorisation

Nous avons rencontré plusieurs défis concernant l'authentification :

1. **Problèmes identifiés**
   - Difficulté à gérer correctement le token d'authentification
   - Problèmes avec le filtrage des ressources basé sur l'utilisateur connecté
   - Complexité dans la gestion des équipes et des permissions

2. **Solutions temporaires**
   - Désactivation temporaire du filtrage par authentification
   - Affichage de toutes les ressources pour simplifier le développement
   - Report de la logique d'équipes pour une phase ultérieure

3. **Recommandations pour l'implémentation future**
   - Implémenter un système de gestion de session robuste
   - Utiliser le contexte d'authentification (`AuthContext`) uniquement après avoir validé son fonctionnement
   - Mettre en place un système de permissions granulaire au niveau de Strapi
   - Tester exhaustivement les scénarios d'authentification avant de les réactiver

### Points à améliorer

1. **Authentification**
   - Réimplémentation du système d'authentification
   - Gestion des permissions par équipe
   - Filtrage des ressources selon les droits d'accès

2. **Performance**
   - Optimisation des requêtes API
   - Mise en cache des données
   - Chargement progressif des images

3. **Expérience utilisateur**
   - Amélioration des retours visuels
   - Gestion plus fine des erreurs
   - Animations et transitions

## Guide de développement

### Pour continuer le développement

1. L'authentification est actuellement désactivée pour permettre un développement stable
2. Les ressources sont affichées sans filtrage par utilisateur ou équipe
3. Le système est prêt pour l'ajout de nouvelles fonctionnalités

### Pour réactiver l'authentification

1. Vérifier le bon fonctionnement du `AuthContext`
2. Implémenter la logique de filtrage dans le backend Strapi
3. Tester les différents scénarios d'authentification
4. Réactiver progressivement les fonctionnalités liées à l'authentification

### Bonnes pratiques

1. Toujours tester les nouvelles fonctionnalités sans authentification d'abord
2. Ajouter des logs détaillés pour le débogage
3. Maintenir une documentation à jour des changements
4. Faire des tests exhaustifs avant de merger dans la branche principale

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

## Implémentation de l'Affichage des Ressources

### Structure des Données

La structure des données retournée par Strapi pour les ressources est la suivante :
```typescript
interface Resource {
  id: number;
  documentId: string;
  title: string;
  description: string;
  imageUrl: string | null;
  link: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  isPublic: boolean;
  category: {
    id: number;
    name: string;
    // ... autres attributs de catégorie
  } | null;
  teams: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  votes: any[];
  comments: any[];
}
```

### Composants Principaux

1. **Page Principale (`page.tsx`)**
   ```typescript
   // États principaux
   const [resources, setResources] = useState<Resource[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
   const [loadingState, setLoadingState] = useState<'idle' | 'resources' | 'categories' | 'complete'>('idle');
   const [currentPage, setCurrentPage] = useState(1);
   const [pageSize] = useState(12);
   ```

2. **Grille de Ressources (`ResourceGrid.tsx`)**
   ```typescript
   interface ResourceGridProps {
     resources: Resource[];
     onResourceClick: (resource: Resource) => void;
   }
   ```

3. **Carte de Ressource (`ResourceGridItem.tsx`)**
   ```typescript
   interface ResourceGridItemProps {
     resource: Resource;
     onClick: () => void;
   }
   ```

### Récupération des Données

La fonction de récupération des données a été simplifiée pour gérer uniquement les ressources sans authentification :

```typescript
const fetchData = useCallback(async () => {
  setLoadingState('resources');
  const strapiUrl = "http://localhost:1337";
  try {
    // Construction de l'URL avec pagination et relations
    let resourcesUrl = `${strapiUrl}/api/resources?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&populate=*`;
    
    if (selectedCategory) {
      resourcesUrl += `&filters[category][id][$eq]=${selectedCategory}`;
    }

    const resourcesResponse = await fetch(resourcesUrl);
    const resourcesData = await resourcesResponse.json();
    
    // Transformation des données
    const formattedResources = resourcesData.data.map((item: any) => ({
      id: item.id,
      documentId: `resource-${item.id}`,
      title: item.title || 'Sans titre',
      description: item.description || '',
      imageUrl: item.imageUrl || null,
      link: item.link || null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
      isPublic: item.isPublic || false,
      category: item.category ? {
        id: item.category.id,
        name: item.category.name || '',
        // ... autres attributs
      } : null,
      teams: (item.teams || []).map((team: any) => ({
        id: team.id,
        name: team.name,
        color: team.color
      })),
      votes: [],
      comments: []
    }));

    setResources(formattedResources);
    setTotalPages(resourcesData.meta?.pagination?.pageCount || 1);
  } catch (err) {
    console.error('Erreur détaillée:', err);
    setError(err instanceof Error ? err.message : 'Une erreur est survenue');
  }
  setLoadingState('complete');
}, [currentPage, pageSize, selectedCategory]);
```

### Points Clés de l'Implémentation

1. **Gestion des Données Manquantes**
   - Utilisation de valeurs par défaut pour tous les champs (`|| ''`, `|| null`)
   - Vérification de l'existence des objets imbriqués avant accès
   - Transformation des IDs en documentIds uniques

2. **Optimisations**
   - Utilisation de `useCallback` pour la fonction de récupération
   - Pagination côté serveur avec `pageSize`
   - Chargement des relations en une seule requête avec `populate=*`

3. **Gestion des États**
   - État de chargement granulaire (`loadingState`)
   - Gestion séparée des erreurs
   - État de pagination pour la navigation

4. **Modifications Récentes**
   - Suppression de la logique d'authentification pour simplifier le développement
   - Accès direct aux propriétés des ressources sans passer par `attributes`
   - Ajout de valeurs par défaut plus robustes

### Bonnes Pratiques Identifiées

1. **Structure des Données**
   - Toujours définir des interfaces TypeScript claires
   - Prévoir des valeurs par défaut pour tous les champs
   - Utiliser des types stricts plutôt que `any`

2. **Gestion des Erreurs**
   - Logger les erreurs détaillées en développement
   - Fournir des messages d'erreur utilisateur appropriés
   - Gérer les cas d'erreur de manière gracieuse

3. **Performance**
   - Pagination côté serveur
   - Chargement optimisé des relations
   - Mise en cache des données quand approprié

### Problèmes Connus et Solutions

1. **Problème d'Authentification**
   ```typescript
   // Ancien code problématique
   if (isAuthenticated) {
     resourcesUrl += '&filters[$or][0][isPublic][$eq]=true';
     resourcesUrl += `&filters[$or][1][teams][users][id][$eq]=${userId}`;
   }
   ```
   Solution : Temporairement désactivé pour simplifier le développement

2. **Structure des Données Strapi**
   ```typescript
   // Ancien accès problématique
   title: item.attributes?.title || ''
   
   // Nouvelle approche simplifiée
   title: item.title || ''
   ```

3. **Gestion des Relations**
   ```typescript
   // Simplification de l'accès aux relations
   category: item.category ? {
     id: item.category.id,
     name: item.category.name || ''
   } : null
   ``` 