import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Generating your image... This may take a moment.</p>
    </div>
  );
};

export default LoadingSpinner;