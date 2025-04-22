# Documentation Technique Backend InMemory

## Architecture

- **Framework** : Strapi v4
- **Base de données** : PostgreSQL
- **Authentification** : JWT via Strapi
- **Environnement** : Node.js

## Structure d'une API dans Strapi

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

### Exemple de configuration complète

1. **Schema** (`content-types/[nom-api]/schema.json`) :
```json
{
  "kind": "collectionType",
  "collectionName": "models",
  "info": {
    "displayName": "Model",
    "pluralName": "models",
    "singularName": "model"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    }
  }
}
```

2. **Controller** (`controllers/[nom-api].js`) :
```javascript
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::model.model');
```

3. **Routes** (`routes/[nom-api].js`) :
```javascript
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::model.model');
```

4. **Service** (`services/[nom-api].js`) :
```javascript
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::model.model');
```

## Débogage d'une API

### Vérification de la structure

1. **Vérifier que tous les fichiers nécessaires existent** :
   - Schema
   - Controller
   - Routes
   - Service

2. **Vérifier les permissions** :
   - Dans `config/plugins/users-permissions.js`
   - Dans `config/roles/authenticated.json`
   - Dans l'interface d'administration de Strapi

3. **Vérifier les logs** :
   - Activer les logs détaillés dans le contrôleur
   - Vérifier les logs du serveur lors des requêtes

### Erreurs courantes

1. **Erreur 500 (Internal Server Error)** :
   - Vérifier que le service existe
   - Vérifier les logs du serveur
   - Vérifier les permissions

2. **Erreur 404 (Not Found)** :
   - Vérifier que la route existe
   - Vérifier que le contrôleur est correctement configuré

3. **Erreur 403 (Forbidden)** :
   - Vérifier les permissions dans l'interface d'administration
   - Vérifier le token JWT

### Bonnes pratiques

1. **Structure** :
   - Toujours créer les 4 fichiers (schema, controller, routes, service)
   - Suivre la convention de nommage de Strapi

2. **Permissions** :
   - Configurer les permissions dans l'interface d'administration
   - Documenter les permissions requises

3. **Logs** :
   - Ajouter des logs dans les contrôleurs
   - Utiliser des messages d'erreur descriptifs

## Modèles de Données

### Resource
```typescript
{
  kind: "collectionType",
  collectionName: "resources",
  info: {
    singularName: "resource",
    pluralName: "resources",
    displayName: "Resource"
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    title: {
      type: "string",
      required: true
    },
    content: {
      type: "text",
      required: true
    },
    date: {
      type: "date",
      required: true
    },
    location: {
      type: "string",
      required: true
    },
    status: {
      type: "enumeration",
      enum: ["draft", "published"],
      default: "draft",
      required: true
    },
    imageUrl: {
      type: "string"
    },
    link: {
      type: "string"
    },
    category: {
      type: "relation",
      relation: "manyToOne",
      target: "api::category.category",
      inversedBy: "resources"
    },
    votes: {
      type: "relation",
      relation: "oneToMany",
      target: "api::vote.vote",
      mappedBy: "resource"
    }
  }
}
```

### Category
```typescript
{
  kind: "collectionType",
  collectionName: "categories",
  info: {
    singularName: "category",
    pluralName: "categories",
    displayName: "Category"
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    name: {
      type: "string",
      required: true
    },
    description: {
      type: "text",
      required: true
    },
    resources: {
      type: "relation",
      relation: "oneToMany",
      target: "api::resource.resource",
      mappedBy: "category"
    }
  }
}
```

### Team
```typescript
{
  kind: "collectionType",
  collectionName: "teams",
  info: {
    singularName: "team",
    pluralName: "teams",
    displayName: "Team"
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    name: {
      type: "string",
      required: true
    },
    color: {
      type: "string",
      required: true
    },
    users: {
      type: "relation",
      relation: "manyToMany",
      target: "plugin::users-permissions.user",
      inversedBy: "teams"
    },
    votes: {
      type: "relation",
      relation: "oneToMany",
      target: "api::vote.vote",
      mappedBy: "team"
    }
  }
}
```

