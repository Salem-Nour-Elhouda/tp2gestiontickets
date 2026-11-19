<script setup>
import { ref, computed, onMounted } from 'vue';
import { getTickets, patchTicket, deleteTicket } from '../services/ticketService';

const STATUTS = ['Ouvert', 'En cours', 'Résolu', 'Fermé'];

const tickets = ref([]);
const chargement = ref(true);
const erreur = ref(null);
const erreurAction = ref(null);

function statutSuivant(statut) {
  const i = STATUTS.indexOf(statut);
  return i >= 0 && i < STATUTS.length - 1 ? STATUTS[i + 1] : null;
}

async function avancerStatut(ticket) {
  const suivant = statutSuivant(ticket.statut);
  if (!suivant) return;
  try {
    erreurAction.value = null;
    const reponse = await patchTicket(ticket.id, { statut: suivant });
    ticket.statut = reponse.data.statut;
  } catch (e) {
    erreurAction.value = "Impossible de changer le statut (serveur injoignable ?).";
  }
}

async function supprimer(ticket) {
  if (!window.confirm('Voulez-vous vraiment supprimer le ticket « ' + ticket.titre + ' » ?')) return;
  try {
    erreurAction.value = null;
    await deleteTicket(ticket.id);
    tickets.value = tickets.value.filter(function(t) { return t.id !== ticket.id; });
  } catch (e) {
    erreurAction.value = "Impossible de supprimer le ticket (serveur injoignable ?).";
  }
}

const rechercheTitre = ref('');
const filtreStatut = ref('');
const filtrePriorite = ref('');

onMounted(async function() {
  try {
    chargement.value = true;
    erreur.value = null;
    const reponse = await getTickets();
    tickets.value = reponse.data;
  } catch (e) {
    erreur.value = "Impossible de charger les tickets. Vérifiez que JSON Server est bien démarré sur le port 3000.";
  } finally {
    chargement.value = false;
  }
});

const ticketsFiltres = computed(function() {
  return tickets.value.filter(function(ticket)
   {
    const correspondTitre = ticket.titre.toLowerCase().includes(rechercheTitre.value.toLowerCase());
    const correspondStatut = filtreStatut.value == '' || ticket.statut == filtreStatut.value;
    const correspondPriorite = filtrePriorite.value == '' || ticket.priorite == filtrePriorite.value;
    return correspondTitre && correspondStatut && correspondPriorite;
  });
});

function getClassePriorite(priorite) 
{
  if (priorite == 'Haute') return 'badge priorite-haute';
  if (priorite == 'Moyenne') return 'badge priorite-moyenne';
  return 'badge priorite-basse';
}

function getClasseStatut(statut)
{
  if (statut == 'Ouvert') return 'badge statut-ouvert';
  if (statut == 'En cours') return 'badge statut-encours';
  if (statut == 'Résolu') return 'badge statut-resolu';
  return 'badge statut-ferme';
}
</script>

<template>
  <div class="container">
    <h1>Suivi des tickets de support</h1>

    <div class="filtres">
      <input 
        type="text" 
        v-model="rechercheTitre" 
        placeholder="Rechercher par titre..." 
      />

      <select v-model="filtreStatut">
        <option value="">Tous les statuts</option>
        <option value="Ouvert">Ouvert</option>
        <option value="En cours">En cours</option>
        <option value="Résolu">Résolu</option>
        <option value="Fermé">Fermé</option>
      </select>

      <select v-model="filtrePriorite">
        <option value="">Toutes les priorités</option>
        <option value="Haute">Haute</option>
        <option value="Moyenne">Moyenne</option>
        <option value="Basse">Basse</option>
      </select>
    </div>

    <div v-if="chargement" class="message">
      Chargement...
    </div>

    <div v-else-if="erreur" class="message erreur">
      {{ erreur }}
    </div>

    <div v-else>
      <div v-if="erreurAction" class="message erreur">{{ erreurAction }}</div>

      <p class="compteur">
        Nombre de tickets visibles : <strong>{{ ticketsFiltres.length }}</strong>
      </p>

      <div v-if="ticketsFiltres.length === 0" class="message">
        Aucun ticket ne correspond à vos critères de recherche.
      </div>

      <div v-else class="liste-tickets">
        <div v-for="ticket in ticketsFiltres" :key="ticket.id" class="carte-ticket">
          <div class="entete-ticket">
            <h3>
              <router-link :to="'/tickets/' + ticket.id">{{ ticket.titre }}</router-link>
            </h3>
            <div class="badges">
              <span :class="getClassePriorite(ticket.priorite)" :aria-label="'Priorité : ' + ticket.priorite">
                {{ ticket.priorite }}
              </span>
              <span :class="getClasseStatut(ticket.statut)" :aria-label="'Statut : ' + ticket.statut">
                {{ ticket.statut }}
              </span>
            </div>
          </div>
          <p class="description">{{ ticket.description }}</p>
          <div class="pied-ticket">
            <span>Demandeur : <strong>{{ ticket.demandeur }}</strong></span>
            <span>Date : {{ ticket.dateCreation }}</span>
          </div>
          <div class="actions">
            <button v-if="statutSuivant(ticket.statut)" @click="avancerStatut(ticket)">
              Passer à « {{ statutSuivant(ticket.statut) }} »
            </button>
            <router-link :to="'/tickets/' + ticket.id + '/modifier'" class="btn-lien">Modifier</router-link>
            <button class="btn-danger" @click="supprimer(ticket)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 25px;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: #333;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.filtres {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filtres input, .filtres select {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  flex: 1;
  background-color: #fff;
  color: #333;
  font-size: 14px;
}

.message {
  padding: 15px;
  background-color: #e9ecef;
  border-radius: 6px;
  text-align: center;
  color: #495057;
}

.erreur {
  background-color: #f8d7da;
  color: #842029;
  border: 1px solid #f5c2c7;
}

.compteur {
  margin-bottom: 15px;
  color: #495057;
}

.liste-tickets {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.carte-ticket {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 18px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  color: #212529;
}

.entete-ticket {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entete-ticket h3 {
  margin: 0;
  color: #212529;
  font-size: 1.15em;
}

.description {
  color: #495057;
  margin: 10px 0;
}

.badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
  color: white;
}

.priorite-haute { background-color: #dc3545; }
.priorite-moyenne { background-color: #fd7e14; }
.priorite-basse { background-color: #28a745; }

.statut-ouvert { background-color: #0d6efd; }
.statut-encours { background-color: #6f42c1; }
.statut-resolu { background-color: #198754; }
.statut-ferme { background-color: #6c757d; }

.entete-ticket h3 a { color: #212529; text-decoration: none; }
.entete-ticket h3 a:hover { text-decoration: underline; }

.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.actions button, .btn-lien {
  padding: 6px 12px;
  border: 1px solid #0d6efd;
  border-radius: 6px;
  background: #fff;
  color: #0d6efd;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
}

.actions .btn-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.pied-ticket {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: #6c757d;
  margin-top: 12px;
  border-top: 1px solid #f1f3f5;
  padding-top: 12px;
}
</style>