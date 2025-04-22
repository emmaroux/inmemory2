# Message à l'équipe Front-End - Résolution des problèmes d'API

## Modifications effectuées côté Backend

Bonjour à toute l'équipe front,

Nous avons effectué plusieurs modifications importantes sur l'API pour résoudre les problèmes de relations que vous avez rencontrés :

1. **Correction de la configuration API** :
   - Suppression des transformations personnalisées qui interféraient avec le format standard de Strapi
   - Utilisation du format de réponse standard de Strapi v5

2. **Création de fichiers de routes manquants** :
   - Configuration des routes pour les ressources, votes et catégories
   - Désactivation de l'authentification (`auth: false`) pour faciliter les tests

3. **Vérification des services** :
   - Confirmation que tous les services nécessaires sont présents
   - Utilisation des services standards de Strapi pour chaque entité

4. **Mise à jour de la documentation** :
   - Documentation précise de la structure de réponse de Strapi v5
   - Exemples d'accès aux données imbriquées

## Comment utiliser l'API mise à jour

### 1. Syntaxe pour les requêtes avec relations

Pour récupérer les ressources avec leurs relations, utilisez cette syntaxe :

```typescript
// URL de base avec toutes les relations
const url = 'http://localhost:1337/api/resources?populate[category]=true&populate[votes][populate][team]=true&populate[votes][populate][user]=true&populate[comments]=true';

// Version simplifiée pour toutes les relations de premier niveau
const urlSimple = 'http://localhost:1337/api/resources?populate=*';

// Pour des relations plus profondes
const urlAvance = 'http://localhost:1337/api/resources?populate[votes][populate][team][populate][users]=true';
```

### 2. Accès aux données dans la structure Strapi v5

La structure de réponse standard de Strapi v5 utilise :
- Un objet `data` qui contient les résultats
- Un objet `attributes` pour les propriétés de chaque entité
- Des objets `data` imbriqués pour les relations

Exemple d'accès :

```typescript
fetch('http://localhost:1337/api/resources?populate[category]=true')
  .then(response => response.json())
  .then(result => {
    // Accès aux ressources
    const resources = result.data;
    
    resources.forEach(resource => {
      // Propriétés de base
      const id = resource.id;
      const title = resource.attributes.title;
      
      // Accès à la relation catégorie
      if (resource.attributes.category && resource.attributes.category.data) {
        const categoryId = resource.attributes.category.data.id;
        const categoryName = resource.attributes.category.data.attributes.name;
        console.log(`Resource ${title} (${id}) has category: ${categoryName} (${categoryId})`);
      }
    });
  });
```

### 3. Pagination

La pagination reste inchangée :

```typescript
// Page 1 avec 10 éléments par page
const url = 'http://localhost:1337/api/resources?pagination[page]=1&pagination[pageSize]=10&populate=*';

fetch(url)
  .then(response => response.json())
  .then(result => {
    const resources = result.data;
    const pagination = result.meta.pagination;
    
    console.log(`Showing ${resources.length} of ${pagination.total} resources (page ${pagination.page}/${pagination.pageCount})`);
  });
```

## Dépannage

### Si les relations sont toujours manquantes

1. **Vérifiez que le serveur a été redémarré** :
   ```bash
   npm run develop
   ```

2. **Essayez d'abord une requête simple** :
   ```
   http://localhost:1337/api/resources?populate=category
   ```

3. **Vérifiez la structure de la réponse** :
   ```javascript
   fetch('http://localhost:1337/api/resources?populate=category')
     .then(response => response.json())
     .then(result => console.log(JSON.stringify(result, null, 2)));
   ```

4. **Utilisez les outils de développement** pour inspecter les requêtes et réponses exactes.

### Si vous avez une erreur 403 Forbidden

Vérifiez dans le panneau d'administration Strapi :
1. Accédez à `Settings > USERS & PERMISSIONS PLUGIN > Roles > Public`
2. Assurez-vous que les permissions de lecture sont activées pour toutes les entités
3. Sauvegardez et redémarrez Strapi

## Exemple complet d'utilisation

```typescript
// Fonction pour récupérer des ressources avec leurs relations
async function fetchResourcesWithRelations() {
  const url = 'http://localhost:1337/api/resources?populate[category]=true&populate[votes][populate][team]=true&populate[comments]=true';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    const resources = result.data;
    
    // Transformation des données pour les adapter à votre interface
    return resources.map(resource => {
      // Données de base de la ressource
      const transformed = {
        id: resource.id,
        ...resource.attributes,
        
        // Transformation des relations
        category: resource.attributes.category?.data 
          ? {
              id: resource.attributes.category.data.id,
              ...resource.attributes.category.data.attributes
            }
          : null,
          
        votes: resource.attributes.votes?.data 
          ? resource.attributes.votes.data.map(vote => ({
              id: vote.id,
              ...vote.attributes,
              team: vote.attributes.team?.data 
                ? {
                    id: vote.attributes.team.data.id,
                    ...vote.attributes.team.data.attributes
                  }
                : null
            }))
          : [],
          
        comments: resource.attributes.comments?.data 
          ? resource.attributes.comments.data.map(comment => ({
              id: comment.id,
              ...comment.attributes
            }))
          : []
      };
      
      return transformed;
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
}
```

## Prochaines étapes

1. Testez ces modifications et faites-nous savoir si les problèmes persistent
2. Si vous avez des questions ou rencontrez des difficultés, n'hésitez pas à nous contacter
3. Une fois que vous aurez confirmé que tout fonctionne, nous pourrons finaliser la documentation

Cordialement,
L'équipe Backend 