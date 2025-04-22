# Documentation API Front

## Endpoints disponibles

### Ressources
```typescript
GET /api/resources
```

#### Paramètres de requête
```typescript
{
  pagination: {
    page: number,      // Page actuelle (défaut: 1)
    pageSize: number   // Taille de la page (défaut: 25)
  },
  populate: {
    category: true,    // Population de la catégorie
    votes: {
      populate: {
        team: true,    // Population de l'équipe pour chaque vote
        user: true     // Population de l'utilisateur pour chaque vote
      }
    },
    comments: true     // Population des commentaires
  }
}
```

#### Exemple d'URL
```typescript
http://localhost:1337/api/resources?pagination[page]=1&pagination[pageSize]=10&populate[category]=true&populate[votes][populate][team]=true&populate[votes][populate][user]=true&populate[comments]=true
```

#### Structure de la réponse
```typescript
{
  data: [
    {
      id: number,
      attributes: {
        documentId: string,
        title: string,
        imageUrl: string | null,
        link: string | null,
        description: string | null,
        createdAt: string,    // Format ISO
        updatedAt: string,    // Format ISO
        publishedAt: string,  // Format ISO
        category: {
          data: {
            id: number,
            attributes: {
              name: string,
              // ... autres champs de la catégorie
            }
          }
        },
        votes: {
          data: [
            {
              id: number,
              attributes: {
                team: {
                  data: {
                    id: number,
                    attributes: {
                      name: string,
                      // ... autres champs de l'équipe
                    }
                  }
                },
                user: {
                  data: {
                    id: number,
                    attributes: {
                      username: string,
                      // ... autres champs de l'utilisateur
                    }
                  }
                }
              }
            }
          ]
        },
        comments: {
          data: [
            {
              id: number,
              attributes: {
                content: string,
                date: string,
                // ... autres champs du commentaire
              }
            }
          ]
        }
      }
    }
  ],
  meta: {
    pagination: {
      page: number,
      pageSize: number,
      pageCount: number,
      total: number
    }
  }
}
```

## Points importants

1. **Structure de la réponse (Standard Strapi v5)**
   - Les champs de base sont dans l'objet `attributes`
   - Les relations sont dans des objets `data` avec leur propre structure `attributes`
   - Les collections sont dans des tableaux sous la propriété `data`

2. **Authentification**
   - Les endpoints sont accessibles sans authentification (`auth: false`)
   - Aucun token n'est nécessaire pour les requêtes

3. **Pagination**
   - Taille de page par défaut : 25 éléments
   - Possibilité de modifier la taille de page avec `pageSize`
   - Les métadonnées de pagination sont incluses dans la réponse

4. **Champs optionnels**
   - `imageUrl`: peut être `null`
   - `link`: peut être `null`
   - `description`: peut être `null`

5. **Relations**
   - Les relations sont accessibles via le paramètre `populate`
   - Possibilité de population imbriquée (ex: votes.team)
   - Toutes les relations sont configurées en `oneToMany` ou `manyToOne`

## Exemples de requêtes

### Récupérer toutes les ressources avec leurs relations
```typescript
fetch('http://localhost:1337/api/resources?populate[category]=true&populate[votes][populate][team]=true&populate[votes][populate][user]=true&populate[comments]=true')
  .then(response => response.json())
  .then(data => {
    // Accès aux données
    const resources = data.data;
    resources.forEach(resource => {
      const title = resource.attributes.title;
      const categoryName = resource.attributes.category.data.attributes.name;
      
      // Accès aux votes
      const votes = resource.attributes.votes.data;
      votes.forEach(vote => {
        const teamName = vote.attributes.team.data.attributes.name;
        const userName = vote.attributes.user.data.attributes.username;
      });
      
      // Accès aux commentaires
      const comments = resource.attributes.comments.data;
      comments.forEach(comment => {
        const content = comment.attributes.content;
        const date = comment.attributes.date;
      });
    });
  });
```

### Récupérer une seule ressource avec ses relations
```typescript
fetch('http://localhost:1337/api/resources/1?populate[category]=true&populate[votes][populate][team]=true&populate[votes][populate][user]=true&populate[comments]=true')
  .then(response => response.json())
  .then(data => {
    const resource = data.data.attributes;
    const title = resource.title;
    
    // Accès à la catégorie
    const category = resource.category.data.attributes;
    const categoryName = category.name;
    
    // Accès aux votes
    const votes = resource.votes.data;
    votes.forEach(vote => {
      const teamName = vote.attributes.team.data.attributes.name;
    });
    
    // Accès aux commentaires
    const comments = resource.comments.data;
    comments.forEach(comment => {
      const content = comment.attributes.content;
    });
  });
```

## Gestion des erreurs

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

## Version de l'API
- Strapi v5.12.5 (Community Edition) 