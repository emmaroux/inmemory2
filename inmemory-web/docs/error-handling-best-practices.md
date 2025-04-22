# Bonnes Pratiques de Gestion d'Erreurs et États de Chargement dans Next.js

## 1. Gestion Indépendante des Erreurs

### Problème
Dans une application qui fait plusieurs appels API, une erreur sur un appel ne devrait pas nécessairement bloquer toute l'application.

### Solution
Utiliser des états d'erreur séparés pour chaque type de données :

```typescript
// ❌ Mauvaise approche - Une seule erreur globale
const [error, setError] = useState<string | null>(null);

// ✅ Bonne approche - Erreurs séparées
const [resourcesError, setResourcesError] = useState<string | null>(null);
const [categoriesError, setCategoriesError] = useState<string | null>(null);
```

### Exemple d'implémentation
```typescript
try {
  // Tentative de récupération des ressources
  const resourcesData = await fetchResources();
  setResources(resourcesData);
  setResourcesError(null);
} catch (err) {
  setResourcesError(err.message);
  // L'erreur est gérée localement, l'application continue
}

try {
  // Tentative de récupération des catégories
  const categoriesData = await fetchCategories();
  setCategories(categoriesData);
  setCategoriesError(null);
} catch (err) {
  setCategoriesError(err.message);
  // L'erreur est gérée localement, l'application continue
}
```

## 2. États de Chargement Granulaires

### Problème
Un simple état "loading" booléen ne donne pas assez d'informations sur l'état actuel de l'application.

### Solution
Utiliser un état de chargement énuméré qui décrit précisément l'étape en cours :

```typescript
// ❌ Mauvaise approche
const [loading, setLoading] = useState(true);

// ✅ Bonne approche
const [loadingState, setLoadingState] = useState<string>('initial');
const loadingMessages = {
  initial: 'Initialisation...',
  auth: 'Authentification...',
  resources: 'Chargement des ressources...',
  categories: 'Chargement des catégories...'
};
```

### Exemple d'Affichage
```typescript
if (loadingState !== 'complete') {
  return (
    <div className="flex flex-col items-center">
      <div>{loadingMessages[loadingState]}</div>
      <div className="flex space-x-2">
        {Object.keys(loadingMessages).map((state) => (
          <div
            key={state}
            className={`w-2 h-2 rounded-full ${
              state === loadingState ? 'bg-purple-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

## 3. Gestion des Données Manquantes

### Problème
Les données peuvent être nulles ou undefined, ce qui peut causer des erreurs d'affichage.

### Solution
Toujours fournir des valeurs par défaut et utiliser l'opérateur de coalescence nulle :

```typescript
// ❌ Mauvaise approche
setResources(resourcesData.data);

// ✅ Bonne approche
setResources(resourcesData.data || []);
```

### Exemple dans les Composants
```typescript
function ResourceItem({ resource }) {
  return (
    <div>
      <h3>{resource.title || 'Sans titre'}</h3>
      <p>{resource.description || 'Aucune description'}</p>
      <span>{resource.category?.name || 'Non catégorisé'}</span>
    </div>
  );
}
```

## 4. Affichage des Erreurs

### Problème
Les erreurs doivent être visibles et compréhensibles pour l'utilisateur.

### Solution
Utiliser des composants d'erreur distincts avec différents niveaux de sévérité :

```typescript
// Erreur bloquante (rouge)
{resourcesError && (
  <div className="bg-red-50 border-l-4 border-red-500 p-4">
    <h3 className="text-red-800">Erreur critique</h3>
    <p className="text-red-700">{resourcesError}</p>
  </div>
)}

// Avertissement (ambre)
{categoriesError && (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
    <h3 className="text-amber-800">Avertissement</h3>
    <p className="text-amber-700">{categoriesError}</p>
  </div>
)}
```

## Bonnes Pratiques Générales

1. **Dégradation Progressive** : L'application doit continuer à fonctionner même si certaines fonctionnalités échouent.

2. **Feedback Utilisateur** : Toujours informer l'utilisateur de ce qui se passe, surtout pendant les chargements.

3. **Gestion des Erreurs Contextuelle** : Adapter le message et l'apparence des erreurs selon leur gravité.

4. **États par Défaut** : Toujours prévoir des états par défaut pour les données manquantes.

5. **Séparation des Responsabilités** : Gérer les erreurs au niveau approprié (composant, page, application).

## Conclusion

Une bonne gestion des erreurs et des états de chargement améliore considérablement l'expérience utilisateur. Elle permet de :
- Maintenir l'application fonctionnelle même en cas d'erreurs partielles
- Informer clairement l'utilisateur de l'état du système
- Faciliter le débogage en isolant les problèmes

## Erreurs Courantes avec Strapi

### Erreur 500 sur un endpoint
Si vous recevez une erreur 500 sur un endpoint Strapi, vérifiez :

1. **Structure complète du modèle** :
   ```
   src/api/[nom-api]/
   ├── content-types/
   │   └── [nom-api]/
   │       └── schema.json    # Définition du modèle
   ├── controllers/
   │   └── [nom-api].js      # Logique de contrôle
   ├── routes/
   │   └── [nom-api].js      # Définition des routes
   └── services/
       └── [nom-api].js      # Logique métier
   ```
   L'absence d'un de ces fichiers peut causer une erreur 500.

2. **Vérifications** :
   - Tous les fichiers sont présents
   - Le nom du modèle est cohérent dans tous les fichiers
   - Les permissions sont configurées dans l'admin Strapi
   - Les relations sont correctement définies dans schema.json

3. **Solution typique** :
   - Créer les fichiers manquants
   - Redémarrer le serveur Strapi
   - Vérifier les logs pour d'autres erreurs potentielles 