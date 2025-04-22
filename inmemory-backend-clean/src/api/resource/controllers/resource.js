'use strict';

/**
 * resource controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::resource.resource', ({ strapi }) => ({
  async findByDocumentId(ctx) {
    const { id } = ctx.params;
    
    const entities = await strapi.db.query('api::resource.resource').findMany({
      where: { documentId: id },
      populate: ctx.query.populate,
    });

    if (!entities || entities.length === 0) {
      return ctx.notFound('Resource not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entities[0], ctx);
    return this.transformResponse(sanitizedEntity);
  }
})); 