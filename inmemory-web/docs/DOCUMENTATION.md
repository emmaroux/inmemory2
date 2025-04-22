# InMemory Frontend

## Documentation Technique

### Contexte du Projet

InMemory est une plateforme collaborative permettant aux équipes de partager et d'organiser des ressources (articles, tutoriels, outils, etc.). Chaque équipe peut voter pour les ressources qu'elle trouve utiles. L'objectif est de créer une base de connaissances partagée et organisée par les équipes.

### Architecture Technique

- Frontend : Next.js 14 avec TypeScript
- Backend : Strapi (API REST)
- Styles : Tailwind CSS

## Structure du Projet

```
.
├── src/                    # Code source
│   ├── app/               # Application Next.js
│   │   ├── components/    # Composants React
│   │   │   ├── resources/ # Composants liés aux ressources
│   │   │   └── ui/        # Composants UI réutilisables
│   │   ├── types/        # Types TypeScript
│   │   └── page.tsx      # Page principale
│   └── styles/           # Styles globaux
├── public/               # Fichiers statiques
├── docs/                # Documentation
├── .env.local           # Variables d'environnement locales
├── .env.example         # Exemple de variables d'environnement
├── package.json         # Dépendances
└── README.md           # Documentation rapide
```

## Types de Données

### Resource (Ressource)
```typescript
interface Resource {
  id: number;
  title: string;
  content: string;
  date: string;
  location: string;
  status: 'draft' | 'published';
  imageUrl: string | null;
  link: string | null;
  category: {
    id: number;
    name: string;
    description: string;
  };
  votes: Vote[];
}
```

### Team (Équipe)
```typescript
interface Team {
  id: number;
  name: string;
  color: string;
  users?: User[];
  votes?: Vote[];
}
```

### Vote
```typescript
interface Vote {
  id: number;
  value: number;
  user: {
    id: number;
    username: string;
  };
  resource: {
    id: number;
    title: string;
  };
  team: {
    id: number;
    name: string;
    color: string;
  };
}
```

### Category (Catégorie)
```typescript
interface Category {
  id: number;
  name: string;
  description: string;
  resources?: Resource[];
}
```

## Composants Principaux

### ResourceGrid
Grille affichant les ressources sous forme de cartes.
- Props :
  - `resources: Resource[]` : Liste des ressources à afficher

### ResourceGridItem
Carte individuelle pour une ressource.
- Props :
  - `resource: Resource` : Données de la ressource
  - `onClick: () => void` : Fonction appelée lors du clic
- Fonctionnalités :
  - Affichage du statut (brouillon/publié)
  - Gestion des images avec fallback
  - Affichage des votes
  - Formatage des dates
  - Gestion des données manquantes

### ResourceModal
Modal affichant les détails d'une ressource.
- Props :
  - `resource: Resource` : Ressource à afficher en détail
  - `onClose: () => void` : Fonction de fermeture
- Fonctionnalités :
  - Vue détaillée de la ressource
  - Affichage des votes par équipe
  - Lien externe vers la ressource
  - Description de la catégorie

## API Endpoints

### Authentification
```typescript
POST /api/auth/local
Body: {
  identifier: string;
  password: string;
}
```

### Ressources
```typescript
// Liste des ressources avec pagination
GET /api/resources?pagination[page]=${page}&pagination[pageSize]=${pageSize}

// Ressource unique
GET /api/resources/${id}
```

### Catégories
```typescript
// Liste des catégories
GET /api/categories
```

### Votes
```typescript
// Liste des votes
GET /api/votes

// Créer un vote
POST /api/votes
```

## Bonnes Pratiques

### Gestion des Données Manquantes
```typescript
// Utilisation de valeurs par défaut
const title = resource.title || 'Sans titre';
const location = resource.location || 'Lieu inconnu';
```

### Gestion des États
```typescript
// États de chargement et d'erreur
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Logs en Développement
```typescript
console.log("=== DÉBUT DU CHARGEMENT ===");
console.log("Structure complète:", JSON.stringify(data, null, 2));
console.log("=== FIN DU CHARGEMENT ===");
```

## Leçons Apprises

1. **Architecture des Données**
   - Simplification de la structure des données
   - Utilisation efficace de TypeScript
   - Gestion robuste des cas d'erreur

2. **Communication Inter-équipes**
   - Documentation claire des changements
   - Tests réguliers des intégrations
   - Feedback rapide sur les problèmes

3. **UI/UX**
   - Design responsive
   - Gestion des états de chargement
   - Feedback visuel pour l'utilisateur

## Prochaines Évolutions

1. **Fonctionnalités**
   - Système de votes complet
   - Filtrage par catégorie
   - Recherche avancée
   - Tri des ressources

2. **Optimisations**
   - Mise en cache des données
   - Chargement progressif
   - Optimisation des images

3. **Maintenance**
   - Tests automatisés
   - Documentation continue
   - Monitoring des performances

## Contact

Pour toute question technique :
- Frontend : [Équipe Frontend]
- Backend : [Équipe Backend]
- Design : [Équipe Design]
