const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const authService = {
  register: async (email, username, password, firstName, lastName) => {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        username,
        password,
        firstName,
        lastName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  login: async (email, password) => {
    console.log("json", JSON.stringify({ email, password }));
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const cameraService = {
  getAllCameras: async (skip = 0, take = 20, activeOnly = true) => {
    const response = await fetch(
      `${API_BASE_URL}/Cameras?skip=${skip}&take=${take}&activeOnly=${activeOnly}`,
      {
        method: 'GET',
        headers: getAuthHeader(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cameras');
    }

    return response.json();
  },

  getCameraById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Cameras/${id}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Camera not found');
      }
      throw new Error('Failed to fetch camera');
    }

    return response.json();
  },

  searchCameras: async (term) => {
    if (!term.trim()) {
      throw new Error('Search term cannot be empty');
    }

    const response = await fetch(`${API_BASE_URL}/Cameras/search/${encodeURIComponent(term)}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    return response.json();
  },

  createCamera: async (camera) => {
    console.log("camera", camera);
    const response = await fetch(`${API_BASE_URL}/Cameras`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(camera),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create camera');
    }

    return response.json();
  },

  updateCamera: async (id, camera) => {
     console.log("camera", camera);
    const response = await fetch(`${API_BASE_URL}/Cameras/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(camera),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update camera');
    }

    return response.json();
  },

  deleteCamera: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Cameras/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete camera');
    }
  },
};
