const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('pet_cafe_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Pets
  async getPets(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/pets?${qs}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getPetById(id) {
    const res = await fetch(`${API_BASE}/pets/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async createPet(data) {
    const res = await fetch(`${API_BASE}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePet(id, data) {
    const res = await fetch(`${API_BASE}/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePetStatus(id, status) {
    const res = await fetch(`${API_BASE}/pets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async deletePet(id) {
    const res = await fetch(`${API_BASE}/pets/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Menu
  async getMenu(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/menu?${qs}`);
    return res.json();
  },

  async createMenuItem(data) {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateMenuItem(id, data) {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async toggleMenuAvailability(id) {
    const res = await fetch(`${API_BASE}/menu/${id}/availability`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async deleteMenuItem(id) {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Reservations
  async checkAvailability(date) {
    const res = await fetch(`${API_BASE}/reservations/availability?date=${date}`);
    return res.json();
  },

  async createReservation(data) {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMyReservations() {
    const res = await fetch(`${API_BASE}/reservations/my`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAllReservations(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/reservations?${qs}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateReservationStatus(id, status) {
    const res = await fetch(`${API_BASE}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async cancelReservation(id) {
    const res = await fetch(`${API_BASE}/reservations/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Orders
  async createOrder(data) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAllOrders(status) {
    const qs = status ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE}/orders${qs}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Payments
  async processPayment(data) {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Reviews
  async getReviews() {
    const res = await fetch(`${API_BASE}/reviews`);
    return res.json();
  },

  async getAllReviews() {
    const res = await fetch(`${API_BASE}/reviews/all`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async submitReview(data) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async moderateReview(id, status) {
    const res = await fetch(`${API_BASE}/reviews/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async updateUser(id, data) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  }
};
