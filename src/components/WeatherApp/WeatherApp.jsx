import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useWeatherContext } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from '../SearchBar';
import WeatherCard from '../WeatherCard';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import './WeatherApp.css';

const WeatherApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', []);
  const debouncedQuery = useDebounce(searchQuery, 500);
  
  const { weatherData, loading, error, fetchWeather, recentSearches: contextSearches } = useWeatherContext();
  const { isDarkMode, toggleTheme } = useTheme();

  const memoizedFetchWeather = useCallback(fetchWeather, [fetchWeather]);

  // Initial fetch
  useEffect(() => {
    if (!weatherData && !searchQuery) {
      memoizedFetchWeather('London');
    }
  }, [memoizedFetchWeather, weatherData, searchQuery]);

  // Fetch weather when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      memoizedFetchWeather(debouncedQuery);
    }
  }, [debouncedQuery, memoizedFetchWeather]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      memoizedFetchWeather(searchQuery);
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
      }
    }
  }, [searchQuery, memoizedFetchWeather, recentSearches, setRecentSearches]);

  const handleRecentSearchClick = useCallback((city) => {
    setSearchQuery(city);
    memoizedFetchWeather(city);
  }, [memoizedFetchWeather]);

  const handleClearRecent = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  const getTimeOfDay = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }, []);

  // Safe data access functions
  const getSafeCoord = useCallback(() => {
    if (!weatherData?.coord) return { lat: 0, lon: 0 };
    return {
      lat: weatherData.coord.lat || 0,
      lon: weatherData.coord.lon || 0
    };
  }, [weatherData]);

  const getSafeMain = useCallback(() => {
    if (!weatherData?.main) return { temp: 0, feels_like: 0, humidity: 0, pressure: 0 };
    return {
      temp: weatherData.main.temp || 0,
      feels_like: weatherData.main.feels_like || 0,
      humidity: weatherData.main.humidity || 0,
      pressure: weatherData.main.pressure || 0
    };
  }, [weatherData]);

  const getSafeWind = useCallback(() => {
    if (!weatherData?.wind) return { speed: 0 };
    return {
      speed: weatherData.wind.speed || 0,
      deg: weatherData.wind.deg || 0
    };
  }, [weatherData]);

  const getSafeClouds = useCallback(() => {
    if (!weatherData?.clouds) return { all: 0 };
    return {
      all: weatherData.clouds.all || 0
    };
  }, [weatherData]);

  const getSafeWeather = useCallback(() => {
    if (!weatherData?.weather || !Array.isArray(weatherData.weather) || weatherData.weather.length === 0) {
      return [{ main: 'Clear', description: 'clear sky', icon: '01d' }];
    }
    return weatherData.weather;
  }, [weatherData]);

  const getSafeVisibility = useCallback(() => {
    return weatherData?.visibility || 10000;
  }, [weatherData]);

  const coord = getSafeCoord();
  const main = getSafeMain();
  const wind = getSafeWind();
  const clouds = getSafeClouds();
  const weatherArray = getSafeWeather();
  const currentWeather = weatherArray[0];
  const visibility = getSafeVisibility();

  return (
    <div className="weather-app">
      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Header */}
      <header className="weather-header">
        <h1>🌤️ Weather Forecast</h1>
        <p className="greeting">Good {getTimeOfDay()}! Search for a city to get current weather information.</p>
      </header>

      {/* Main Content */}
      <main className="weather-main">
        {/* Search Section */}
        <section className="search-section">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            onSearch={handleSearchSubmit}
            placeholder="Enter city name (e.g., London, New York, Tokyo)..."
            disabled={loading}
          />
          
          <div className="search-tips">
            <p>💡 <strong>Tip:</strong> Start typing to search. Results update automatically after 500ms.</p>
          </div>
        </section>

        {/* Weather Display Section */}
        <section className="weather-display-section">
          {loading && (
            <div className="loading-container">
              <LoadingSpinner 
                size="large" 
                message="Fetching weather data..." 
              />
            </div>
          )}

          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={() => memoizedFetchWeather(searchQuery || 'London')}
              showRetry={true}
            />
          )}

          {weatherData && !loading && !error && (
            <div className="weather-result">
              <div className="weather-location-info">
                <h2>
                  📍 {weatherData.name || 'Unknown City'}, {weatherData.sys?.country || ''}
                  <span className="coordinates">
                    ({coord.lat.toFixed(2)}°, {coord.lon.toFixed(2)}°)
                  </span>
                </h2>
                <p className="last-updated">
                  Last updated: {weatherData.dt ? new Date(weatherData.dt * 1000).toLocaleTimeString() : 'Just now'}
                </p>
              </div>
              
              <div className="weather-grid">
                <div className="weather-main-card">
                  <WeatherCard weather={weatherData} />
                </div>
                
                <div className="weather-details-card">
                  <div className="details-header">
                    <h3>🌡️ Additional Details</h3>
                  </div>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Feels Like</span>
                      <span className="detail-value">
                        {Math.round(main.feels_like)}°C
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Humidity</span>
                      <span className="detail-value">
                        {main.humidity}%
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Wind Speed</span>
                      <span className="detail-value">
                        {wind.speed.toFixed(1)} m/s
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pressure</span>
                      <span className="detail-value">
                        {main.pressure} hPa
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Visibility</span>
                      <span className="detail-value">
                        {(visibility / 1000).toFixed(1)} km
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Cloudiness</span>
                      <span className="detail-value">
                        {clouds.all}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Results Message */}
          {!weatherData && !loading && !error && searchQuery && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No weather data found</h3>
              <p>Try searching for a different city or check your spelling.</p>
            </div>
          )}

          {/* Welcome Message */}
          {!weatherData && !loading && !error && !searchQuery && (
            <div className="welcome-message">
              <div className="welcome-icon">🌎</div>
              <h3>Welcome to Weather Forecast</h3>
              <p>Enter a city name in the search bar above to get started!</p>
              <div className="example-cities">
                <p>Try these examples:</p>
                <div className="city-tags">
                  {['London', 'New York', 'Tokyo', 'Paris', 'Sydney'].map(city => (
                    <button
                      key={city}
                      className="city-tag"
                      onClick={() => handleRecentSearchClick(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Recent Searches Section */}
        {(recentSearches.length > 0 || contextSearches.length > 0) && (
          <section className="recent-searches-section">
            <div className="section-header">
              <h3>📋 Recent Searches</h3>
              <button 
                className="clear-recent-btn" 
                onClick={handleClearRecent}
                title="Clear all recent searches"
              >
                Clear All
              </button>
            </div>
            
            <div className="recent-tags">
              {[...new Set([...recentSearches, ...contextSearches])].slice(0, 8).map((city, index) => (
                <button
                  key={`${city}-${index}`}
                  className="recent-tag"
                  onClick={() => handleRecentSearchClick(city)}
                  title={`Search ${city} again`}
                >
                  {city}
                  <span className="tag-close" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentSearches(prev => prev.filter(c => c !== city));
                    }}
                    title="Remove from recent"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="weather-footer">
        <div className="footer-content">
          <p>
            <strong>Weather Forecast App</strong> • Built with React & WeatherAPI
          </p>
          <p className="footer-note">
            Data provided by WeatherAPI • Updates in real-time
          </p>
        </div>
        <div className="footer-links">
          <a 
            href="https://www.weatherapi.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            API Documentation
          </a>
          <a 
            href="https://www.weatherapi.com/terms.aspx" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          <a 
            href="https://www.weatherapi.com/privacy.aspx" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default WeatherApp;