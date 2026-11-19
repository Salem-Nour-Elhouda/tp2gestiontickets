<template>
  <div class="ticket-form-container">
    <h2>{{ isEdit ? 'Modifier le ticket' : 'Nouveau ticket' }}</h2>

    <!-- Affichage des messages d'erreur de validation ou réseau -->
    <div v-if="errorMessage" style="color: red; margin-bottom: 15px;">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="enregistrerTicket" novalidate>
      <div>
        <label>Titre *</label>
        <input v-model="ticket.titre" type="text" required>
      </div>

      <div>
        <label>Description *</label>
        <textarea v-model="ticket.description" required></textarea>
      </div>

      <div>
        <label>Demandeur *</label>
        <input v-model="ticket.demandeur" type="text" required>
      </div>

      <div>
        <label>Priorité</label>
        <select v-model="ticket.priorite">
          <option value="Basse">Basse</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Haute">Haute</option>
        </select>
      </div>

      <!-- Le statut n'est modifiable que si on édite un ticket existant -->
      <div v-if="isEdit">
        <label>Statut</label>
        <select v-model="ticket.statut">
          <option value="Ouvert">Ouvert</option>
          <option value="En cours">En cours</option>
          <option value="Résolu">Résolu</option>
          <option value="Fermé">Fermé</option>
        </select>
      </div>

      <!-- Le bouton se désactive pendant l'enregistrement pour éviter les doubles clics -->
      <button type="submit" :disabled="isSaving">
        {{ isSaving ? 'Enregistrement en cours...' : 'Enregistrer' }}
      </button>
      <router-link to="/tickets" style="margin-left: 10px;">Annuler</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getTicket, createTicket, updateTicket } from '../services/ticketService'

const router = useRouter()
const route = useRoute()

const ticket = ref({
  titre: '',
  description: '',
  demandeur: '',
  priorite: 'Basse',
  statut: 'Ouvert',
  dateCreation: ''
})

const isEdit = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')

async function chargerTicket() {
  try {
    const reponse = await getTicket(route.params.id)
    ticket.value = reponse.data
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement du ticket (inexistant ou serveur injoignable)."
  }
}

onMounted(async function () {
  // S'il y a un ID dans l'URL, ça veut dire qu'on est en mode Modification
  if (route.params.id) {
    isEdit.value = true
    await chargerTicket()
  }
})

function validerFormulaire() {
  if (!ticket.value.titre.trim() || !ticket.value.description.trim() || !ticket.value.demandeur.trim()) {
    errorMessage.value = "Veuillez remplir tous les champs obligatoires (Titre, Description, Demandeur)."
    return false
  }
  return true
}

async function enregistrerTicket() {
  if (isSaving.value) return
  if (validerFormulaire() == false) {
    return
  }

  isSaving.value = true
  errorMessage.value = ''

  try {
    if (isEdit.value == true) {
      await updateTicket(route.params.id, ticket.value)
    } else {
      // Pour un nouveau ticket : Date du jour et statut "Ouvert" obligatoires
      const dateAujourdhui = new Date()
      ticket.value.dateCreation = dateAujourdhui.toISOString().split('T')[0]
      ticket.value.statut = 'Ouvert'

      await createTicket(ticket.value)
    }
    
    // Retour automatique à la liste après l'enregistrement
    router.push('/tickets')
 } 
  catch (error) {
    errorMessage.value = "Erreur réseau lors de l'enregistrement. Vérifiez que json-server est lancé."
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.ticket-form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 25px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: #333;
}

.ticket-form-container h2 {
  margin-top: 0;
  color: #2c3e50;
}

form > div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
}

input,
textarea,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  background-color: #fff;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
}

button[type="submit"] {
  padding: 10px 20px;
  background-color: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #0b5ed7;
}

button[type="submit"]:disabled {
  background-color: #9ec5fe;
  cursor: not-allowed;
}

a {
  color: #6c757d;
}
</style>
