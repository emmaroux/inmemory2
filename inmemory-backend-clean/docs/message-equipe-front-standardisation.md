# Message à l'équipe Frontend : Standardisation de l'API

Bonjour à toute l'équipe frontend,

Bonne nouvelle ! Nous avons trouvé et résolu le problème fondamental qui causait les incohérences dans l'API. Nous n'avons plus besoin des adaptateurs complexes que nous avions créés précédemment.

## Ce qui a été corrigé

1. **Problème identifié** : Les contrôleurs des différentes entités (ressources, catégories, votes, commentaires) avaient des implémentations personnalisées qui transformaient les réponses de façon incohérente.

2. **Solution appliquée** : Nous avons standardisé tous les contrôleurs pour utiliser l'implémentation standard de Strapi. Cela garantit que :
   - Toutes les entités ont le même format de réponse
   - Les relations peuvent être peuplées avec la syntaxe standard
   - Le format est conforme à la documentation officielle de Strapi v5

## Ce que cela signifie pour vous

### 1. Format de réponse standard

Toutes les requêtes renvoient maintenant un format uniforme avec :
- `data` contenant les entités
- `attributes` contenant les propriétés
- `data` imbriqués pour les relations

```javascript
// Exemple de structure pour une ressource avec sa catégorie
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "L'IA révolutionne la médecine",
      "category": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "Technologie"
          }
        }
      }
    }
  }
}
```

### 2. Population simple des relations

Vous pouvez maintenant utiliser la syntaxe standard pour peupler les relations :

```javascript
// Récupérer les ressources avec leurs relations
fetch('/api/resources?populate[category]=true&populate[votes][populate][team]=true')
  .then(response => response.json())
  .then(data => {
    // Utiliser les données normalisées
  });
```

Ou simplement pour toutes les relations de premier niveau :
```javascript
fetch('/api/resources?populate=*')
```

### 3. Population automatique

Nous avons configuré les contrôleurs pour peupler automatiquement les relations principales si aucun paramètre `populate` n'est spécifié. Cela signifie que vous pouvez simplement appeler :

```javascript
fetch('/api/resources')
```

Et vous obtiendrez déjà les relations `category`, `votes` (avec `team` et `user`) et `comments`.

## Comment migrer depuis les adaptateurs

Nous vous recommandons de :

1. **Supprimer progressivement les adaptateurs** créés précédemment
2. **Mettre à jour vos composants** pour accéder aux données selon la structure standard
3. **Utiliser directement l'API** avec les fonctions `fetch` ou votre client HTTP préféré

Exemple d'accès aux données :
```javascript
// Avant (avec adaptateurs)
const title = resource.title;
const categoryName = resource.category?.name;

// Maintenant (format standard)
const title = resource.attributes.title;
const categoryName = resource.attributes.category?.data?.attributes?.name;
```

## Documentation détaillée

Pour plus de détails sur les changements effectués et des exemples d'utilisation, consultez le document [docs/standardisation-api.md](./standardisation-api.md).

## Prochaines étapes

1. Nous allons redémarrer le serveur pour que les changements prennent effet
2. Nous vous invitons à tester les différents endpoints et à nous faire part de vos retours
3. Si tout fonctionne comme prévu, nous pourrons officiellement retirer les adaptateurs

N'hésitez pas à nous contacter si vous avez des questions ou si vous rencontrez des problèmes.

Cordialement,
L'équipe Backend 