### Vote
```typescript
{
  kind: "collectionType",
  collectionName: "votes",
  info: {
    singularName: "vote",
    pluralName: "votes",
    displayName: "Vote"
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    value: {
      type: "integer",
      required: true
    },
    user: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::users-permissions.user",
      inversedBy: "votes"
    },
    resource: {
      type: "relation",
      relation: "manyToOne",
      target: "api::resource.resource",
      inversedBy: "votes"
    },
    team: {
      type: "relation",
      relation: "manyToOne",
      target: "api::team.team",
      inversedBy: "votes"
    }
  }
}
```

## Configuration des Permissions

### Public (non authentifié)
```json
{
  "category": {
    "find": true,
    "findOne": true
  },
  "resource": {
    "find": true,
    "findOne": true
  },
  "team": {
    "find": true,
    "findOne": true
  },
  "vote": {
    "find": true,
    "findOne": true
  }
}
```

### Authenticated
```json
{
  "category": {
    "find": true,
    "findOne": true
  },
  "resource": {
    "find": true,
    "findOne": true,
    "create": true,
    "update": true,
    "delete": true
  },
  "team": {
    "find": true,
    "findOne": true
  },
  "vote": {
    "find": true,
    "findOne": true,
    "create": true,
    "update": true,
    "delete": true
  }
}
```

## API Endpoints

### Format de Réponse Standard
```typescript
// Réponse Success
{
  data: T[],
  meta: {
    pagination: {
      page: number,
      pageSize: number,
      pageCount: number,
      total: number
    }
  }
}

// Réponse Error
{
  error: {
    status: number,
    name: string,
    message: string,
    details: any
  }
}
```

### Options de Requête

1. **Pagination**
```
?pagination[page]=1
?pagination[pageSize]=10
?pagination[start]=0
?pagination[limit]=10
```

2. **Population des Relations**
```
?populate=*                    // Toutes les relations
?populate=category,votes       // Relations spécifiques
?populate[category]=true       // Une seule relation
?populate[votes][populate]=*   // Relations imbriquées
```

3. **Filtres**
```
?filters[title][$contains]=test
?filters[date][$gt]=2024-01-01
?filters[category][name][$eq]=IA
```

4. **Tri**
```
?sort=date:desc
?sort[0]=date:desc&sort[1]=title:asc
```

## Authentification

### Login
```typescript
POST /api/auth/local
Body: {
  identifier: string, // email ou username
  password: string
}
Response: {
  jwt: string,
  user: {
    id: number,
    username: string,
    email: string
  }
}
```

### Utilisation du Token
```typescript
Headers: {
  Authorization: "Bearer <token>"
}
```

## Bonnes Pratiques

1. **Gestion des Relations**
   - Toujours vérifier l'existence des entités liées
   - Utiliser les transactions pour les opérations multiples
   - Nettoyer les relations orphelines

2. **Performance**
   - Limiter l'utilisation de `populate=*`
   - Utiliser la pagination
   - Indexer les champs fréquemment filtrés

3. **Sécurité**
   - Valider les entrées utilisateur
   - Limiter les permissions au minimum nécessaire
   - Ne pas exposer de données sensibles

4. **Maintenance**
   - Logger les erreurs importantes
   - Documenter les changements de schéma
   - Versionner les migrations de base de données

## Résolution des problèmes courants

### Problème de modèles manquants
Si vous rencontrez une erreur du type "Metadata for 'api::model.model' not found", cela signifie qu'un modèle est référencé mais n'existe pas dans le système de fichiers. Pour résoudre ce problème :

1. Vérifiez que le modèle existe dans le dossier `src/api/`
2. Si le modèle n'existe pas, créez-le avec la structure suivante :
   ```
   src/api/[model]/
   ├── content-types/
   │   └── [model]/
   │       └── schema.json
   ├── controllers/
   │   └── [model].js
   └── routes/
       └── [model].js
   ```
3. Assurez-vous que les relations entre les modèles sont correctement définies dans les schémas

Exemple de schéma pour un modèle :
```json
{
  "kind": "collectionType",
  "collectionName": "models",
  "info": {
    "displayName": "Model",
    "pluralName": "models",
    "singularName": "model"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "name": {
      type: "string",
      required: true
    },
    "relation": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::other-model.other-model"
    }
  }
}
```

