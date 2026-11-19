import { createRouter, createWebHistory } from 'vue-router'
import TicketList from '../views/TicketList.vue'
import TicketForm from '../views/TicketForm.vue'
import TicketDetail from '../views/TicketDetail.vue'

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/tickets', name: 'TicketList', component: TicketList },
  // "nouveau" doit être déclaré AVANT ":id", sinon "nouveau" serait pris pour un id
  { path: '/tickets/nouveau', name: 'TicketCreate', component: TicketForm },
  // Route d'édition : le formulaire passe en mode modification grâce à params.id
  { path: '/tickets/:id/modifier', name: 'TicketEdit', component: TicketForm },
  { path: '/tickets/:id', name: 'TicketDetail', component: TicketDetail },
  // URL inconnue : retour à la liste
  { path: '/:pathMatch(.*)*', redirect: '/tickets' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
