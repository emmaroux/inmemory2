const fs = require('fs');
const path = require('path');

function cleanCollections() {
  const apiPath = path.join(__dirname, '..', 'src', 'api');
  
  // Collections à supprimer
  const collectionsToRemove = [
    'memory',
    'category',
    'comment'
  ];

  collectionsToRemove.forEach(collection => {
    const collectionPath = path.join(apiPath, collection);
    if (fs.existsSync(collectionPath)) {
      fs.rmSync(collectionPath, { recursive: true, force: true });
      console.log(`Collection ${collection} supprimée`);
    }
  });
}

cleanCollections(); 