const fs = require('fs');
const path = require('path');

// Créer les dossiers pour chaque type de contenu
const contentTypes = ['category', 'memory', 'vote', 'comment'];
const apiPath = path.join(__dirname, '..', 'src', 'api');

contentTypes.forEach(type => {
  const typePath = path.join(apiPath, type);
  if (!fs.existsSync(typePath)) {
    fs.mkdirSync(typePath, { recursive: true });
    fs.mkdirSync(path.join(typePath, 'controllers'));
    fs.mkdirSync(path.join(typePath, 'services'));
    fs.mkdirSync(path.join(typePath, 'routes'));
    fs.mkdirSync(path.join(typePath, 'content-types'));
  }
});

// Créer les schémas pour chaque type de contenu
const categorySchema = {
  kind: "collectionType",
  collectionName: "categories",
  info: {
    singularName: "category",
    pluralName: "categories",
    displayName: "Category"
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    name: {
      type: "string",
      required: true
    },
    description: {
      type: "text",
      required: true
    },
    memories: {
      type: "relation",
      relation: "oneToMany",
      target: "api::memory.memory",
      mappedBy: "category"
    }
  }
};

const memorySchema = {
  kind: "collectionType",
  collectionName: "memories",
  info: {
    singularName: "memory",
    pluralName: "memories",
    displayName: "Memory"
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    title: {
      type: "string",
      required: true
    },
    content: {
      type: "text",
      required: true
    },
    date: {
      type: "date",
      required: true
    },
    location: {
      type: "string",
      required: true
    },
    category: {
      type: "relation",
      relation: "manyToOne",
      target: "api::category.category",
      inversedBy: "memories"
    },
    user: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::users-permissions.user"
    },
    votes: {
      type: "relation",
      relation: "oneToMany",
      target: "api::vote.vote",
      mappedBy: "memory"
    },
    comments: {
      type: "relation",
      relation: "oneToMany",
      target: "api::comment.comment",
      mappedBy: "memory"
    }
  }
};

const voteSchema = {
  kind: "collectionType",
  collectionName: "votes",
  info: {
    singularName: "vote",
    pluralName: "votes",
    displayName: "Vote"
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    value: {
      type: "integer",
      required: true,
      min: 1,
      max: 5
    },
    user: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::users-permissions.user"
    },
    memory: {
      type: "relation",
      relation: "manyToOne",
      target: "api::memory.memory",
      inversedBy: "votes"
    }
  }
};

const commentSchema = {
  kind: "collectionType",
  collectionName: "comments",
  info: {
    singularName: "comment",
    pluralName: "comments",
    displayName: "Comment"
  },
  options: {
    draftAndPublish: false
  },
  attributes: {
    content: {
      type: "text",
      required: true
    },
    date: {
      type: "datetime",
      required: true
    },
    user: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::users-permissions.user"
    },
    memory: {
      type: "relation",
      relation: "manyToOne",
      target: "api::memory.memory",
      inversedBy: "comments"
    }
  }
};

// Écrire les schémas dans les fichiers
const schemas = {
  category: categorySchema,
  memory: memorySchema,
  vote: voteSchema,
  comment: commentSchema
};

Object.entries(schemas).forEach(([type, schema]) => {
  const schemaPath = path.join(apiPath, type, 'content-types', type, 'schema.json');
  fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  
  // Créer les fichiers de routes par défaut
  const routesPath = path.join(apiPath, type, 'routes', type, 'routes.json');
  fs.mkdirSync(path.dirname(routesPath), { recursive: true });
  fs.writeFileSync(routesPath, JSON.stringify({
    routes: [
      {
        method: 'GET',
        path: `/${type}s`,
        handler: `${type}.find`,
        config: {
          policies: []
        }
      },
      {
        method: 'GET',
        path: `/${type}s/:id`,
        handler: `${type}.findOne`,
        config: {
          policies: []
        }
      },
      {
        method: 'POST',
        path: `/${type}s`,
        handler: `${type}.create`,
        config: {
          policies: []
        }
      },
      {
        method: 'PUT',
        path: `/${type}s/:id`,
        handler: `${type}.update`,
        config: {
          policies: []
        }
      },
      {
        method: 'DELETE',
        path: `/${type}s/:id`,
        handler: `${type}.delete`,
        config: {
          policies: []
        }
      }
    ]
  }, null, 2));
});

console.log('Types de contenu créés avec succès !'); 