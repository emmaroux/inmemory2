'use client';

import { Resource } from '@/app/types';
import Image from 'next/image';
import { useState } from 'react';

interface ResourceModalProps {
  resource: Resource;
  onClose: () => void;
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

export default function ResourceModal({ resource, onClose }: ResourceModalProps) {
  const [imageError, setImageError] = useState(false);
  const categoryName = resource.category?.name || 'Non catégorisé';
  const totalVotes = resource.votes?.length || 0;
  
  const initials = getInitials(resource.title || 'Resource');
  const bgColor = getRandomColor(resource.title || 'Resource');
  
  const date = new Date(resource.publishedAt);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{resource.title || 'Sans titre'}</h2>
              </div>
              <div className="flex gap-2 text-sm text-gray-500 mt-1">
                <span>Publié le {formattedDate}</span>
                <span>•</span>
                <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="relative h-64 mb-4">
            {resource.imageUrl && !imageError ? (
              <Image
                src={resource.imageUrl}
                alt={resource.title || 'Image de la ressource'}
                fill
                className="object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div 
                className={`w-full h-full rounded-lg flex items-center justify-center ${bgColor}`}
              >
                <span className="text-white text-5xl font-bold">{initials}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{resource.description || 'Aucune description disponible'}</p>
            {resource.link && (
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Voir la ressource
              </a>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Catégorie :</h3>
            <div className="flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-gray-100 w-fit">
                {categoryName}
              </span>
            </div>
          </div>

          {resource.votes && resource.votes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Votes par équipe :</h3>
              <div className="flex flex-wrap gap-2">
                {resource.votes.map((vote) => (
                  <div
                    key={vote.id}
                    className="flex items-center gap-1 px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${vote.team?.color || '#e5e7eb'}20` }}
                  >
                    <span style={{ color: vote.team?.color || '#666' }}>{vote.team?.name || 'Équipe inconnue'}</span>
                    <span className="text-sm">({vote.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {resource.comments && resource.comments.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Commentaires :</h3>
              <div className="space-y-3">
                {resource.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 