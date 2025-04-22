'use strict';

const { faker } = require('@faker-js/faker');

module.exports = async (strapi) => {
  try {
    console.log('=== Début du seeding complet ===');

    // 1. Nettoyer toutes les collections existantes
    console.log('=== Nettoyage complet de la base de données ===');
    const collectionsToClean = ['comment', 'vote', 'resource', 'category', 'team'];
    
    for (const collection of collectionsToClean) {
      try {
        const items = await strapi.entityService.findMany(`api::${collection}.${collection}`);
        console.log(`Suppression de ${items.length} ${collection}s...`);
        
        for (const item of items) {
          await strapi.entityService.delete(`api::${collection}.${collection}`, item.id);
        }
        console.log(`Collection ${collection} nettoyée.`);
      } catch (error) {
        console.error(`Erreur lors du nettoyage de ${collection}:`, error.message);
      }
    }
    console.log('=== Nettoyage terminé ===');

    // 2. Création des catégories
    console.log('=== Création des catégories ===');
    const categories = await Promise.all([
      strapi.entityService.create('api::category.category', {
        data: {
          name: 'IA',
          description: 'Intelligence Artificielle et Machine Learning'
        }
      }),
      strapi.entityService.create('api::category.category', {
        data: {
          name: 'Web',
          description: 'Développement Web et Frontend'
        }
      }),
      strapi.entityService.create('api::category.category', {
        data: {
          name: 'Mobile',
          description: 'Développement Mobile'
        }
      }),
      strapi.entityService.create('api::category.category', {
        data: {
          name: 'Design',
          description: 'UX/UI Design et expérience utilisateur'
        }
      }),
      strapi.entityService.create('api::category.category', {
        data: {
          name: 'Data',
          description: 'Science des données et analytique'
        }
      })
    ]);
    console.log(`${categories.length} catégories créées.`);

    // 3. Création des équipes
    console.log('=== Création des équipes ===');
    const teams = await Promise.all([
      strapi.entityService.create('api::team.team', {
        data: {
          name: 'Équipe Alpha',
          color: '#4F46E5'
        }
      }),
      strapi.entityService.create('api::team.team', {
        data: {
          name: 'Équipe Beta',
          color: '#10B981'
        }
      }),
      strapi.entityService.create('api::team.team', {
        data: {
          name: 'Équipe Gamma',
          color: '#F59E0B'
        }
      })
    ]);
    console.log(`${teams.length} équipes créées.`);

    // 4. Création/vérification des utilisateurs
    console.log('=== Création des utilisateurs ===');
    const existingUsers = await strapi.entityService.findMany('plugin::users-permissions.user');
    const usersToCreate = [
      {
        username: 'user1',
        email: 'user1@test.com',
        password: 'password123',
        confirmed: true,
        blocked: false,
        role: 1
      },
      {
        username: 'user2',
        email: 'user2@test.com',
        password: 'password123',
        confirmed: true,
        blocked: false,
        role: 1
      },
      {
        username: 'user3',
        email: 'user3@test.com',
        password: 'password123',
        confirmed: true,
        blocked: false,
        role: 1
      }
    ];

    const users = [];
    for (const userData of usersToCreate) {
      const existingUser = existingUsers.find(u => u.email === userData.email || u.username === userData.username);
      if (!existingUser) {
        const user = await strapi.entityService.create('plugin::users-permissions.user', {
          data: userData
        });
        users.push(user);
      } else {
        users.push(existingUser);
      }
    }
    console.log(`${users.length} utilisateurs disponibles.`);

    // 5. Création des ressources
    console.log('=== Création des ressources ===');
    const resourcesData = [
      {
        title: "L'IA révolutionne la médecine",
        description: "Comment l'intelligence artificielle transforme le diagnostic médical et la recherche de traitements.",
        link: "https://example.com/ia-medecine",
        imageUrl: "https://example.com/images/ia-medecine.jpg",
        category: categories[0].id // IA
      },
      {
        title: "Tendances du développement web en 2025",
        description: "Les dernières technologies et frameworks qui dominent le développement web cette année.",
        link: "https://example.com/tendances-web-2025",
        imageUrl: "https://example.com/images/tendances-web.jpg",
        category: categories[1].id // Web
      },
      {
        title: "Flutter vs React Native : comparatif détaillé",
        description: "Analyse des avantages et inconvénients des deux principaux frameworks de développement mobile cross-platform.",
        link: "https://example.com/flutter-vs-react-native",
        imageUrl: "https://example.com/images/flutter-react.jpg",
        category: categories[2].id // Mobile
      },
      {
        title: "Design System : pourquoi c'est essentiel",
        description: "L'importance d'un système de design cohérent pour les applications modernes.",
        link: "https://example.com/design-system-importance",
        imageUrl: "https://example.com/images/design-system.jpg",
        category: categories[3].id // Design
      },
      {
        title: "Introduction au Machine Learning",
        description: "Les concepts fondamentaux pour comprendre et appliquer le machine learning.",
        link: "https://example.com/intro-machine-learning",
        imageUrl: "https://example.com/images/machine-learning.jpg",
        category: categories[0].id // IA
      },
      {
        title: "Optimisation des performances Web",
        description: "Techniques pour améliorer la vitesse et l'expérience utilisateur de vos sites web.",
        link: "https://example.com/optimisation-web",
        imageUrl: "https://example.com/images/web-perf.jpg",
        category: categories[1].id // Web
      },
      {
        title: "L'essor de SwiftUI dans le développement iOS",
        description: "Comment SwiftUI transforme la façon de créer des applications pour l'écosystème Apple.",
        link: "https://example.com/swiftui-ios",
        imageUrl: "https://example.com/images/swiftui.jpg",
        category: categories[2].id // Mobile
      },
      {
        title: "Big Data : enjeux et opportunités",
        description: "Comment les entreprises peuvent tirer profit de l'analyse des grandes quantités de données.",
        link: "https://example.com/big-data-enjeux",
        imageUrl: "https://example.com/images/big-data.jpg",
        category: categories[4].id // Data
      },
      {
        title: "L'éthique dans l'IA",
        description: "Les considérations éthiques essentielles dans le développement de systèmes d'IA.",
        link: "https://example.com/ethique-ia",
        imageUrl: "https://example.com/images/ethique-ia.jpg",
        category: categories[0].id // IA
      },
      {
        title: "NextJS : le framework React du futur",
        description: "Pourquoi NextJS devient incontournable pour les applications React modernes.",
        link: "https://example.com/nextjs-framework",
        imageUrl: "https://example.com/images/nextjs.jpg",
        category: categories[1].id // Web
      }
    ];

    const resources = [];
    for (const resourceData of resourcesData) {
      const resource = await strapi.entityService.create('api::resource.resource', {
        data: resourceData
      });
      resources.push(resource);
    }
    console.log(`${resources.length} ressources créées.`);

    // 6. Création des votes et commentaires
    console.log('=== Création des votes et commentaires ===');
    let votesCreated = 0;
    let commentsCreated = 0;

    for (const resource of resources) {
      // Création de 2 votes par ressource
      for (let i = 0; i < 2; i++) {
        await strapi.entityService.create('api::vote.vote', {
          data: {
            value: faker.number.int({ min: 1, max: 5 }),
            user: faker.helpers.arrayElement(users).id,
            resource: resource.id,
            team: faker.helpers.arrayElement(teams).id
          }
        });
        votesCreated++;
      }

      // Création de 2 commentaires par ressource
      for (let i = 0; i < 2; i++) {
        await strapi.entityService.create('api::comment.comment', {
          data: {
            content: faker.lorem.paragraph(),
            date: faker.date.recent(),
            resource: resource.id,
            team: faker.helpers.arrayElement(teams).id,
            user: faker.helpers.arrayElement(users).id
          }
        });
        commentsCreated++;
      }
    }

    console.log(`${votesCreated} votes créés.`);
    console.log(`${commentsCreated} commentaires créés.`);
    console.log('=== Fin du seeding ===');

    // Résumé final
    console.log('\n=== Résumé du seeding ===');
    console.log(`- ${categories.length} catégories`);
    console.log(`- ${teams.length} équipes`);
    console.log(`- ${users.length} utilisateurs`);
    console.log(`- ${resources.length} ressources`);
    console.log(`- ${votesCreated} votes`);
    console.log(`- ${commentsCreated} commentaires`);
    console.log('=== Seeding terminé avec succès ===');

  } catch (error) {
    console.error('=== Erreur lors du seeding :', error);
    throw error;
  }
}; 