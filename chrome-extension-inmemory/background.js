// Service worker de l'extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension InMemory installée');
});

// Gestion des messages entre les différents composants
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveResource') {
    // Logique supplémentaire si nécessaire
    sendResponse({ success: true });
  }
  return true;
}); 