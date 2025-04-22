'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/resources/document/:id',
      handler: 'resource.findByDocumentId',
      config: {
        auth: false,
      }
    }
  ]
}; 