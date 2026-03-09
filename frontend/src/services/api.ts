import http from './http';

// User APIs
export const userAPI = {
  register: (data: { phone: string; nickname: string; password: string }) =>
    http.post('/users/register', data),
  
  login: (data: { phone: string; password: string }) =>
    http.post('/users/login', data),
  
  getById: (id: number) => http.get(`/users/${id}`),
  
  updateProfile: (id: number, data: { nickname?: string; avatar?: string }) =>
    http.put(`/users/${id}`, data),

  signIn: (id: number) => http.post(`/users/${id}/sign`),

  getAssets: (id: number) => http.get(`/users/${id}/assets`)
};

// Pet APIs
export const petAPI = {
  createPet: (data: { userId: number; name: string; type: string }) =>
    http.post('/pets', data),
  
  listPetsByUser: (userId: number) => http.get(`/pets/user/${userId}`),

  getTypes: () => http.get('/pets/types'),
  
  getPetById: (id: number) =>
    http.get(`/pets/${id}`),
  
  updatePet: (id: number, data: any) =>
    http.put(`/pets/${id}`, data),

  action: (id: number, action: string) =>
    http.post(`/pets/${id}/action`, { action }),
  
  deletePet: (id: number) =>
    http.delete(`/pets/${id}`)
};

// Health check
export const healthAPI = {
  check: () => http.get('/health')
};

// Tasks APIs
export const tasksAPI = {
  list: (userId: number) => http.get(`/tasks?userId=${userId}`),
  daily: (userId: number) => http.get(`/tasks/daily?userId=${userId}`),
  claim: (taskId: number, userId: number) => http.post(`/tasks/${taskId}/claim`, { userId })
};

// Shop APIs
export const shopAPI = {
  categories: () => http.get('/shop/categories'),
  products: (category?: string) => category ? http.get(`/shop?category=${category}`) : http.get('/shop'),
  buy: (userId: number, productId: number, quantity = 1) => http.post('/shop/buy', { userId, productId, quantity }),
  inventory: (userId: number) => http.get(`/shop/inventory?userId=${userId}`),
  use: (userId: number, productId: number, petId: number) => http.post('/shop/use', { userId, productId, petId })
};

// Achievements APIs
export const achievementsAPI = {
  categories: () => http.get('/achievements/categories'),
  list: (userId: number, category?: string) =>
    category ? http.get(`/achievements?userId=${userId}&category=${category}`) : http.get(`/achievements?userId=${userId}`),
  claim: (achievementId: number, userId: number) => http.post(`/achievements/${achievementId}/claim`, { userId })
};
