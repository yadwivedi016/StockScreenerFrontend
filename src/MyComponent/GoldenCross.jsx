import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GoldenCross.css'; // Ensure you have this CSS file for styling

const GoldenCross = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/nse-golden-cross-stocks/')
      .then((response) => response.json())
      .then((data) => {
        setStocks(data.stocks || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching stocks:', error);
        setLoading(false);
      });
  }, []);

  const handleClick = (symbol) => {
    // Directly use the stock symbol to navigate
    navigate(`/bsestock/${symbol}`);
  };

  return (
    <div className="golden-cross-container">
      <h2 className="golden-cross-title">NSE Golden Cross Stocks</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : stocks.length > 0 ? (
        <ul className="stocks-list">
          {stocks.map((symbol, index) => (
            <li
              key={index}
              className="stock-item"
              onClick={() => handleClick(symbol)}
            >
              {symbol}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-stocks-text">No stocks found.</p>
      )}
    </div>
  );
};

export default GoldenCross;