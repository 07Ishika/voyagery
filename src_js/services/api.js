/**
 * Frontend API client — OOP singleton matching backend REST resources.
 * Only methods the UI actually uses (YAGNI).
 */
const API_BASE_URL = `${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api`;
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000';

class ApiService {
  async fetchData(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Profiles
  getProfile(userId) {
    return this.fetchData(`/profile/${userId}`);
  }

  saveProfile(profileData) {
    return this.fetchData('/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Guide sessions
  getGuideSessions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.fetchData(`/guide-sessions${queryParams ? `?${queryParams}` : ''}`);
  }

  createGuideSession(sessionData) {
    return this.fetchData('/guide-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  updateGuideSession(sessionId, updateData) {
    return this.fetchData(`/guide-sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Documents
  async uploadDocument(file, documentData) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', documentData.userId);
    formData.append('documentType', documentData.documentType);
    formData.append('country', documentData.country);
    if (documentData.description) {
      formData.append('description', documentData.description);
    }

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async downloadDocument(fileId) {
    const response = await fetch(`${API_BASE_URL}/documents/download/${fileId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  deleteDocument(documentId) {
    return this.fetchData(`/documents/${documentId}`, { method: 'DELETE' });
  }

  // Search & dashboard
  searchGuides(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.fetchData(`/guides/search${queryParams ? `?${queryParams}` : ''}`);
  }

  getDashboardStats(userId) {
    return this.fetchData(`/dashboard/${userId}`);
  }

  // Auth
  async getCurrentUser() {
    const response = await fetch(`${AUTH_BASE_URL}/auth/user`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Not authenticated');
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async logout() {
    const response = await fetch(`${AUTH_BASE_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

const apiService = new ApiService();
export default apiService;
