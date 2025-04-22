# Configuration des Utilisateurs dans Strapi

## Types d'Utilisateurs dans Strapi

Strapi distingue deux types d'utilisateurs différents :

1. **Les utilisateurs administrateurs** (Admin Users)
   - Accèdent à l'interface d'administration de Strapi
   - Ont des rôles comme : Super Admin, Editor, Author
   - Utilisent l'endpoint `/admin/login` pour s'authentifier
   - Ne doivent PAS être utilisés pour l'API publique

2. **Les utilisateurs de l'API** (API Users)
   - Utilisent l'application front-end
   - Ont des rôles comme : Authenticated, Public
   - Utilisent l'endpoint `/api/auth/local` pour s'authentifier
   - Sont les utilisateurs à créer pour l'application

## Configuration des Utilisateurs API

### 1. Vérifier les Rôles API
Dans Settings > Users & Permissions Plugin > Roles, vous trouverez deux sections :

- Les rôles d'administration (Super Admin, Editor, Author)
- Les rôles d'API (Authenticated, Public)

### 2. Configurer le Rôle "Authenticated"
1. Cliquer sur le rôle "Authenticated"
2. Activer les permissions nécessaires :
   - Resources : find, findOne
   - Categories : find, findOne
3. Sauvegarder les modifications

### 3. Créer un Utilisateur API
1. Aller dans Content Manager > Collection Types > User
2. Cliquer sur "Create new entry"
3. Remplir les informations :
   - Username
   - Email
   - Password
4. Sauvegarder

### 4. Configuration Front-end
Dans le fichier `.env.local` du projet Next.js, utiliser les credentials de l'utilisateur API créé :

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_USERNAME=votre_email@example.com
NEXT_PUBLIC_STRAPI_PASSWORD=votre_mot_de_passe
```

## Important
- Ne jamais utiliser le compte Super Admin pour l'authentification API
- Toujours créer un utilisateur API distinct pour l'application front-end
- Le rôle "Authenticated" est automatiquement attribué aux utilisateurs API créés

## Troubleshooting
Si vous recevez une erreur "Invalid identifier or password" :
1. Vérifier que vous utilisez bien les credentials d'un utilisateur API (pas admin)
2. Vérifier que l'endpoint utilisé est `/api/auth/local` (pas `/admin/login`)
3. Vérifier que les permissions sont correctement configurées pour le rôle "Authenticated" 