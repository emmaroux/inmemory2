// Fonction pour récupérer les métadonnées de la page
function getPageMetadata() {
  const metadata = {
    title: document.title,
    url: window.location.href,
    description: ''
  };

  // Essayer différentes sources pour la description
  const possibleDescriptionSources = [
    // Meta description
    document.querySelector('meta[name="description"]'),
    // Open Graph description
    document.querySelector('meta[property="og:description"]'),
    // Twitter description
    document.querySelector('meta[name="twitter:description"]'),
    // Article description
    document.querySelector('meta[name="article:description"]')
  ];

  // Chercher le premier paragraphe comme fallback
  const firstParagraph = document.querySelector('p');

  for (const source of possibleDescriptionSources) {
    if (source && source.getAttribute('content')) {
      metadata.description = source.getAttribute('content');
      break;
    }
  }

  // Si aucune description n'est trouvée, utiliser le premier paragraphe
  if (!metadata.description && firstParagraph) {
    metadata.description = firstParagraph.textContent.trim().substring(0, 200) + '...';
  }

  return metadata;
}

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageData') {
    const metadata = getPageMetadata();
    sendResponse(metadata);
  }
  return true;
}); 