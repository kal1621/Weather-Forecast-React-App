import React, { useState } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const debouncedCity = useDebounce(city, 500);
  const { weatherData, loading, error, fetchWeather } = useWeather();

  // Fetch weather when debounced city changes
  React.useEffect(() => {
    if (debouncedCity) {
      fetchWeather(debouncedCity);
    }
  }, [debouncedCity, fetchWeather]);

  const handleSearch = () => {
    if (city) {
      fetchWeather(city);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤️ Weather Dashboard</h1>
        <p>Get real-time weather information for any city</p>
      </header>

      <main className="app-main">
        <div className="search-container">
          <SearchBar
            value={city}
            onChange={setCity}
            onSearch={handleSearch}
            placeholder="Enter city name (e.g., London, Tokyo, New York)"
          />
        </div>

        <div className="weather-container">
          {loading && <LoadingSpinner />}
          
          {error && <ErrorMessage message={error} />}
          
          {weatherData && !loading && !error && (
            <WeatherCard weather={weatherData} />
          )}
          
          {!weatherData && !loading && !error && city && (
            <div className="no-data">
              <p>Type a city name to see the weather</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by OpenWeather API</p>
      </footer>
    </div>
  );
}

export default App;