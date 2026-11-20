import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aurelia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (localStorage.getItem('aurelia_token')) {
        localStorage.removeItem('aurelia_token');
        localStorage.removeItem('aurelia_user');
      }
    }
    return Promise.reject(error);
  }
);

// Unified API helpers
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getCurated: () => api.get('/products/curated'),
  getBySlugOrId: (slugOrId) => api.get(`/products/${slugOrId}`),
  getRelated: (id) => api.get(`/products/${id}/related`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  updateItem: (itemId, data) => api.put(`/cart/item/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  clear: () => api.delete('/cart'),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: (productId) => api.post('/wishlist/toggle', { productId }),
  moveToCart: (data) => api.post('/wishlist/move-to-cart', data),
};

export const addressesAPI = {
  getAll: () => api.get('/addresses'),
  add: (data) => api.post('/addresses', data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.put(`/addresses/${id}/default`),
};

export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAllAdmin: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

export const paymentsAPI = {
  createOrder: (orderId) => api.post('/payments/create-order', { orderId }),
  verify: (data) => api.post('/payments/verify', data),
};

export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  add: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  getAllAdmin: () => api.get('/reviews/admin'),
  toggleApproval: (id) => api.put(`/reviews/admin/${id}/toggle`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getCustomers: () => api.get('/admin/customers'),
  uploadImage: (formData) =>
    api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
