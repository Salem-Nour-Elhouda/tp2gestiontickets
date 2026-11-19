# TP – Consultation des tickets 
Ce projet consiste à développer une application web en Vue 3 permettant de consulter et de filtrer des tickets de support technique récupérés depuis une API REST simulée via JSON Server.

## Technologies utilisées
- Vue 3 (Composition API / <script setup>)

- Axios (Requêtes HTTP)

- JSON Server (API REST backend simulée)

- Vite (Outil de build et serveur de développement)

## Installation
- npm install
- npm install axios

## Lancement
- API : npx json-server db.json --port 3000
- Vue : npm run dev

## Fonctionnalités principales
- Récupération et affichage de la liste des tickets depuis le serveur local via Axios.
- Gestion des erreurs (affichage d'un message explicatif si le serveur JSON Server est arrêté ou injoignable).
- Recherche par titre + filtres statut/priorité
- Compteur de tickets visibles + message si liste vide

## Réponses aux questions 
- **API REST vs db.json :** db.json est seulement un fichier de données. Une API REST est une interface HTTP (URL + méthodes GET/POST/PUT/PATCH/DELETE) qui permet d'accéder aux données. JSON Server crée l'API à partir du fichier.

- **Pourquoi onMounted() :** pour déclencher l'appel API (via Axios) automatiquement dès que le composant est initialisé et affiché dans le DOM.

- **Rôle d'Axios :** client HTTP qui simplifie les requêtes vers l'API (base URL, JSON automatique, gestion des erreurs).

- **ref() vs computed() :** ref() stocker une donnée que l'on peut modifier directement (comme le texte de recherche), computed() pour des données calculées qui se rafraîchissent toute seule quand l'état change.

## Difficultés rencontrées
- Erreur EADDRINUSE (port 3000 déjà utilisé) : JSON Server tournait déjà dans un autre terminal.

## Captures d'écran
![Les captures d'écran de le TP sont disponibles dans le dossier captures]

## Auteur 
Salem Nour Elhouda - L2DSI1 / G2 