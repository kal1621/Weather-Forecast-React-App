/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format temperature with unit
 * @param {number} temp - Temperature value
 * @param {string} unit - Temperature unit (C/F)
 * @returns {string} Formatted temperature string
 */
export function formatTemperature(temp, unit = 'C') {
  return `${Math.round(temp)}°${unit}`;
}

/**
 * Get day name from timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Day name
 */
export function getDayName(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Get time from timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time
 */
export function getTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}