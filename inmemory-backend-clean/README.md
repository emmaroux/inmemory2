# InMemory Backend

Backend de l'application InMemory, développé avec Strapi.

## Description

InMemory est une plateforme collaborative permettant aux équipes de partager et d'organiser des ressources (articles, tutoriels, outils, etc.). Chaque équipe peut voter pour les ressources qu'elle trouve utiles et laisser des commentaires.

## Technologies

- **Backend** : Strapi v4
- **Base de données** : PostgreSQL
- **Authentification** : JWT via Strapi
- **Seeding** : Scripts personnalisés

## Installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/emmaroux/inmemory-backend.git
cd inmemory-backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. **Démarrer le serveur de développement**
```bash
npm run develop
```

## Structure du Projet

```
.
├── config/                 # Configuration de Strapi
├── database/              # Migrations
├── public/               # Fichiers publics
├── scripts/              # Scripts utilitaires
│   └── seed.js          # Script de seeding
├── src/
│   ├── api/             # Types de contenu
│   │   ├── resource/    # Ressources
│   │   ├── team/       # Équipes
│   │   ├── comment/    # Commentaires
│   │   ├── vote/       # Votes
│   │   └── category/   # Catégories
│   └── extensions/     # Extensions Strapi
└── types/              # Types TypeScript
```

## Types de Contenu

- **Resource** : Articles, tutoriels, outils
- **Team** : Équipes utilisatrices
- **Vote** : Votes des équipes sur les ressources
- **Comment** : Commentaires des équipes
- **Category** : Catégories de ressources

## Seeding

Le seeding est configuré pour s'exécuter automatiquement au démarrage :

1. Un utilisateur test est créé
2. Une catégorie test est créée
3. Une ressource test est créée

Pour forcer le seeding :
1. Arrêter Strapi (Ctrl+C)
2. Redémarrer : `npm run develop`

## Documentation

La documentation technique complète est disponible dans le fichier `DOCUMENTATION.md`.

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: ajout d'une fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

[À définir]

## Contact

Emmanuelle Leroux - [@EmmanuelleRoux](https://github.com/emmaroux)
