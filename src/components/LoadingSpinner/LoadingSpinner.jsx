import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="loading-spinner" aria-label="Loading">
      <div className={`spinner ${sizeClass}`}>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;