module.exports = {
  config: {
    jwt: {
      expiresIn: '7d',
    },
  },
  routes: {
    admin: {
      type: 'admin',
      routes: [
        {
          method: 'GET',
          path: '/roles',
          handler: 'role.find',
          config: {
            policies: [],
          },
        },
        {
          method: 'GET',
          path: '/roles/:id',
          handler: 'role.findOne',
          config: {
            policies: [],
          },
        },
        {
          method: 'PUT',
          path: '/roles/:id',
          handler: 'role.update',
          config: {
            policies: [],
          },
        },
      ],
    },
    'content-api': {
      type: 'content-api',
      routes: [
        {
          method: 'GET',
          path: '/categories',
          handler: 'category.find',
          config: {
            policies: [],
            auth: {
              scope: ['api::category.category.find'],
            },
          },
        },
        {
          method: 'GET',
          path: '/categories/:id',
          handler: 'category.findOne',
          config: {
            policies: [],
            auth: {
              scope: ['api::category.category.findOne'],
            },
          },
        },
        {
          method: 'GET',
          path: '/resources',
          handler: 'resource.find',
          config: {
            policies: [],
            auth: {
              scope: ['api::resource.resource.find'],
            },
          },
        },
        {
          method: 'GET',
          path: '/resources/:id',
          handler: 'resource.findOne',
          config: {
            policies: [],
            auth: {
              scope: ['api::resource.resource.findOne'],
            },
          },
        },
        {
          method: 'GET',
          path: '/votes',
          handler: 'vote.find',
          config: {
            policies: [],
            auth: {
              scope: ['api::vote.vote.find'],
            },
          },
        },
        {
          method: 'GET',
          path: '/votes/:id',
          handler: 'vote.findOne',
          config: {
            policies: [],
            auth: {
              scope: ['api::vote.vote.findOne'],
            },
          },
        },
        {
          method: 'GET',
          path: '/comments',
          handler: 'comment.find',
          config: {
            policies: [],
            auth: {
              scope: ['api::comment.comment.find'],
            },
          },
        },
        {
          method: 'GET',
          path: '/comments/:id',
          handler: 'comment.findOne',
          config: {
            policies: [],
            auth: {
              scope: ['api::comment.comment.findOne'],
            },
          },
        },
      ],
    },
  },
  bootstrap(/*{ strapi }*/) {},
}; 