# Standardisation de l'API

## Changements effectués

Nous avons standardisé l'API en effectuant les modifications suivantes :

1. **Uniformisation des contrôleurs**
   - Suppression des implémentations personnalisées
   - Utilisation des contrôleurs standards de Strapi
   - Garantie d'un format de réponse cohérent entre toutes les entités

2. **Population automatique des relations**
   - Chaque contrôleur peuple automatiquement ses relations si aucune population n'est spécifiée
   - Format de population standardisé pour tous les points d'entrée

3. **Simplification de la configuration API**
   - Suppression des transformations personnalisées
   - Utilisation du format de réponse standard de Strapi v5

## Format de réponse standard

Toutes les requêtes renvoient désormais une réponse au format standard Strapi v5 :

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "L'IA révolutionne la médecine",
        "createdAt": "2025-04-21T12:59:52.052Z",
        "updatedAt": "2025-04-21T20:52:17.686Z",
        "publishedAt": "2025-04-21T20:52:17.683Z",
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Technologie"
            }
          }
        },
        "votes": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "team": {
                  "data": {
                    "id": 1,
                    "attributes": {
                      "name": "Équipe Alpha"
                    }
                  }
                }
              }
            }
          ]
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

## Utilisation des relations

### 1. Population automatique

Les relations sont automatiquement peuplées si aucun paramètre `populate` n'est spécifié.

### 2. Population explicite

Pour contrôler les relations à peupler, utilisez la syntaxe standard Strapi :

```
/api/resources?populate[category]=true&populate[votes][populate][team]=true
```

### 3. Population de toutes les relations de premier niveau

```
/api/resources?populate=*
```

## Accès aux données dans le format standard

```javascript
// Accès aux attributs de base
const title = resource.attributes.title;

// Accès à une relation
const categoryName = resource.attributes.category.data.attributes.name;

// Accès à une collection de relations
const votes = resource.attributes.votes.data;
votes.forEach(vote => {
  const teamName = vote.attributes.team.data.attributes.name;
});
```

## Migration depuis l'ancienne approche

Si vous utilisiez auparavant les adaptateurs pour compenser la structure non standard, vous pouvez désormais :

1. Utiliser directement l'API avec le format standard
2. Remplacer l'utilisation des adaptateurs par des appels API directs
3. Mettre à jour vos composants pour accéder aux données selon la structure standard 