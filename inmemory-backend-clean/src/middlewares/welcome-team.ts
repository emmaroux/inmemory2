import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

interface WelcomeTeam {
  id: number;
  users: { id: number }[];
}

export default ({ strapi }: { strapi: Strapi }) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized("No user found");
    }

    const existingWelcomeTeam = await strapi.entityService.findMany("api::welcome-team.welcome-team", {
      filters: {
        users: {
          id: user.id,
        },
      },
    }) as WelcomeTeam[];

    if (existingWelcomeTeam.length > 0) {
      return next();
    }

    const welcomeTeam = await strapi.entityService.findMany("api::welcome-team.welcome-team", {
      filters: {
        users: {
          $size: 0,
        },
      },
    }) as WelcomeTeam[];

    if (welcomeTeam.length > 0) {
      await strapi.entityService.update("api::welcome-team.welcome-team", welcomeTeam[0].id, {
        data: {
          users: {
            connect: [{ id: user.id }],
          },
        },
      });
    } else {
      await strapi.entityService.create("api::welcome-team.welcome-team", {
        data: {
          users: {
            connect: [{ id: user.id }],
          },
        },
      });
    }

    return next();
  };
}; 