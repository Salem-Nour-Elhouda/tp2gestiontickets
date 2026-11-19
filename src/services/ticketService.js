import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// Toutes les fonctions retournent la réponse Axios (utiliser .data dans les composants)

export function getTickets() {
  return api.get('/tickets')
}

export function getTicket(id) {
  return api.get(`/tickets/${id}`)
}

export function createTicket(data) {
  return api.post('/tickets', data)
}

export function updateTicket(id, data) {
  return api.put(`/tickets/${id}`, data)
}

export function patchTicket(id, data) {
  return api.patch(`/tickets/${id}`, data)
}

export function deleteTicket(id) {
  return api.delete(`/tickets/${id}`)
}

// Export par défaut : permet aussi `import ticketService from ...`
export default {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  patchTicket,
  deleteTicket
}
