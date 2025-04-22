module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/categories',
      handler: 'category.find',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/categories/:id',
      handler: 'category.findOne',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/categories',
      handler: 'category.create',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/categories/:id',
      handler: 'category.update',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/categories/:id',
      handler: 'category.delete',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
}; 