'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="inline-flex">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 text-sm font-medium rounded-l-md ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } border border-gray-300`}
      >
        Précédent
      </button>
      <div className="flex">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = currentPage <= 3
            ? i + 1
            : currentPage >= totalPages - 2
              ? totalPages - 4 + i
              : currentPage - 2 + i;
          
          if (pageNum <= 0 || pageNum > totalPages) return null;
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 text-sm font-medium ${
                currentPage === pageNum
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 text-sm font-medium rounded-r-md ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } border border-gray-300`}
      >
        Suivant
      </button>
    </nav>
  );
} 