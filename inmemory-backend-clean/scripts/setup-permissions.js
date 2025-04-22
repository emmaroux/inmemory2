const fs = require('fs');
const path = require('path');

// Configuration des permissions pour chaque rôle
const permissions = {
  public: {
    partage: {
      find: false,     // Le contenu n'est visible que pour les utilisateurs connectés
      findOne: false,
      create: false,
      update: false,
      delete: false
    },
    team: {
      find: false,     // Les équipes ne sont visibles que pour les utilisateurs connectés
      findOne: false,
      create: false,
      update: false,
      delete: false
    },
    vote: {
      find: false,
      findOne: false,
      create: false,
      update: false,
      delete: false
    }
  },
  authenticated: {
    partage: {
      find: true,      // Peut voir tous les partages
      findOne: true,
      create: true,    // Peut ajouter un partage
      update: true,    // Peut modifier son propre partage
      delete: true     // Peut supprimer son propre partage
    },
    team: {
      find: true,      // Peut voir les équipes
      findOne: true,
      create: false,   // Seul l'admin peut créer des équipes
      update: false,
      delete: false
    },
    vote: {
      find: true,      // Peut voir les votes
      findOne: true,
      create: true,    // Peut voter pour un partage
      update: true,    // Peut modifier son vote
      delete: true     // Peut supprimer son vote
    }
  },
  administrator: {
    partage: {
      find: true,
      findOne: true,
      create: true,
      update: true,
      delete: true
    },
    team: {
      find: true,
      findOne: true,
      create: true,    // Peut créer des équipes
      update: true,    // Peut modifier les équipes
      delete: true     // Peut supprimer les équipes
    },
    vote: {
      find: true,
      findOne: true,
      create: true,
      update: true,
      delete: true
    }
  }
};

// Fonction pour créer les fichiers de configuration des permissions
function setupPermissions() {
  const configPath = path.join(__dirname, '..', 'config', 'permissions');
  
  // Créer le dossier permissions s'il n'existe pas
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
  }

  // Créer les fichiers de configuration pour chaque rôle
  Object.entries(permissions).forEach(([role, collections]) => {
    const roleConfig = {
      role: role,
      permissions: collections
    };

    const filePath = path.join(configPath, `${role}.json`);
    fs.writeFileSync(filePath, JSON.stringify(roleConfig, null, 2));
    
    console.log(`Permissions configurées pour le rôle ${role}`);
  });
}

// Exécuter la configuration
setupPermissions(); 