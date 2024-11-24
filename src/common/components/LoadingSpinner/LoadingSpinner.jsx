import React from 'react';
import './LoadingSpinner.style.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading...</p>
        </div>
    );
};

export default LoadingSpinner;
