# InMemory Web

Une application web moderne construite avec Next.js 14, React 18, et Tailwind CSS pour afficher et gérer une grille de ressources.

## 🚀 Technologies Utilisées

- **Next.js 14.2.28** - Framework React avec rendu côté serveur
- **React & React DOM 18.2.0** - Bibliothèque UI
- **Tailwind CSS 3.4.1** - Framework CSS utilitaire
- **TypeScript** - Typage statique
- **Police Geist** - Police système moderne
- **Strapi** - Headless CMS pour la gestion des données

## 🛠 Installation

1. Cloner le repository
2. Installer les dépendances :
```bash
npm install
```
3. Lancer le serveur de développement :
```bash
npm run dev
```

## 📝 Points Techniques Importants

### Configuration de la Police Geist

La police Geist est configurée dans `src/app/layout.tsx` :
```typescript
import { GeistSans, GeistMono } from "geist/font";

const geistSans = GeistSans;
const geistMono = GeistMono;
```

### Structure des Composants

- `ResourceGrid` - Grille principale affichant les ressources
- `ResourceGridItem` - Carte individuelle pour chaque ressource
  - Taille maximale : 300px de large
  - Hauteur maximale : 140px
  - Tailles de police optimisées pour la lisibilité

### Intégration avec l'API Strapi

L'application utilise une API Strapi pour récupérer les données des ressources, catégories, votes et commentaires. L'intégration avec l'API présente quelques particularités :

#### Format de Données à Plat

Contrairement au format standard Strapi v5 qui utilise une structure d'attributs imbriqués, l'API utilisée renvoie un format de données "à plat" :

```javascript
// Format standard Strapi v5 (avec attributes imbriqués)
{
  "data": [{
    "id": 1,
    "attributes": {
      "title": "Titre de la ressource",
      "description": "Description...",
      "category": {
        "data": {
          "id": 1,
          "attributes": { "name": "Catégorie" }
        }
      }
    }
  }]
}

// Format à plat utilisé dans ce projet
{
  "data": [{
    "id": 1,
    "title": "Titre de la ressource",
    "description": "Description...",
    "category": {
      "id": 1,
      "name": "Catégorie"
    }
  }]
}
```

#### Transformation des Données

Dans le fichier `src/app/page.tsx`, nous avons implémenté une transformation des données pour s'adapter à ce format :

```typescript
formattedResources = resourcesData.data.map((item: any) => ({
  id: item.id,
  documentId: item.documentId || `resource-${item.id}`,
  title: item.title || '',
  description: item.description || '',
  // ... autres propriétés
  category: item.category ? {
    id: item.category.id,
    name: item.category.name || '',
    // ... autres propriétés de la catégorie
  } : null,
}));
```

#### Configuration des Images

Les images distantes sont configurées dans `next.config.js` pour autoriser les domaines :

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
      port: '',
      pathname: '/**',
    },
  ],
},
```

Pour gérer les erreurs de chargement des images, un état `imageError` a été ajouté dans les composants `ResourceGridItem` et `ResourceModal` afin d'afficher un placeholder avec les initiales du titre en cas d'échec.

### Données Mock

Les données de test sont importées depuis `./data/mockData` et incluent :
- Resources
- Teams
- Votes
- Comments

### Thème et Style

- Fond blanc (`bg-white`)
- Police système Geist pour une meilleure lisibilité
- Design responsive et moderne
- Composants optimisés pour les performances

## 🔍 Points d'Attention

1. Toujours utiliser les variables de police Geist :
   ```typescript
   className={`${geistSans.variable} ${geistMono.variable}`}
   ```

2. Les cartes de ressources sont limitées en taille pour une meilleure expérience utilisateur

3. L'application utilise les dernières versions stables des dépendances pour éviter les problèmes de compatibilité

4. Pour utiliser l'API en local, assurez-vous que le serveur Strapi est en cours d'exécution sur `http://localhost:1337`

## 📦 Dépendances Principales

```json
{
  "next": "^14.2.28",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "geist": "latest"
}
```

## 🤝 Contribution

1. Créer une branche pour votre fonctionnalité
2. Commiter vos changements
3. Créer une Pull Request

## 📄 License

MIT
