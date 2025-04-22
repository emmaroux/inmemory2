import { Resource, Team, Vote, Comment, User } from '../types';

const generateRandomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

const mockUsers: User[] = [
  { id: '1', name: 'Alice Martin', teams: [] },
  { id: '2', name: 'Bob Dupont', teams: [] },
  { id: '3', name: 'Claire Bernard', teams: [] },
  { id: '4', name: 'David Leroy', teams: [] },
  { id: '5', name: 'Emma Petit', teams: [] },
];

const mockTeams: Team[] = [
  { id: '1', name: 'Équipe Marketing', color: '#FF6B6B' },
  { id: '2', name: 'Équipe Dev', color: '#4ECDC4' },
  { id: '3', name: 'Équipe Design', color: '#45B7D1' },
];

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Guide de Marketing Digital',
    description: 'Un guide complet sur les stratégies de marketing digital en 2024',
    link: 'https://example.com/marketing-guide',
    imageUrl: 'https://picsum.photos/400/300',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Tendances UX Design',
    description: 'Les dernières tendances en matière de design d\'expérience utilisateur',
    link: 'https://example.com/ux-trends',
    imageUrl: 'https://picsum.photos/400/301',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Guide complet du développement d\'API avec tRPC et Next.js',
    description: 'Explorez comment construire des API typesafe de bout en bout avec tRPC et Next.js. Ce guide couvre l\'installation, la configuration, les bonnes pratiques de sécurité, la gestion des erreurs, et l\'intégration avec des bases de données. Inclut également des stratégies de déploiement et de mise en cache.',
    imageUrl: 'https://picsum.photos/seed/trpc/800/600',
    link: 'https://example.com/trpc-guide',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Mise en place d\'une CI/CD moderne avec GitHub Actions',
    description: 'Un tutoriel pas à pas pour configurer un pipeline CI/CD complet avec GitHub Actions. Découvrez comment automatiser vos tests, déploiements et revues de code. Inclut des exemples de configuration pour différents types de projets et des stratégies de déploiement avancées.',
    imageUrl: 'https://picsum.photos/seed/cicd/800/600',
    link: 'https://example.com/github-actions',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'State Management en 2024 : Au-delà de Redux',
    description: 'Une exploration approfondie des solutions modernes de gestion d\'état en React, comparant Zustand, Jotai, et TanStack Query. Analyse des cas d\'utilisation, des performances et de la complexité de chaque solution. Inclut des exemples de code et des patterns de conception recommandés.',
    imageUrl: 'https://picsum.photos/seed/state/800/600',
    link: 'https://example.com/state-management',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Guide TypeScript avancé',
    link: 'https://example.com/typescript',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    description: 'Maîtrisez les concepts avancés de TypeScript.',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    title: 'Architecture microservices',
    link: 'https://example.com/microservices',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    description: 'Comment concevoir une architecture microservices efficace.',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    title: 'DevOps pour les débutants',
    link: 'https://example.com/devops',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    description: 'Introduction aux pratiques DevOps.',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    title: 'Les bases de données NoSQL',
    link: 'https://example.com/nosql',
    imageUrl: 'https://picsum.photos/400/300?random=9',
    description: 'Comprendre et utiliser les bases de données NoSQL.',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    title: 'API REST vs GraphQL',
    link: 'https://example.com/api',
    imageUrl: 'https://picsum.photos/400/300?random=10',
    description: 'Comparaison des approches API REST et GraphQL.',
    votes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockVotes: { [resourceId: string]: { [teamId: string]: Vote[] } } = {};
const mockComments: { [resourceId: string]: Comment[] } = {};

// Générer des votes et commentaires aléatoires
mockResources.forEach(resource => {
  mockVotes[resource.id] = {};
  mockComments[resource.id] = [];

  mockTeams.forEach(team => {
    const voteCount = Math.floor(Math.random() * 10);
    mockVotes[resource.id][team.id] = Array(voteCount).fill(null).map((_, index) => ({
      id: `vote-${resource.id}-${team.id}-${index}`,
      resourceId: resource.id,
      teamId: team.id,
      userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
      value: 1,
      createdAt: new Date().toISOString(),
    }));
  });

  // Générer 2-5 commentaires par ressource
  const commentCount = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < commentCount; i++) {
    const team = mockTeams[Math.floor(Math.random() * mockTeams.length)];
    mockComments[resource.id].push({
      id: `comment-${resource.id}-${i}`,
      content: `Commentaire ${i + 1} sur la ressource "${resource.title}"`,
      resourceId: resource.id,
      teamId: team.id,
      createdAt: new Date().toISOString()
    });
  }
});

export { mockResources, mockTeams, mockVotes, mockComments }; 