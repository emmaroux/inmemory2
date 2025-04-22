# Plan d'action pour la stabilisation de l'API

## Analyse de la situation actuelle

Après plusieurs tentatives d'amélioration de l'API, nous constatons une discordance persistante entre le comportement attendu (format standard Strapi v5) et le comportement observé (format personnalisé). Cette situation complique l'intégration front-end et nécessite une approche plus structurée.

## Problèmes identifiés

1. **Format de réponse inconsistant** :
   - Les ressources sont renvoyées dans un format plat (sans `attributes`)
   - Les catégories utilisent une structure différente (`data.results[]`)
   - Les relations ne sont pas chargées via le paramètre `populate`

2. **Documentation inexacte** :
   - La documentation actuelle décrit le format standard de Strapi v5
   - L'API réelle renvoie un format personnalisé

3. **Intégration complexe** :
   - L'équipe front doit utiliser plusieurs requêtes pour obtenir des données liées
   - Absence d'uniformité dans la structure des réponses

## Plan d'action immédiat

### 1. Investigation approfondie (1-2 jours)

- [x] Vérifier la version exacte de Strapi utilisée (`package.json`)
- [ ] Examiner les middlewares personnalisés qui pourraient transformer les réponses
- [ ] Identifier les plugins Strapi actifs qui pourraient modifier le comportement standard
- [ ] Analyser les fichiers de configuration (`./config/plugins.js`, `./config/middleware.js`)

### 2. Documentation de l'existant (1 jour)

- [ ] Créer une documentation précise du format actuel de l'API
- [ ] Documenter chaque endpoint avec des exemples de requêtes et réponses réelles
- [ ] Établir un guide d'utilisation adapté à la structure actuelle

### 3. Création d'adaptateurs pour l'équipe front (2 jours)

- [ ] Développer des fonctions d'aide pour transformer les réponses de l'API
- [ ] Créer un service JavaScript/TypeScript pour l'intégration
- [ ] Proposer des hooks React pour simplifier l'accès aux données

### 4. Réalignement de l'API (optionnel, 3-5 jours)

- [ ] Identifier les modifications nécessaires pour adopter le format standard Strapi
- [ ] Créer un plan de migration avec des étapes progressives
- [ ] Mettre en place des tests automatisés pour valider les changements

## Solutions pour l'équipe frontend

En attendant la stabilisation complète de l'API, nous proposons les solutions suivantes pour l'équipe frontend :

### Approche 1 : Adaptateurs de données

```typescript
// Service d'adaptation des données de l'API
export class ApiService {
  // Récupère les ressources avec leurs relations
  static async getResourcesWithRelations() {
    // 1. Récupérer les ressources
    const resources = await this.getResources();
    
    // 2. Pour chaque ressource, récupérer les relations
    const enhancedResources = await Promise.all(
      resources.map(async resource => {
        const [category, votes, comments] = await Promise.all([
          this.getCategoryForResource(resource.id),
          this.getVotesForResource(resource.id),
          this.getCommentsForResource(resource.id),
        ]);
        
        // 3. Fusionner les données
        return {
          ...resource,
          category,
          votes,
          comments,
        };
      })
    );
    
    return enhancedResources;
  }
  
  // Méthodes d'accès aux API
  static async getResources() {
    const response = await fetch('http://localhost:1337/api/resources');
    const data = await response.json();
    return data.data || [];
  }
  
  static async getCategoryForResource(resourceId) {
    const response = await fetch(`http://localhost:1337/api/categories?filters[resources][id][$eq]=${resourceId}`);
    const data = await response.json();
    return data.data?.results?.[0] || null;
  }
  
  static async getVotesForResource(resourceId) {
    const response = await fetch(`http://localhost:1337/api/votes?filters[resource][id][$eq]=${resourceId}`);
    const data = await response.json();
    return data.data || [];
  }
  
  static async getCommentsForResource(resourceId) {
    const response = await fetch(`http://localhost:1337/api/comments?filters[resource][id][$eq]=${resourceId}`);
    const data = await response.json();
    return data.data || [];
  }
}
```

### Approche 2 : Hook React personnalisé

```typescript
// Hook pour récupérer des ressources avec leurs relations
function useResourcesWithRelations() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const enhancedResources = await ApiService.getResourcesWithRelations();
        setResources(enhancedResources);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  return { resources, isLoading, error };
}
```

### Approche 3 : Cache côté client

```typescript
// Gestionnaire de cache pour les requêtes API
class ApiCache {
  static cache = new Map();
  
  static async getOrFetch(key, fetchFn) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const data = await fetchFn();
    this.cache.set(key, data);
    return data;
  }
  
  static invalidate(key) {
    this.cache.delete(key);
  }
  
  static clear() {
    this.cache.clear();
  }
}

// Utilisation
const resources = await ApiCache.getOrFetch(
  'resources',
  () => ApiService.getResourcesWithRelations()
);
```

## Réunion technique proposée

Nous proposons d'organiser une réunion technique entre les équipes frontend et backend pour :

1. Présenter le format actuel de l'API
2. Discuter des attentes des deux équipes
3. Établir un plan commun pour la stabilisation
4. Définir des jalons et des critères de validation

## Échéancier

- **Jour 1-2** : Investigation et documentation de l'existant
- **Jour 3-4** : Développement des adaptateurs pour l'équipe front
- **Jour 5** : Réunion technique et validation des solutions
- **Jour 6-10** : Mise en œuvre des améliorations côté API (optionnel)

## Conclusion

La situation actuelle nécessite une approche pragmatique combinant :
1. L'adaptation au format existant à court terme
2. La standardisation progressive de l'API à moyen terme
3. Une communication claire entre les équipes

Cette stratégie permettra de débloquer l'équipe frontend tout en travaillant à une solution plus durable pour l'avenir du projet. 