# Documentation d'Intégration Strapi pour InMemory Web

## Introduction

Ce document détaille l'intégration entre l'application frontend InMemory Web (Next.js) et le backend Strapi, en mettant particulièrement l'accent sur la gestion du format de données.

## Format des Données API

### Format Standard Strapi v5 vs Format Utilisé

Strapi v5 utilise généralement une structure de réponse API avec des attributs imbriqués. Cependant, l'API backend utilisée dans ce projet renvoie un format "à plat", ce qui a nécessité une adaptation spécifique.

#### Comparaison des Formats

**Format Standard Strapi v5 (avec attributs imbriqués) :**
```json
{
  "data": [
    {
      "id": 47,
      "attributes": {
        "documentId": "jqfjfjkx31e6hdsogcymie7h",
        "title": "L'IA révolutionne la médecine",
        "description": "Comment l'intelligence artificielle transforme le diagnostic médical...",
        "createdAt": "2025-04-21T23:00:50.183Z",
        "category": {
          "data": {
            "id": 239,
            "attributes": {
              "name": "IA",
              "createdAt": "2025-04-21T23:00:50.165Z"
            }
          }
        }
      }
    }
  ],
  "meta": {}
}
```

**Format Utilisé (à plat) :**
```json
{
  "data": [
    {
      "id": 47,
      "documentId": "jqfjfjkx31e6hdsogcymie7h",
      "title": "L'IA révolutionne la médecine",
      "description": "Comment l'intelligence artificielle transforme le diagnostic médical...",
      "createdAt": "2025-04-21T23:00:50.183Z",
      "category": {
        "id": 239,
        "name": "IA",
        "createdAt": "2025-04-21T23:00:50.165Z"
      }
    }
  ],
  "meta": {}
}
```

## Adaptation dans le Code

Pour gérer cette différence, nous avons adapté le code qui traite les réponses API :

### Transformation des Données dans `src/app/page.tsx`

```typescript
// Initialisation des tableaux
let formattedResources: Resource[] = [];
let formattedCategories: Category[] = [];

// Pour les ressources
if (Array.isArray(resourcesData.data)) {
  formattedResources = resourcesData.data.map((item: any) => ({
    id: item.id,
    documentId: item.documentId || `resource-${item.id}`,
    title: item.title || '',
    description: item.description || '',
    imageUrl: item.imageUrl || null,
    link: item.link || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt,
    category: item.category ? {
      id: item.category.id,
      documentId: item.category.documentId || `category-${item.category.id}`,
      name: item.category.name || '',
      createdAt: item.category.createdAt,
      updatedAt: item.category.updatedAt,
      publishedAt: item.category.publishedAt,
      description: item.category.description || ''
    } : null,
    votes: item.votes?.map((vote: any) => ({
      id: vote.id,
      documentId: vote.documentId || `vote-${vote.id}`,
      value: vote.value || 0,
      createdAt: vote.createdAt,
      // ... autres propriétés des votes
    })) || [],
    comments: item.comments?.map((comment: any) => ({
      id: comment.id,
      documentId: comment.documentId || `comment-${comment.id}`,
      content: comment.content || '',
      createdAt: comment.createdAt
    })) || []
  }));
}

// Pour les catégories
if (Array.isArray(categoriesData.data)) {
  formattedCategories = categoriesData.data.map((item: any) => ({
    id: item.id,
    documentId: item.documentId || `category-${item.id}`,
    name: item.name || '',
    description: item.description || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt
  }));
}
```

### Gestion des Champs Manquants

Pour gérer les cas où certains champs pourraient être absents dans la réponse API, nous avons mis en place des valeurs par défaut :

```typescript
documentId: item.documentId || `resource-${item.id}`,
title: item.title || '',
```

## Population des Relations

### Format de l'URL pour Récupérer les Relations

La documentation de l'API indique d'utiliser le paramètre `populate` pour récupérer les relations :

```
GET /api/resources?populate=*
```

Ce format permet de récupérer toutes les relations en une seule requête. On peut également spécifier des relations précises :

```
GET /api/resources?populate[0]=votes&populate[1]=comments
```

## Gestion des Images

### Configuration dans Next.js

Pour autoriser les images distantes des domaines externes, nous avons configuré `next.config.js` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
```

### Gestion des Erreurs d'Images

Pour gérer les cas où les images ne peuvent pas être chargées, nous avons implémenté un système de fallback. Dans les composants `ResourceGridItem` et `ResourceModal`, un état `imageError` est utilisé :

```typescript
const [imageError, setImageError] = useState(false);

// ...

{resource.imageUrl && !imageError ? (
  <Image
    src={resource.imageUrl}
    alt={resource.title}
    fill
    className="object-cover"
    onError={() => setImageError(true)}
  />
) : (
  <div className={`h-48 w-full ${bgColor} flex items-center justify-center`}>
    <span className="text-white text-3xl font-bold">{initials}</span>
  </div>
)}
```

## Conclusion

L'intégration avec l'API Strapi nécessite une attention particulière au format des données, qui s'écarte du format standard de Strapi v5. Notre approche s'est adaptée à cette différence tout en maintenant la flexibilité nécessaire pour s'ajuster à d'éventuelles évolutions du backend.

Cette documentation devrait être mise à jour si le format des données de l'API évolue, ou si l'API passe au format standard de Strapi v5 avec attributs imbriqués. 