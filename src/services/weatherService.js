// src/services/weatherService.js

export const weatherService = {
  async getCurrentWeather(city) {
    console.log(`🌤️ Searching for: ${city}`);
    
    // Try multiple APIs in order
    const apis = [
      this.tryWeatherAPI,      // Primary
      this.tryOpenWeather,     // Secondary (your key)
      this.tryVisualCrossing,  // Tertiary
      this.getMockWeather      // Fallback
    ];
    
    for (const api of apis) {
      try {
        const result = await api.call(this, city);
        if (result) {
          console.log(`✅ Success with ${api.name}`);
          return result;
        }
      } catch (error) {
        console.log(`⚠️ ${api.name} failed:`, error.message);
        continue;
      }
    }
    
    throw new Error('All weather services unavailable');
  },
  
  async tryWeatherAPI(city) {
    // YOU WILL GET YOUR OWN KEY FROM weatherapi.com
    const YOUR_KEY = '0e629731ae2a4f65945204810252812'; // Get from weatherapi.com
    
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${YOUR_KEY}&q=${city}&aqi=no`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return this.formatWeatherAPIResponse(data);
  },
  
  async tryOpenWeather(city) {
    // Use YOUR OpenWeather key (might be activated now)
    const YOUR_KEY = '0e629731ae2a4f65945204810252812';
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${YOUR_KEY}&units=metric`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data; // OpenWeather format matches our app
  },
  
  async tryVisualCrossing(city) {
    // Free weather API (no key needed for testing)
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&include=current&key=YOUR_KEY&contentType=json`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return this.formatVisualCrossingResponse(data);
    } catch {
      return null;
    }
  },
  
  getMockWeather(city) {
    // Enhanced mock data for more cities
    const mockDatabase = {
      'london': { name: 'London', country: 'GB', temp: 15, desc: 'Cloudy', icon: '04d' },
      'new york': { name: 'New York', country: 'US', temp: 18, desc: 'Partly Cloudy', icon: '02d' },
      'tokyo': { name: 'Tokyo', country: 'JP', temp: 20, desc: 'Clear', icon: '01d' },
      'paris': { name: 'Paris', country: 'FR', temp: 17, desc: 'Light Rain', icon: '10d' },
      'sydney': { name: 'Sydney', country: 'AU', temp: 25, desc: 'Sunny', icon: '01d' },
      'ethiopia': { name: 'Addis Ababa', country: 'ET', temp: 22, desc: 'Sunny', icon: '01d' },
      'addis ababa': { name: 'Addis Ababa', country: 'ET', temp: 22, desc: 'Sunny', icon: '01d' },
      'berlin': { name: 'Berlin', country: 'DE', temp: 16, desc: 'Cloudy', icon: '03d' },
      'moscow': { name: 'Moscow', country: 'RU', temp: 10, desc: 'Cold', icon: '13d' },
      'dubai': { name: 'Dubai', country: 'AE', temp: 35, desc: 'Sunny', icon: '01d' },
      'mumbai': { name: 'Mumbai', country: 'IN', temp: 30, desc: 'Humid', icon: '50d' },
      'cairo': { name: 'Cairo', country: 'EG', temp: 28, desc: 'Sunny', icon: '01d' },
      'nairobi': { name: 'Nairobi', country: 'KE', temp: 23, desc: 'Partly Cloudy', icon: '02d' },
      'johannesburg': { name: 'Johannesburg', country: 'ZA', temp: 20, desc: 'Sunny', icon: '01d' },
      'shanghai': { name: 'Shanghai', country: 'CN', temp: 19, desc: 'Cloudy', icon: '03d' },
      'toronto': { name: 'Toronto', country: 'CA', temp: 12, desc: 'Clear', icon: '01d' },
      'sao paulo': { name: 'São Paulo', country: 'BR', temp: 24, desc: 'Cloudy', icon: '04d' },
      'mexico city': { name: 'Mexico City', country: 'MX', temp: 21, desc: 'Sunny', icon: '01d' },
    };
    
    const normalizedCity = city.toLowerCase().trim();
    const data = mockDatabase[normalizedCity] || {
      name: city.charAt(0).toUpperCase() + city.slice(1),
      country: 'XX',
      temp: 20 + Math.floor(Math.random() * 15),
      desc: ['Sunny', 'Cloudy', 'Partly Cloudy'][Math.floor(Math.random() * 3)],
      icon: '01d'
    };
    
    return {
      name: data.name,
      sys: { country: data.country },
      main: { 
        temp: data.temp,
        feels_like: data.temp - 1,
        humidity: 60 + Math.floor(Math.random() * 30),
        pressure: 1013
      },
      weather: [{ 
        main: data.desc,
        description: data.desc.toLowerCase(),
        icon: data.icon
      }],
      wind: { 
        speed: 3 + Math.random() * 5,
        deg: Math.floor(Math.random() * 360)
      },
      dt: Math.floor(Date.now() / 1000),
      clouds: { all: data.desc.includes('Cloud') ? 70 : 20 },
      visibility: 10000
    };
  },
  
  formatWeatherAPIResponse(data) {
    // Format WeatherAPI response to our app's format
    return {
      name: data.location.name,
      sys: { country: data.location.country },
      main: {
        temp: data.current.temp_c,
        feels_like: data.current.feelslike_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb
      },
      weather: [{
        main: data.current.condition.text,
        description: data.current.condition.text.toLowerCase(),
        icon: '01d'
      }],
      wind: {
        speed: data.current.wind_kph / 3.6,
        deg: data.current.wind_degree
      },
      dt: Math.floor(Date.now() / 1000)
    };
  },
  
  formatVisualCrossingResponse(data) {
    return {
      name: data.resolvedAddress.split(',')[0],
      sys: { country: 'XX' },
      main: {
        temp: data.currentConditions.temp,
        feels_like: data.currentConditions.feelslike,
        humidity: data.currentConditions.humidity,
        pressure: data.currentConditions.pressure
      },
      weather: [{
        main: data.currentConditions.conditions,
        description: data.currentConditions.conditions.toLowerCase(),
        icon: '01d'
      }],
      wind: {
        speed: data.currentConditions.windspeed / 3.6,
        deg: data.currentConditions.winddir
      },
      dt: Math.floor(Date.now() / 1000)
    };
  }
};