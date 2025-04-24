// Catégories statiques pour le test
const CATEGORIES = [
  { id: 1, name: "Articles" },
  { id: 2, name: "Vidéos" },
  { id: 3, name: "Podcasts" },
  { id: 4, name: "Livres" },
  { id: 5, name: "Outils" }
];

// Fonction pour charger les catégories (version statique)
function loadCategories() {
  const categorySelect = document.getElementById('category');
  
  // Vider les options existantes sauf la première
  while (categorySelect.options.length > 1) {
    categorySelect.remove(1);
  }
  
  // Ajouter les catégories statiques
  CATEGORIES.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

// Simuler la sauvegarde de la ressource
async function saveResource(resourceData) {
  // Pour le test, on affiche juste les données dans la console
  console.log('Données à sauvegarder:', resourceData);
  
  // Simuler un délai pour donner l'impression que ça sauvegarde
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true };
}

// Fonction pour afficher une erreur
function showError(message, elementId = null) {
  if (elementId) {
    const errorElement = document.getElementById(`${elementId}Error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  } else {
    alert(message);
  }
}

// Charger les données de la page actuelle
async function loadCurrentPageData() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, { action: 'getPageData' }, (response) => {
      if (response) {
        document.getElementById('title').value = response.title || '';
        document.getElementById('url').value = response.url || '';
        document.getElementById('description').value = response.description || '';
      }
    });
  } catch (error) {
    console.error('Erreur lors du chargement des données de la page:', error);
    showError('Impossible de récupérer les données de la page');
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadCurrentPageData();

  // Gestion du formulaire
  document.getElementById('resourceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('category').value;
    if (!category) {
      showError('Veuillez sélectionner une catégorie', 'category');
      return;
    }

    const resourceData = {
      title: document.getElementById('title').value.trim(),
      url: document.getElementById('url').value.trim(),
      description: document.getElementById('description').value.trim(),
      category: category
    };

    try {
      await saveResource(resourceData);
      alert('Ressource sauvegardée avec succès !');
      window.close();
    } catch (error) {
      showError('Erreur lors de la sauvegarde de la ressource');
    }
  });

  // Masquer l'erreur de catégorie quand l'utilisateur sélectionne une option
  document.getElementById('category').addEventListener('change', () => {
    document.getElementById('categoryError').style.display = 'none';
  });
}); 