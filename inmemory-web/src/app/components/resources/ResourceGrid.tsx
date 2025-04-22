'use client';

import { Resource } from '@/app/types';
import ResourceGridItem from './ResourceGridItem';

interface ResourceGridProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

export default function ResourceGrid({ resources, onResourceClick }: ResourceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {resources.map((resource) => (
        <ResourceGridItem
          key={resource.id}
          resource={resource}
          onClick={() => onResourceClick(resource)}
        />
      ))}
    </div>
  );
} 