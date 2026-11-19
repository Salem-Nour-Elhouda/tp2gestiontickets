<template>
  <div class="ticket-detail">
    <h2>Détail du Ticket</h2>

    <div v-if="error" class="error-message">
      <p style="color: red;">{{ error }}</p>
      <router-link to="/tickets">Retour à la liste</router-link>
    </div>

    <div v-else-if="ticket">
      <p>ID : {{ ticket.id }}</p>
      <p>Titre : {{ ticket.titre }}</p>
      <p>Description : {{ ticket.description }}</p>
      <p>Demandeur : {{ ticket.demandeur }}</p>
      <p>Priorité : {{ ticket.priorite }}</p>
      <p>Statut : {{ ticket.statut }}</p>
      <p>Date de création : {{ ticket.dateCreation }}</p>

      <router-link :to="'/tickets/' + ticket.id + '/modifier'">Modifier</router-link> |
      <router-link to="/tickets">Retour à la liste</router-link>
    </div>

    <div v-else>
      <p>Chargement...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTicket } from '../services/ticketService'

const route = useRoute()
const ticket = ref(null)
const error = ref(null)

async function fetchTicketDetail() {
  try {
    const reponse = await getTicket(route.params.id)
    ticket.value = reponse.data
  } catch (err) {
    if (err.response && err.response.status === 404) {
      error.value = "Erreur 404 : le ticket n°" + route.params.id + " n'existe pas."
    } else {
      error.value = "Erreur réseau : serveur injoignable. Vérifiez que JSON Server est lancé."
    }
  }
}

onMounted(function () {
  fetchTicketDetail()
})
</script>