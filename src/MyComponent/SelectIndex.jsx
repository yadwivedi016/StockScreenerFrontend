import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/SelectIndex.css"

const SelectIndex = () => {
  const navigate = useNavigate(); 
  const handleNavigation = (index) => {
    if (index === 'Nifty 50') {
      navigate('/NIFTY50SearchComponent');
    } else if (index === 'BSE 500') {
      navigate('/BSE500SearchComponent'); 
    }
  };
  
  return (
    <div className="index-selector-container">
      <div className="index-selector-card">
        <div className="card-header">
          <h1 className="title">Indian Stock Market</h1>
          <p className="subtitle">Select an index to explore</p>
        </div>
        
        <div className="index-buttons-wrapper">
          <button 
            className="big-index-button bse-button"
            onClick={() => handleNavigation('BSE 500')}
          >
            <div className="button-glow"></div>
            <div className="button-content">
              <div className="button-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <span className="button-title">BSE 500</span>
              <span className="button-description">S&P BSE 500 Index</span>
            </div>
          </button>
          
          <button 
            className="big-index-button nifty-button"
            onClick={() => handleNavigation('Nifty 50')}
          >
            <div className="button-glow"></div>
            <div className="button-content">
              <div className="button-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                </svg>
              </div>
              <span className="button-title">NIFTY 50</span>
              <span className="button-description">National Stock Exchange Index</span>
            </div>
          </button>
        </div>
        
        <div className="info-footer">
          <p>Access comprehensive market data and analytics</p>
        </div>
      </div>
    </div>
  );
};

export default SelectIndex;