## Historique des Modifications Récentes

### Résolution des Problèmes de Modèles Manquants

1. **Création du modèle Category**
   - Structure créée manuellement :
     ```
     src/api/category/
     ├── content-types/
     │   └── category/
     │       └── schema.json
     ├── controllers/
     │   └── category.js
     ├── routes/
     │   └── category.js
     └── services/
         └── category.js
     ```
   - Ajout des relations avec le modèle Resource
   - Configuration des permissions dans l'interface d'administration

2. **Création du modèle Comment**
   - Structure similaire au modèle Category
   - Relations avec les modèles User, Resource et Team
   - Configuration des permissions appropriées

### Désactivation du Seeding Automatique

1. **Suppression du script de seeding**
   - Suppression du fichier `scripts/seed.js`
   - Modification de `config/database.js` pour retirer les références au seeding
   - Mise à jour de `src/index.js` pour supprimer la logique de seeding

2. **Configuration des Permissions**
   - Mise à jour de `config/plugins/users-permissions.js`
   - Configuration des permissions pour les routes Category
   - Ajout de l'authentification requise pour les endpoints sensibles

### Amélioration du Débogage

1. **Ajout de Logs Détaillés**
   - Implémentation de logs dans les contrôleurs
   - Suivi des requêtes et des réponses
   - Gestion des erreurs avec messages descriptifs

2. **Documentation des Erreurs Courantes**
   - Erreur 500 : Vérification des services manquants
   - Erreur 404 : Vérification des routes
   - Erreur 403 : Vérification des permissions

### Bonnes Pratiques Mises en Place

1. **Structure des APIs**
   - Vérification systématique de la présence des 4 composants (schema, controller, routes, service)
   - Documentation des relations entre les modèles
   - Configuration des permissions au niveau le plus granulaire

2. **Maintenance**
   - Ajout de logs pour faciliter le débogage
   - Documentation des changements de configuration
   - Versionnement des modifications importantes

## Seeding des Données

### Structure et Configuration

Le seeding des données dans Strapi se fait via le fichier `src/index.js`. C'est le point d'entrée principal de l'application où le bootstrap est exécuté.

1. **Création du script de seeding**
   - Créer un fichier `scripts/seed.js` à la racine du projet
   - Ce fichier contient la logique de création des données de test

2. **Configuration du bootstrap**
   - Dans `src/index.js`, ajouter l'import du script de seeding
   - Implémenter la logique dans la fonction `bootstrap`

Exemple de configuration :

```javascript
// src/index.js
const seed = require('../scripts/seed');

module.exports = {
  async bootstrap({ strapi }) {
    try {
      // Attendre que Strapi soit complètement initialisé
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Exécution du script de seeding
      await seed(strapi);
    } catch (error) {
      console.error('Erreur lors du seeding :', error);
      throw error;
    }
  },
};
```

### Bonnes Pratiques

1. **Structure du script de seeding**
   - Créer les données dans l'ordre logique (dépendances d'abord)
   - Utiliser des logs détaillés pour suivre le processus
   - Gérer les erreurs proprement

2. **Gestion des données**
   - Vérifier l'existence des données avant de les créer
   - Utiliser des données réalistes mais distinctes
   - Documenter la structure des données générées

3. **Sécurité**
   - Ne pas inclure de données sensibles
   - Utiliser des mots de passe sécurisés pour les utilisateurs de test
   - Ne pas exposer le script en production

### Exemple de Script de Seeding

