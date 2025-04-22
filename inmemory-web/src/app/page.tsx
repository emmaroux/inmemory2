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

  const fetchData = async () => {
    setLoadingState('resources');
    const strapiUrl = "http://localhost:1337";
    try {
      // Construction de l'URL avec les paramètres de pagination et population
      // Selon la nouvelle doc, on utilise populate=* pour tout récupérer
      let resourcesUrl = `${strapiUrl}/api/resources?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&populate=*`;
      
      // Ajouter le filtre de catégorie si une catégorie est sélectionnée
      if (selectedCategory) {
        resourcesUrl += `&filters[category][id][$eq]=${selectedCategory}`;
      }
      
      console.log("URL de requête resources:", resourcesUrl);
      
      const resourcesResponse = await fetch(resourcesUrl);
      
      if (!resourcesResponse.ok) {
        throw new Error(`Erreur HTTP: ${resourcesResponse.status}`);
      }
      
      const resourcesData: StrapiResponse<any> = await resourcesResponse.json();
      
      // Log pour voir la structure exacte de la première ressource
      if (resourcesData.data && resourcesData.data.length > 0) {
        console.log("Première ressource reçue:", JSON.stringify(resourcesData.data[0], null, 2));
      } else {
        console.log("Aucune ressource reçue ou format inattendu:", resourcesData);
      }
      
      // Vérifier si data est un tableau ou un objet
      console.log("Type de resourcesData.data:", Array.isArray(resourcesData.data) ? "Array" : typeof resourcesData.data);
      console.log("Structure de resourcesData:", Object.keys(resourcesData));
      
      // Si data est un tableau, vérifier sa longueur
      if (Array.isArray(resourcesData.data)) {
        console.log("Nombre de ressources reçues:", resourcesData.data.length);
      }
      
      console.log("Structure de la réponse resources:", JSON.stringify(resourcesData, null, 2));
      
      // Transformation simplifiée des données selon la nouvelle structure
      let formattedResources: Resource[] = [];
      
      // Adapter selon que data est un tableau ou un objet
      if (Array.isArray(resourcesData.data)) {
        formattedResources = resourcesData.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId || `resource-${item.id}`,
          title: item.title || '',
          description: item.description || '',
          imageUrl: item.imageUrl || null,
          link: item.link || null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
          category: item.category ? {
            id: item.category.id,
            documentId: item.category.documentId || `category-${item.category.id}`,
            name: item.category.name || '',
            createdAt: item.category.createdAt,
            updatedAt: item.category.updatedAt,
            publishedAt: item.category.publishedAt,
            description: item.category.description || ''
          } : null,
          votes: item.votes?.map((vote: any) => ({
            id: vote.id,
            documentId: vote.documentId || `vote-${vote.id}`,
            value: vote.value || 0,
            createdAt: vote.createdAt,
            team: vote.team ? {
              id: vote.team.id,
              documentId: vote.team.documentId || `team-${vote.team.id}`,
              name: vote.team.name || '',
              color: vote.team.color || '#cccccc'
            } : null,
            user: vote.user ? {
              id: vote.user.id,
              documentId: vote.user.documentId || `user-${vote.user.id}`,
              username: vote.user.username || ''
            } : null
          })) || [],
          comments: item.comments?.map((comment: any) => ({
            id: comment.id,
            documentId: comment.documentId || `comment-${comment.id}`,
            content: comment.content || '',
            createdAt: comment.createdAt
          })) || []
        }));
      } else if (resourcesData.data && typeof resourcesData.data === 'object') {
        // Si data est un objet unique
        const item = resourcesData.data;
        formattedResources = [{
          id: item.id,
          documentId: item.documentId || `resource-${item.id}`,
          title: item.title || '',
          description: item.description || '',
          imageUrl: item.imageUrl || null,
          link: item.link || null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
          category: item.category ? {
            id: item.category.id,
            documentId: item.category.documentId || `category-${item.category.id}`,
            name: item.category.name || '',
            createdAt: item.category.createdAt,
            updatedAt: item.category.updatedAt,
            publishedAt: item.category.publishedAt,
            description: item.category.description || ''
          } : null,
          votes: item.votes?.map((vote: any) => ({
            id: vote.id,
            documentId: vote.documentId || `vote-${vote.id}`,
            value: vote.value || 0,
            createdAt: vote.createdAt,
            team: vote.team ? {
              id: vote.team.id,
              documentId: vote.team.documentId || `team-${vote.team.id}`,
              name: vote.team.name || '',
              color: vote.team.color || '#cccccc'
            } : null,
            user: vote.user ? {
              id: vote.user.id,
              documentId: vote.user.documentId || `user-${vote.user.id}`,
              username: vote.user.username || ''
            } : null
          })) || [],
          comments: item.comments?.map((comment: any) => ({
            id: comment.id,
            documentId: comment.documentId || `comment-${comment.id}`,
            content: comment.content || '',
            createdAt: comment.createdAt
          })) || []
        }];
      }
      
      console.log("Resources formatées:", formattedResources.length);
      
      setResources(formattedResources);
      setTotalPages(resourcesData.meta.pagination?.pageCount || 1);
      setError(null);
      
      // Récupération des catégories
      setLoadingState('categories');
      const categoriesUrl = `${strapiUrl}/api/categories?pagination[limit]=100`;
      console.log("URL de requête catégories:", categoriesUrl);
      
      const categoriesResponse = await fetch(categoriesUrl);
      
      if (!categoriesResponse.ok) {
        throw new Error(`Erreur HTTP: ${categoriesResponse.status}`);
      }
      
      const categoriesData: StrapiResponse<any> = await categoriesResponse.json();
      
      // Log pour voir la structure exacte de la première catégorie
      if (categoriesData.data && categoriesData.data.length > 0) {
        console.log("Première catégorie reçue:", JSON.stringify(categoriesData.data[0], null, 2));
      } else {
        console.log("Aucune catégorie reçue ou format inattendu:", categoriesData);
      }
      
      // Vérifier si data est un tableau ou un objet
      console.log("Type de categoriesData.data:", Array.isArray(categoriesData.data) ? "Array" : typeof categoriesData.data);
      console.log("Structure de categoriesData:", Object.keys(categoriesData));
      
      // Si data est un tableau, vérifier sa longueur
      if (Array.isArray(categoriesData.data)) {
        console.log("Nombre de catégories reçues:", categoriesData.data.length);
      }
      
      console.log("Structure de la réponse catégories:", JSON.stringify(categoriesData, null, 2));
      
      // Transformation des données pour correspondre à notre structure
      let formattedCategories: Category[] = [];
      
      // Adapter selon que data est un tableau ou un objet
      if (Array.isArray(categoriesData.data)) {
        formattedCategories = categoriesData.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId || `category-${item.id}`,
          name: item.name || '',
          description: item.description || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt
        }));
      } else if (categoriesData.data && typeof categoriesData.data === 'object') {
        // Si data est un objet unique
        const item = categoriesData.data;
        formattedCategories = [{
          id: item.id,
          documentId: item.documentId || `category-${item.id}`,
          name: item.name || '',
          description: item.description || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt
        }];
      }
      
      console.log("Catégories formatées:", formattedCategories.length);
      
      setCategories(formattedCategories);
      setLoadingState('complete');
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      if (loadingState === 'resources') {
        setError(`Erreur lors de la récupération des ressources: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      setLoadingState('complete');
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, selectedCategory]);

  return (
    <main className="min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Ressources InMemory</h1>
      
      {loadingState === 'resources' && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          loading={loadingState === 'categories'}
        />
      </div>
      
      {resources.length > 0 ? (
        <>
          <ResourceGrid 
            resources={resources} 
            onResourceClick={setSelectedResource}
          />
          <div className="mt-8 flex justify-center">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : loadingState !== 'resources' ? (
        <div className="text-center text-gray-500 my-12">
          Aucune ressource trouvée
        </div>
      ) : null}
      
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={handleCloseDetail}
        />
      )}
    </main>
  );
}
