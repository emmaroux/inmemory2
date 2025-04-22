module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/resources',
      handler: 'resource.find',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/resources/:id',
      handler: 'resource.findOne',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/resources',
      handler: 'resource.create',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/resources/:id',
      handler: 'resource.update',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/resources/:id',
      handler: 'resource.delete',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
}; 