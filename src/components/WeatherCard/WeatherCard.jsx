import React from 'react';
import './WeatherCard.css';

function WeatherCard({ weather }) {
  if (!weather) return null;

  // Safe data access
  const cityName = weather.name || 'Unknown City';
  const country = weather.sys?.country || '';
  const temp = Math.round(weather.main?.temp || 0);
  const feelsLike = Math.round(weather.main?.feels_like || 0);
  const humidity = weather.main?.humidity || 0;
  const windSpeed = weather.wind?.speed?.toFixed(1) || '0.0';
  const pressure = weather.main?.pressure || 0;
  const description = weather.weather?.[0]?.description || 'No data';
  const iconCode = weather.weather?.[0]?.icon || '01d';
  
  const iconUrl = `${process.env.REACT_APP_WEATHER_ICON_URL || 'https://openweathermap.org/img/wn'}/${iconCode}@2x.png`;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>
          {cityName}, {country}
        </h2>
        <img src={iconUrl} alt={description} />
      </div>
      
      <div className="weather-details">
        <p className="temperature">{temp}°C</p>
        <p className="description">{description}</p>
        
        <div className="weather-grid">
          <div className="weather-item">
            <span>Feels Like</span>
            <strong>{feelsLike}°C</strong>
          </div>
          <div className="weather-item">
            <span>Humidity</span>
            <strong>{humidity}%</strong>
          </div>
          <div className="weather-item">
            <span>Wind</span>
            <strong>{windSpeed} m/s</strong>
          </div>
          <div className="weather-item">
            <span>Pressure</span>
            <strong>{pressure} hPa</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;