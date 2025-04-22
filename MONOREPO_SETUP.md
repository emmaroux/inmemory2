# Configuration du Monorepo InMemory

## Résumé des actions effectuées

Nous avons transformé deux projets distincts (frontend Next.js et backend Strapi) en un monorepo unique pour faciliter le développement et le déploiement.

### 1. Création de la structure monorepo

- Migration des deux projets séparés vers un seul dépôt Git
- Suppression des dossiers `.git` individuels dans chaque sous-projet
- Création d'un nouveau dépôt Git à la racine : https://github.com/emmaroux/inmemory2.git

### 2. Résolution du problème de poids

Problème identifié : poids excessif du projet (plus de 400 Mo pour le frontend, 797 Mo pour le backend)
- Cause : présence des dossiers `node_modules` volumineux
- Solution : configuration correcte des fichiers `.gitignore` et scripts de nettoyage/installation

### 3. Configuration de l'orchestration

Création d'un fichier `package.json` à la racine avec :
- Configuration des workspaces npm
- Scripts d'installation, de nettoyage et d'exécution
- Utilisation de `concurrently` pour exécuter plusieurs services en parallèle

### 4. Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run clean:all` | Supprime tous les dossiers `node_modules` |
| `npm run install:all` | Installe toutes les dépendances (racine, backend, frontend) |
| `npm run dev:all` | Lance le backend et le frontend simultanément |
| `npm run dev:back` | Lance uniquement le backend Strapi |
| `npm run dev:front` | Lance uniquement le frontend Next.js |
| `npm run build:all` | Construit les deux projets pour la production |

### 5. Structure de fichiers

```
inmemory2/
├── package.json                 # Orchestration du monorepo
├── inmemory-backend-clean/      # Backend Strapi
│   ├── package.json             # Dépendances spécifiques au backend
│   └── ...
├── inmemory-web/                # Frontend Next.js
│   ├── package.json             # Dépendances spécifiques au frontend
│   └── ...
└── BACKLOG.md                   # Backlog du projet
```

### 6. Explication du système de lock

- Chaque `package.json` est accompagné d'un `package-lock.json`
- Ces fichiers "lock" verrouillent les versions exactes des dépendances
- Ils assurent que tous les développeurs utilisent exactement les mêmes versions
- Ils améliorent la reproductibilité et la cohérence du projet

## Prochaines étapes

Voir le fichier `BACKLOG.md` pour les évolutions futures du projet, notamment :
1. Développement d'une extension Chrome
2. Développement d'une application mobile 