# BACKLOG DU PROJET INMEMORY

## Backlog #1 : Architecture monorepo et futures fonctionnalités

### Architecture recommandée pour le monorepo

Structure proposée :
```
inmemory2/
├── inmemory-backend-clean/     # Backend Strapi actuel
├── inmemory-web/               # Frontend Next.js actuel
├── inmemory-extension/         # Future extension Chrome
├── inmemory-mobile/            # Future application mobile
└── packages/                   # Dossier pour le code partagé
    ├── api-client/             # Client API réutilisable
    ├── ui-components/          # Composants UI partagés
    └── types/                  # Types TypeScript partagés
```

### Adaptations nécessaires pour préparer l'extension Chrome

**Objectif** : Créer une extension permettant d'enregistrer le contenu d'une page web comme nouvelle ressource de veille

1. **Couche d'API dans Strapi**
   - Créer des endpoints RESTful bien documentés
   - Implémenter l'authentification par token (JWT)
   - Développer des endpoints spécifiques pour l'enregistrement d'URL

2. **Adaptations du frontend Next.js**
   - Extraire la logique d'API dans un module séparé
   - Isoler les composants UI réutilisables
   - Configurer CORS pour autoriser les requêtes depuis l'extension

3. **Architecture de l'extension Chrome**
   - Utiliser le même client API que le frontend
   - Structure simple avec React/Preact
   - Partager les types avec le reste du projet

### Adaptations nécessaires pour l'application mobile

**Objectif** : Créer une application mobile pour consulter la veille, voter et commenter

1. **Architecture recommandée**
   - Utiliser React Native pour maximiser la réutilisation de code
   - Partager les types et le client API avec le reste du projet
   - Adapter les composants UI pour le mobile

2. **Configuration du partage de code**
   ```bash
   # Dans le dossier packages/api-client
   npm init -y
   npm install axios typescript

   # Dans le dossier packages/types
   npm init -y
   npm install typescript
   ```

### Notes importantes

- Cette structure permettra à toutes les applications (web, extension, mobile) de partager la même logique d'API et les mêmes types de données
- Les priorités sont : 
  1. Extension Chrome 
  2. Application mobile 