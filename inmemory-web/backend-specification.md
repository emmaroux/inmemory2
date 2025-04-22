# Spécification Backend - Projet InMemory

## Contexte du Projet

InMemory est une plateforme collaborative permettant aux équipes de partager et d'organiser des ressources (articles, tutoriels, outils, etc.). Chaque équipe peut voter pour les ressources qu'elle trouve utiles et laisser des commentaires. L'objectif est de créer une base de connaissances partagée et organisée par les équipes.

## Architecture Technique

- Frontend : Next.js 14 avec TypeScript
- Backend : Strapi
- Base de données : PostgreSQL (recommandé)

## Configuration Strapi

### 1. Installation et Configuration Initiale

```bash
npx create-strapi-app@latest inmemory-backend --quickstart
```

Une fois l'installation terminée, configurer :

1. Le fichier `config/database.js` :
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

2. Le fichier `config/middlewares.js` :
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

3. Le fichier `config/plugins.js` :
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

### 2. Création des Types de Contenu

#### Team (Équipe)
- **Nom** : `team`
- **Champs** :
  - `name` (Text) : Nom de l'équipe
  - `color` (Text) : Code couleur hexadécimal
  - `users` (Relation many-to-many avec User)

#### Resource (Ressource)
- **Nom** : `resource`
- **Champs** :
  - `title` (Text) : Titre de la ressource
  - `description` (Rich Text) : Description détaillée
  - `imageUrl` (Text) : URL de l'image
  - `link` (Text) : URL de la ressource
  - `category` (Relation many-to-one avec Category)

#### Vote
- **Nom** : `vote`
- **Champs** :
  - `resource` (Relation many-to-one avec Resource)
  - `team` (Relation many-to-one avec Team)
  - `value` (Integer) : Valeur du vote (1 par défaut)
  - `user` (Relation many-to-one avec User)

#### Comment
- **Nom** : `comment`
- **Champs** :
  - `resource` (Relation many-to-one avec Resource)
  - `team` (Relation many-to-one avec Team)
  - `content` (Text) : Contenu du commentaire
  - `user` (Relation many-to-one avec User)

#### Category
- **Nom** : `category`
- **Champs** :
  - `name` (Text) : Nom de la catégorie
  - `resources` (Relation one-to-many avec Resource)

## API Endpoints

### 1. Équipes
```
GET /api/teams
```
- Retourne toutes les équipes
- Inclure les utilisateurs associés

### 2. Ressources
```
GET /api/resources
```
Paramètres :
- `populate=*` : Inclure toutes les relations
- `pagination[page]` : Numéro de la page
- `pagination[pageSize]` : Nombre d'éléments par page
- `filters[category][id][$eq]` : Filtrer par catégorie

### 3. Votes
```
GET /api/votes
```
Paramètres :
- `filters[resource][id][$eq]` : Filtrer par ressource
- `filters[team][id][$eq]` : Filtrer par équipe
- `populate=team` : Inclure les données de l'équipe

### 4. Commentaires
```
GET /api/comments
```
Paramètres :
- `filters[resource][id][$eq]` : Filtrer par ressource
- `filters[team][id][$eq]` : Filtrer par équipe
- `sort[0]=createdAt:desc` : Trier par date
- `populate=team` : Inclure les données de l'équipe

## Sécurité et Permissions

1. **Configuration des Permissions**
   - Dans le panneau d'administration Strapi
   - Section "Settings" > "Users & Permissions Plugin" > "Roles"
   - Configurer les permissions pour chaque type de contenu

2. **Rôles Recommandés**
   - Authenticated : Peut voter et commenter
   - Public : Peut voir les ressources
   - Admin : Accès complet

3. **Politiques de Sécurité**
   - Limiter la taille des uploads
   - Valider les URLs des images
   - Sanitizer les commentaires
   - Limiter le nombre de votes par utilisateur/équipe

## Performance et Optimisation

1. **Mise en Cache**
   - Configurer le cache pour les requêtes fréquentes
   - Mettre en cache les listes de ressources
   - Invalider le cache lors des modifications

2. **Optimisation des Requêtes**
   - Utiliser la pagination
   - Limiter les champs retournés
   - Optimiser les relations

3. **Monitoring**
   - Configurer les logs
   - Surveiller les performances
   - Mettre en place des alertes

## Tests et Validation

1. **Tests d'API**
   - Tester tous les endpoints
   - Vérifier les permissions
   - Tester les cas d'erreur

2. **Validation des Données**
   - Vérifier les formats des URLs
   - Valider les couleurs hexadécimales
   - Limiter la taille des commentaires

## Déploiement

1. **Configuration de Production**
   - Utiliser des variables d'environnement
   - Configurer SSL
   - Mettre en place un backup automatique

2. **Monitoring**
   - Configurer des alertes
   - Surveiller les performances
   - Tracer les erreurs

## Documentation Additionnelle

- [Documentation Strapi](https://docs.strapi.io/)
- [Guide de Déploiement](https://docs.strapi.io/dev-docs/deployment)
- [API Reference](https://docs.strapi.io/dev-docs/api/rest)

## Contact

Pour toute question ou clarification, n'hésitez pas à contacter l'équipe frontend. 