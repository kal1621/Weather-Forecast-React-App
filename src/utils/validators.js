/**
 * Validate city name
 * @param {string} city - City name to validate
 * @returns {Object} Validation result
 */
export function validateCity(city) {
  if (!city || city.trim().length === 0) {
    return { isValid: false, error: 'City name cannot be empty' };
  }
  
  if (city.length > 100) {
    return { isValid: false, error: 'City name is too long' };
  }
  
  const regex = /^[a-zA-Z\s,'-]+$/;
  if (!regex.test(city)) {
    return { isValid: false, error: 'City name contains invalid characters' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validate API response
 * @param {Object} data - API response data
 * @returns {boolean} Whether data is valid
 */
export function validateWeatherData(data) {
  if (!data) return false;
  if (!data.main || !data.weather || !data.weather[0]) return false;
  if (typeof data.main.temp !== 'number') return false;
  return true;
}