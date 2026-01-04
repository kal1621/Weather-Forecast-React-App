import React from 'react';
import './ErrorMessage.css';

function ErrorMessage({ message, onRetry, showRetry = true }) {
  return (
    <div className="error-message" role="alert">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>Something went wrong</h3>
        <p>{message}</p>
        {showRetry && onRetry && (
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;