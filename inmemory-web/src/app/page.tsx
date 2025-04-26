'use client';

import { useState, useEffect, useCallback } from 'react';
import ResourceGrid from './components/resources/ResourceGrid';
import ResourceModal from './components/resources/ResourceModal';
import { Resource, StrapiResponse, Category } from './types';
import Pagination from './components/common/Pagination';
import CategoryFilter from './components/categories/CategoryFilter';

export default function Home() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'resources' | 'categories' | 'complete'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [pageSize] = useState(12);

  const handleCloseDetail = () => {
    setSelectedResource(null);
  };

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const fetchData = useCallback(async () => {
    setLoadingState('resources');
    const strapiUrl = "http://localhost:1337";
    try {
      let resourcesUrl = `${strapiUrl}/api/resources?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&populate[category]=true&populate[votes]=true&populate[comments]=true`;
      
      if (selectedCategory) {
        resourcesUrl += `&filters[category][id][$eq]=${selectedCategory}`;
      }

      console.log('Fetching resources from URL:', resourcesUrl);
      const resourcesResponse = await fetch(resourcesUrl);
      
      if (!resourcesResponse.ok) {
        throw new Error(`Erreur HTTP: ${resourcesResponse.status}`);
      }
      
      const resourcesData = await resourcesResponse.json();
      console.log('Raw resources data:', JSON.stringify(resourcesData, null, 2));
      
      let formattedResources: Resource[] = [];
      
      if (Array.isArray(resourcesData.data)) {
        formattedResources = resourcesData.data.map((item: any) => {
          console.log('Processing item:', JSON.stringify(item, null, 2));
          
          if (!item) {
            console.error('Invalid item structure:', item);
            return null;
          }

          return {
            id: item.id,
            documentId: `resource-${item.id}`,
            title: item.title || 'Sans titre',
            description: item.description || '',
            imageUrl: item.imageUrl || null,
            link: item.link || null,
            createdAt: item.createdAt || null,
            updatedAt: item.updatedAt || null,
            publishedAt: item.publishedAt || null,
            isPublic: item.isPublic || false,
            category: item.category ? {
              id: item.category.id,
              documentId: `category-${item.category.id}`,
              name: item.category.name || '',
              createdAt: item.category.createdAt || null,
              updatedAt: item.category.updatedAt || null,
              publishedAt: item.category.publishedAt || null,
              description: item.category.description || ''
            } : null,
            teams: (item.teams || []).map((team: any) => ({
              id: team.id,
              name: team.name || '',
              color: team.color || ''
            })),
            votes: (item.votes || []).map((vote: any) => ({
              id: vote.id,
              value: vote.value || 0,
              userId: vote.user?.id || null,
              createdAt: vote.createdAt || null
            })),
            comments: (item.comments || []).map((comment: any) => ({
              id: comment.id,
              content: comment.content || '',
              userId: comment.user?.id || null,
              createdAt: comment.createdAt || null
            }))
          };
        }).filter(Boolean);
      }
      
      console.log('Formatted resources:', formattedResources);
      setResources(formattedResources);
      setTotalPages(resourcesData.meta?.pagination?.pageCount || 1);
      setError(null);
      
      setLoadingState('categories');
      const categoriesUrl = `${strapiUrl}/api/categories?pagination[limit]=100`;
      
      console.log('Fetching categories from URL:', categoriesUrl);
      const categoriesResponse = await fetch(categoriesUrl);
      
      if (!categoriesResponse.ok) {
        throw new Error(`Erreur HTTP: ${categoriesResponse.status}`);
      }
      
      const categoriesData = await categoriesResponse.json();
      console.log('Raw categories data:', categoriesData);
      
      const formattedCategories = categoriesData.data.map((item: any) => ({
        id: item.id,
        documentId: `category-${item.id}`,
        name: item.name || '',
        description: item.description || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt
      }));
      
      console.log('Formatted categories:', formattedCategories);
      setCategories(formattedCategories);
      setLoadingState('complete');
    } catch (err) {
      console.error('Erreur détaillée lors du chargement des données:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoadingState('complete');
    }
  }, [currentPage, pageSize, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Ressources InMemory</h1>
      
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          loading={loadingState === 'categories'}
        />
      </div>

      {error ? (
        <div className="text-red-500 text-center my-4">{error}</div>
      ) : loadingState !== 'complete' ? (
        <div className="text-center my-4">Chargement...</div>
      ) : resources.length === 0 ? (
        <div className="text-center my-4">Aucune ressource trouvée</div>
      ) : (
        <>
          <ResourceGrid
            resources={resources}
            onResourceClick={handleResourceClick}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
