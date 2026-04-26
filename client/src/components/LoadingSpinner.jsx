import React from 'react';
import '../styles/Components.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Analyzing for bias... This may take a moment.</p>
    </div>
  );
}
