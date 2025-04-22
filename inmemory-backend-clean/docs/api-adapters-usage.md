# Guide d'utilisation des adaptateurs d'API

Ce guide explique comment utiliser les adaptateurs d'API fournis pour simplifier l'intégration avec l'API Strapi personnalisée.

## Installation

Copiez le dossier `src/api-adapters` dans votre projet frontend, puis importez les outils nécessaires :

```javascript
// Import du service d'API pour une utilisation directe
import { ApiService } from './api-adapters';

// Import des hooks React
import { useResources, useResource } from './api-adapters';

// Ou tout importer à la fois
import ApiAdapters from './api-adapters';
```

## 1. Récupération des ressources avec leurs relations

### Option 1 : Utilisation du hook React `useResources`

```jsx
import React from 'react';
import { useResources } from './api-adapters';

function ResourcesList() {
  const { 
    resources,
    isLoading,
    error,
    pagination,
    changePage,
    changePageSize,
    createVote,
    createComment
  } = useResources({
    page: 1,
    pageSize: 10,
    // Filtres optionnels
    filters: {
      title: 'Recherche'
    }
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1>Liste des ressources</h1>
      
      {resources.map(resource => (
        <div key={resource.id}>
          <h2>{resource.title}</h2>
          <p>Catégorie: {resource.category?.name}</p>
          
          <h3>Votes ({resource.votes?.length || 0})</h3>
          <ul>
            {resource.votes?.map(vote => (
              <li key={vote.id}>
                Équipe: {vote.team?.name}
              </li>
            ))}
          </ul>
          
          <h3>Commentaires ({resource.comments?.length || 0})</h3>
          <ul>
            {resource.comments?.map(comment => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
          
          <button onClick={() => createVote({ team: 1 })}>
            Voter pour cette ressource
          </button>
          
          <button onClick={() => createComment({ 
            content: 'Nouveau commentaire',
            date: new Date().toISOString()
          })}>
            Commenter
          </button>
        </div>
      ))}
      
      <div className="pagination">
        <button 
          disabled={pagination.page === 1}
          onClick={() => changePage(pagination.page - 1)}
        >
          Précédent
        </button>
        
        <span>
          Page {pagination.page} sur {pagination.pageCount}
        </span>
        
        <button 
          disabled={pagination.page === pagination.pageCount}
          onClick={() => changePage(pagination.page + 1)}
        >
          Suivant
        </button>
        
        <select 
          value={pagination.pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
        >
          <option value="10">10 par page</option>
          <option value="25">25 par page</option>
          <option value="50">50 par page</option>
        </select>
      </div>
    </div>
  );
}
```

### Option 2 : Utilisation directe du service d'API

```javascript
import { ApiService } from './api-adapters';

async function fetchResourcesWithRelations() {
  try {
    const resources = await ApiService.getResourcesWithRelations({
      page: 1,
      pageSize: 25,
      filters: {
        // Filtres optionnels
      }
    });
    
    console.log('Ressources avec relations:', resources);
    
    // Les ressources incluent directement leurs catégories, votes et commentaires
    resources.forEach(resource => {
      console.log(`Ressource ${resource.title}:`);
      console.log(`- Catégorie: ${resource.category?.name}`);
      console.log(`- Votes: ${resource.votes?.length}`);
      console.log(`- Commentaires: ${resource.comments?.length}`);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ressources:', error);
  }
}
```

## 2. Récupération d'une ressource spécifique

### Option 1 : Utilisation du hook React `useResource`

```jsx
import React from 'react';
import { useResource } from './api-adapters';

function ResourceDetail({ resourceId }) {
  const {
    resource,
    isLoading,
    error,
    refresh,
    createVote,
    createComment
  } = useResource(resourceId);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!resource) return <div>Ressource non trouvée</div>;

  return (
    <div>
      <h1>{resource.title}</h1>
      
      <p>Catégorie: {resource.category?.name}</p>
      <p>Description: {resource.description}</p>
      
      <h2>Votes ({resource.votes?.length || 0})</h2>
      <ul>
        {resource.votes?.map(vote => (
          <li key={vote.id}>
            Équipe: {vote.team?.name}
          </li>
        ))}
      </ul>
      
      <h2>Commentaires ({resource.comments?.length || 0})</h2>
      <ul>
        {resource.comments?.map(comment => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
      
      <button onClick={() => createVote({ team: 1 })}>
        Voter pour cette ressource
      </button>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const content = e.target.comment.value;
        createComment({ 
          content,
          date: new Date().toISOString()
        });
        e.target.reset();
      }}>
        <textarea name="comment" required></textarea>
        <button type="submit">Ajouter un commentaire</button>
      </form>
    </div>
  );
}
```

