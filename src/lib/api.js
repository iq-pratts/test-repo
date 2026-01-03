import { auth } from '@/config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get Firebase ID token for authenticated requests
 */
async function getAuthToken() {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return null;
}

/**
 * Generic API request handler
 */
async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json().catch(() => null);
}

/**
 * User API endpoints
 */
export const userAPI = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    return apiRequest('/users/profile', {
      method: 'DELETE',
    });
  },
};

/**
 * Expense API endpoints
 */
export const expenseAPI = {
  /**
   * Get all expenses for current user
   */
  getAll: async () => {
    return apiRequest('/expenses');
  },

  /**
   * Get expense by ID
   */
  getById: async (id) => {
    return apiRequest(`/expenses/${id}`);
  },

  /**
   * Create new expense
   */
  create: async (data) => {
    return apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update expense
   */
  update: async (id, data) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete expense
   */
  delete: async (id) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get expenses by date range
   */
  getByDateRange: async (startDate, endDate) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return apiRequest(`/expenses?${params}`);
  },

  /**
   * Get expenses by category
   */
  getByCategory: async (category) => {
    return apiRequest(`/expenses?category=${category}`);
  },
};

/**
 * Group API endpoints
 */
export const groupAPI = {
  /**
   * Get all groups for current user
   */
  getAll: async () => {
    return apiRequest('/groups');
  },

  /**
   * Get group by ID
   */
  getById: async (id) => {
    return apiRequest(`/groups/${id}`);
  },

  /**
   * Create new group
   */
  create: async (data) => {
    return apiRequest('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update group
   */
  update: async (id, data) => {
    return apiRequest(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete group
   */
  delete: async (id) => {
    return apiRequest(`/groups/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Add member to group
   */
  addMember: async (groupId, memberEmail) => {
    return apiRequest(`/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email: memberEmail }),
    });
  },

  /**
   * Remove member from group
   */
  removeMember: async (groupId, memberId) => {
    return apiRequest(`/groups/${groupId}/members/${memberId}`, {
      method: 'DELETE',
    });
  },
};

export default apiRequest;