```javascript
// scripts/seed.js
const { faker } = require('@faker-js/faker');

module.exports = async (strapi) => {
  try {
    // Création des catégories
    const categories = await Promise.all([
      strapi.entityService.create('api::category.category', {
        data: {
          name: 'IA',
          description: 'Intelligence Artificielle et Machine Learning'
        }
      }),
      // ... autres catégories
    ]);

    // Création des équipes
    const teams = await Promise.all([
      strapi.entityService.create('api::team.team', {
        data: {
          name: 'Équipe Alpha',
          color: '#4F46E5'
        }
      }),
      // ... autres équipes
    ]);

    // Création des utilisateurs
    const users = await Promise.all([
      strapi.entityService.create('plugin::users-permissions.user', {
        data: {
          username: 'user1',
          email: 'user1@test.com',
          password: 'password123',
          confirmed: true,
          blocked: false,
          role: 1
        }
      }),
      // ... autres utilisateurs
    ]);

    // Pour chaque ressource existante
    const resources = await strapi.entityService.findMany('api::resource.resource');
    for (const resource of resources) {
      // Attribution d'une catégorie
      await strapi.entityService.update('api::resource.resource', resource.id, {
        data: {
          category: faker.helpers.arrayElement(categories).id
        }
      });

      // Création de votes
      for (let i = 0; i < faker.number.int({ min: 3, max: 4 }); i++) {
        await strapi.entityService.create('api::vote.vote', {
          data: {
            value: faker.number.int({ min: 1, max: 5 }),
            user: faker.helpers.arrayElement(users).id,
            resource: resource.id,
            team: faker.helpers.arrayElement(teams).id
          }
        });
      }

      // Création de commentaires
      for (let i = 0; i < faker.number.int({ min: 2, max: 3 }); i++) {
        await strapi.entityService.create('api::comment.comment', {
          data: {
            content: faker.lorem.paragraph(),
            date: faker.date.recent(),
            resource: resource.id,
            team: faker.helpers.arrayElement(teams).id,
            user: faker.helpers.arrayElement(users).id
          }
        });
      }
    }
  } catch (error) {
    console.error('Erreur lors du seeding :', error);
    throw error;
  }
};
```

### Dépannage

1. **Erreurs courantes**
   - Module non trouvé : vérifier le chemin d'importation
   - Erreurs de dépendances : s'assurer que les données sont créées dans le bon ordre
   - Erreurs de permissions : vérifier les droits d'accès aux services

2. **Logs et débogage**
   - Ajouter des logs détaillés à chaque étape
   - Utiliser des messages d'erreur descriptifs
   - Vérifier les logs du serveur

3. **Optimisation**
   - Utiliser `Promise.all` pour les opérations parallèles
   - Limiter le nombre de données générées
   - Nettoyer les données existantes si nécessaire

## Configuration d'une nouvelle API

### Ordre des étapes

1. **Structure de base**
   - Créer le dossier de l'API dans `src/api/`
   - Créer les dossiers `content-types`, `controllers`, `routes`, `services`

2. **Configuration du contenu**
   - Définir le schéma dans `content-types/[nom]/schema.json`
   - Configurer les relations avec les autres entités

3. **Configuration des services**
   - Créer le service dans `services/[nom].js`
   - Utiliser `createCoreService` de Strapi
   ```javascript
   'use strict';
   const { createCoreService } = require('@strapi/strapi').factories;
   module.exports = createCoreService('api::[nom].[nom]');
   ```

4. **Configuration des permissions**
   - Accéder à l'interface d'administration (http://localhost:1337/admin)
   - Aller dans Settings > Users & Permissions Plugin > Roles
   - Configurer les permissions pour l'API (find, findOne, create, update, delete)

5. **Test de l'API**
   - Redémarrer le serveur Strapi
   - Tester les endpoints avec authentification
   - Vérifier les relations et les données retournées

### Exemple complet pour les commentaires

1. Structure :
```
src/api/comment/
├── content-types/
│   └── comment/
│       └── schema.json
├── controllers/
│   └── comment.js
├── routes/
│   └── comment.js
└── services/
    └── comment.js
```

2. Service :
```javascript
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::comment.comment');
```

3. Permissions :
- Activer les permissions pour les rôles concernés
- Configurer les accès aux relations (resource, team)

4. Test :
```bash
# Authentification
curl -X POST "http://localhost:1337/api/auth/local" \
  -H "Content-Type: application/json" \
  -d '{"identifier":"[username]","password":"[password]"}'

# Récupération des commentaires
curl -X GET "http://localhost:1337/api/comments?populate=*" \
  -H "Authorization: Bearer [token]"
```

### Bonnes pratiques

- Toujours créer le service avant de tester l'API
- Vérifier les permissions dans l'interface d'administration
- Tester avec authentification
- Documenter les endpoints et les relations
- Utiliser le seeding pour les données de test 