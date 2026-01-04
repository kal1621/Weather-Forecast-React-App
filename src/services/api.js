import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_OPENWEATHER_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add API key to all requests
    config.params = {
      ...config.params,
      appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
      units: 'metric',
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (!response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    if (response.status === 401) {
      return Promise.reject(new Error('Invalid API key.'));
    }
    
    if (response.status === 404) {
      return Promise.reject(new Error('City not found.'));
    }
    
    if (response.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    return Promise.reject(error);
  }
);

export default api;