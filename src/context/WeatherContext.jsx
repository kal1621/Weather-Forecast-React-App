import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { weatherService } from '../services/weatherService';

const WeatherContext = createContext();

const initialState = {
  weatherData: null,
  recentSearches: [],
  loading: false,
  error: null,
};

function weatherReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        weatherData: action.payload,
        recentSearches: [
          action.payload.name,
          ...state.recentSearches.filter(city => city !== action.payload.name)
        ].slice(0, 5), // Keep only 5 recent searches
      };
    
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const fetchWeather = useCallback(async (city) => {
    if (!city?.trim()) return;
    
    dispatch({ type: 'FETCH_START' });
    
    try {
      const data = await weatherService.getCurrentWeather(city);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        ...state,
        fetchWeather,
        clearError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}