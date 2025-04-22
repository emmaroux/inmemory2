'use client';

import { Resource, Vote } from '../../types';
import Image from 'next/image';
import { useState } from 'react';

interface ResourceGridItemProps {
  resource: Resource;
  onClick: () => void;
}

const getInitials = (title: string): string => {
  return title
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (text: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-green-500',
    'bg-orange-500'
  ];
  const index = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export default function ResourceGridItem({ resource, onClick }: ResourceGridItemProps) {
  const [imageError, setImageError] = useState(false);
  
  const date = new Date(resource.publishedAt);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Calcul du total des votes en sommant les valeurs
  const totalVotes = resource.votes?.reduce((sum: number, vote: any) => sum + vote.value, 0) || 0;
  
  // Récupération du nom de la catégorie s'il existe
  const categoryName = resource.category?.name || 'Non catégorisé';
  
  const initials = getInitials(resource.title || 'Resource');
  const bgColor = getRandomColor(resource.title || 'Resource');

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105"
      onClick={onClick}
    >
      {resource.imageUrl && !imageError ? (
        <div className="relative h-48 w-full">
          <Image
            src={resource.imageUrl}
            alt={resource.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className={`h-48 w-full ${bgColor} flex items-center justify-center`}>
          <span className="text-white text-3xl font-bold">{initials}</span>
        </div>
      )}
      
      <div className="p-4">
        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200 mb-2">
          {categoryName}
        </span>
        <h3 className="text-xl font-semibold mb-2">{resource.title || 'Sans titre'}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">
          {resource.description || 'Aucune description'}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Publié le {formattedDate}</span>
          <div className="flex items-center">
            <span className="mr-2">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
            <span className="text-xs">{resource.comments?.length || 0} commentaire{resource.comments?.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 