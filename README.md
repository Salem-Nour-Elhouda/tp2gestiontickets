# TP – Gestion des tickets 
Ce projet consiste à développer une application web en Vue 3 permettant de consulter et de filtrer des tickets de support technique récupérés depuis une API REST simulée via JSON Server.

## Technologies utilisées
- Vue 3 (Composition API / <script setup>)

- Axios (Requêtes HTTP)

- JSON Server (API REST backend simulée)

- Vite (Outil de build et serveur de développement)

## Installation
- npm install
- npm install axios
- npm install vue-router

## Lancement
- API : npx json-server db.json --port 3000
- Vue : npm run dev

## Fonctionnalités principales
- Récupération et affichage de la liste des tickets depuis le serveur local via Axios.
- Gestion des erreurs (affichage d'un message explicatif si le serveur JSON Server est arrêté ou injoignable).
- Recherche par titre + filtres statut/priorité
- Compteur de tickets visibles + message si liste vide

## Réponses aux questions 
**Différence entre POST, PUT et PATCH ?**
POST crée une nouvelle ressource (`POST /tickets`). PUT remplace entièrement une ressource existante (`PUT /tickets/3`, tous les champs sont envoyés). PATCH modifie seulement certains champs (`PATCH /tickets/3` avec `{ "statut": "En cours" }`).

**Pourquoi une confirmation avant DELETE ?**
La suppression est définitive et ne peut pas être annulée. La confirmation évite de supprimer un ticket par erreur.

**Quel est le rôle de Vue Router ?**
Il gère la navigation dans l'application sans recharger la page : il associe chaque URL à un composant (`/tickets`, `/tickets/nouveau`, `/tickets/:id`) et permet de récupérer l'identifiant dans l'URL.

**Comment éviter les doublons lors de l'enregistrement ?**
Une variable `isSaving` désactive le bouton pendant la requête et bloque tout nouvel envoi tant que l'enregistrement n'est pas terminé. Elle est remise à `false` dans un bloc `finally`.

## Captures d'écran
Les captures d'écran de le TP sont disponibles dans le dossier captures

## Auteur 
Salem Nour Elhouda - L2DSI1 / G2 
