module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/comments',
      handler: 'comment.find',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/comments/:id',
      handler: 'comment.findOne',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/comments',
      handler: 'comment.create',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/comments/:id',
      handler: 'comment.update',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/comments/:id',
      handler: 'comment.delete',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
}; 