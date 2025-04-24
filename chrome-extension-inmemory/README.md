# Extension Chrome InMemory

Cette extension permet de sauvegarder facilement des ressources web dans votre base de données Strapi.

## Fonctionnalités

- Récupération automatique des métadonnées de la page (titre, URL, description)
- Sélection de la catégorie depuis votre base Strapi
- Sauvegarde directe dans votre base de données

## Installation

1. Ouvrez Chrome et allez dans `chrome://extensions/`
2. Activez le "Mode développeur" en haut à droite
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier `chrome-extension-inmemory`

## Utilisation

1. Naviguez sur une page web que vous souhaitez sauvegarder
2. Cliquez sur l'icône de l'extension dans la barre d'outils
3. Vérifiez/modifiez les informations récupérées
4. Sélectionnez une catégorie
5. Cliquez sur "Sauvegarder"

## Configuration

Assurez-vous que votre serveur Strapi est en cours d'exécution sur `http://localhost:1337`.

## Développement

Pour modifier l'extension :
- `manifest.json` : Configuration de l'extension
- `popup.html` : Interface utilisateur
- `popup.js` : Logique de l'interface
- `content.js` : Script qui s'exécute sur les pages web
- `background.js` : Script de fond de l'extension 