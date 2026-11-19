<template>
  <div id="app">
    <header class="app-header">
      <h1>Gestion des Tickets de Maintenance</h1>
      <nav>
        <router-link to="/tickets">Liste des tickets</router-link> |
        <router-link to="/tickets/nouveau">Nouveau ticket</router-link>
      </nav>
    </header>

    <main class="app-main">
      <!-- affichage de les vues selon la route active -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-header nav {
  margin-top: 10px;
}

.app-header nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.app-header nav a.router-link-active {
  color: #0056b3;
  text-decoration: underline;
}
</style>