### Option 2 : Utilisation directe du service d'API

```javascript
import { ApiService } from './api-adapters';

async function fetchResourceDetail(resourceId) {
  try {
    const resource = await ApiService.getResourceWithRelations(resourceId);
    
    console.log('Détail de la ressource:', resource);
    
    // La ressource inclut directement sa catégorie, ses votes et ses commentaires
    if (resource) {
      console.log(`Ressource ${resource.title}:`);
      console.log(`- Catégorie: ${resource.category?.name}`);
      console.log(`- Votes: ${resource.votes?.length}`);
      console.log(`- Commentaires: ${resource.comments?.length}`);
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération de la ressource ${resourceId}:`, error);
  }
}
```

## 3. Création de votes et commentaires

### Option 1 : Utilisation des hooks React

Les hooks `useResources` et `useResource` fournissent des méthodes pour créer des votes et des commentaires :

```jsx
function VoteButton({ resourceId, teamId }) {
  const { createVote } = useResource(resourceId);
  
  const handleVote = async () => {
    try {
      await createVote({ team: teamId });
      alert('Vote créé avec succès !');
    } catch (error) {
      alert(`Erreur lors de la création du vote: ${error.message}`);
    }
  };
  
  return (
    <button onClick={handleVote}>
      Voter pour l'équipe {teamId}
    </button>
  );
}
```

### Option 2 : Utilisation directe du service d'API

```javascript
import { ApiService } from './api-adapters';

async function createNewVote(resourceId, teamId) {
  try {
    const voteData = {
      resource: resourceId,
      team: teamId,
    };
    
    const newVote = await ApiService.createVote(voteData);
    console.log('Vote créé:', newVote);
    
    return newVote;
  } catch (error) {
    console.error('Erreur lors de la création du vote:', error);
    throw error;
  }
}

async function createNewComment(resourceId, content) {
  try {
    const commentData = {
      resource: resourceId,
      content,
      date: new Date().toISOString(),
    };
    
    const newComment = await ApiService.createComment(commentData);
    console.log('Commentaire créé:', newComment);
    
    return newComment;
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    throw error;
  }
}
```

## 4. Gestion du cache

Le service d'API inclut un système de cache pour améliorer les performances. Par défaut, les données sont mises en cache pendant 5 minutes. Vous pouvez gérer le cache manuellement :

```javascript
import { ApiService } from './api-adapters';

// Vider le cache entier
ApiService.clearCache();

// Invalider une entrée spécifique
ApiService.invalidateCache('resource_1');

// Invalider toutes les entrées correspondant à un modèle
ApiService.invalidateCache(/^resources_/);
```

## Dépannage

### Problème : Les relations ne sont pas chargées

Le service utilise des requêtes séparées pour charger les relations. Vérifiez que :

1. L'API est accessible (`http://localhost:1337/api/resources`, etc.)
2. Les identifiants des ressources sont corrects
3. Les permissions dans Strapi permettent l'accès aux entités liées

### Problème : Erreurs 403 Forbidden

Vérifiez les permissions dans le panneau d'administration Strapi :
- Accédez à Settings > USERS & PERMISSIONS PLUGIN > Roles > Public
- Assurez-vous que les permissions de lecture sont activées pour toutes les entités
- Sauvegardez et redémarrez Strapi

### Problème : Performances lentes

1. Augmentez la durée du cache dans `ApiService.js` :
   ```javascript
   const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
   ```

2. Limitez le nombre d'éléments par page :
   ```javascript
   useResources({ pageSize: 10 })
   ```

## Support

Pour toute question ou problème, contactez l'équipe backend à [adresse email] ou via [canal de communication]. 