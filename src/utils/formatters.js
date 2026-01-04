/**
 * Format wind speed with direction
 * @param {number} speed - Wind speed in m/s
 * @param {number} deg - Wind direction in degrees
 * @returns {string} Formatted wind information
 */
export function formatWind(speed, deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  const direction = directions[index];
  return `${speed.toFixed(1)} m/s ${direction}`;
}

/**
 * Format humidity percentage
 * @param {number} humidity - Humidity percentage
 * @returns {string} Formatted humidity
 */
export function formatHumidity(humidity) {
  return `${humidity}%`;
}

/**
 * Format pressure
 * @param {number} pressure - Pressure in hPa
 * @returns {string} Formatted pressure
 */
export function formatPressure(pressure) {
  return `${pressure} hPa`;
}

/**
 * Format visibility
 * @param {number} visibility - Visibility in meters
 * @returns {string} Formatted visibility
 */
export function formatVisibility(visibility) {
  if (visibility >= 1000) {
    return `${(visibility / 1000).toFixed(1)} km`;
  }
  return `${visibility} m`;
}