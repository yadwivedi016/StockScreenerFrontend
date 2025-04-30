import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BalanceSheet.css"; // Import the separate CSS file

export default function BalanceSheet({ symbol }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activePeriod, setActivePeriod] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(false);

    axios.get(`http://localhost:8000/balance-sheet/${symbol}/`)
      .then((res) => {
        setData(res.data);
        // Set the most recent period as active by default
        setActivePeriod(res.data.date.length - 1);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [symbol]);

  if (loading) return (
    <div className="balance-sheet-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  if (error) return (
    <div className="balance-sheet-error">
      <p>Error loading balance sheet data.</p>
    </div>
  );

  // Destructure the data for easier access
  const { date, "Equity Capital": equityCapital, Reserves, "Total Liabilities": totalLiabilities, 
          CWIP, Investments, "Total Assets": totalAssets } = data;

  // Row names for other attributes with more readable labels and descriptions
  const rowData = [
    { 
      id: "equityCapital", 
      name: "Equity Capital", 
      description: "Funds raised by issuing shares",
      values: equityCapital 
    },
    { 
      id: "reserves", 
      name: "Reserves", 
      description: "Accumulated profits retained for future use",
      values: Reserves 
    },
    { 
      id: "totalLiabilities", 
      name: "Total Liabilities", 
      description: "Total of all short and long-term obligations",
      values: totalLiabilities 
    },
    { 
      id: "cwip", 
      name: "CWIP", 
      description: "Capital Work in Progress - ongoing projects",
      values: CWIP 
    },
    { 
      id: "investments", 
      name: "Investments", 
      description: "Company's investments in various assets",
      values: Investments 
    },
    { 
      id: "totalAssets", 
      name: "Total Assets", 
      description: "Total of all assets owned by the company",
      values: totalAssets 
    }
  ];

  // Function to format large numbers for better readability
  const formatValue = (value) => {
    const numValue = parseFloat(value.replace(/,/g, ''));
    if (numValue >= 10000) {
      return `₹${(numValue / 10000).toFixed(2)} Cr`;
    }
    return `₹${value}`;
  };

  // Calculate growth between periods
  const calculateGrowth = (current, previous) => {
    if (!previous) return null;
    const currentVal = parseFloat(current.replace(/,/g, ''));
    const previousVal = parseFloat(previous.replace(/,/g, ''));
    if (previousVal === 0) return null;
    return ((currentVal - previousVal) / previousVal) * 100;
  };

  // Handle period selection
  const handlePeriodChange = (index) => {
    setActivePeriod(index);
  };

  return (
    <div className="balance-sheet-container">
      <div className="balance-sheet-header">
        <h2 className="balance-sheet-title">Balance Sheet</h2>
        
        {/* Period selector */}
        <div className="period-selector">
          {date.map((period, index) => (
            <button
              key={index}
              onClick={() => handlePeriodChange(index)}
              className={`period-button ${activePeriod === index ? "active" : ""}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison view */}
      {activePeriod !== null && (
        <div className="comparison-view">
          <h3 className="comparison-title">
            {date[activePeriod]} {activePeriod > 0 && `vs ${date[activePeriod - 1]}`}
          </h3>
          
          <div className="comparison-grid">
            {rowData.map((row) => {
              const currentValue = row.values[activePeriod];
              const previousValue = activePeriod > 0 ? row.values[activePeriod - 1] : null;
              const growth = previousValue ? calculateGrowth(currentValue, previousValue) : null;
              
              return (
                <div key={row.id} className="metric-card">
                  <div className="metric-header">
                    <div className="metric-info">
                      <h4 className="metric-name">{row.name}</h4>
                      <p className="metric-description">{row.description}</p>
                    </div>
                    {growth !== null && (
                      <div className={`growth-indicator ${
                        growth > 0 ? 'positive' : 
                        growth < 0 ? 'negative' : 'neutral'
                      }`}>
                        {growth > 0 ? '▲' : growth < 0 ? '▼' : '•'} {Math.abs(growth).toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <div className="metric-values">
                    <span className="current-value">
                      {formatValue(currentValue)}
                    </span>
                    {previousValue && (
                      <span className="previous-value">
                        vs {formatValue(previousValue)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/*  balance sheet table */}
      <div className="table-container">
        <table className="balance-sheet-table">
          <thead>
            <tr>
              <th className="sticky-column">Item</th>
              {date.map((dateItem, index) => (
                <th key={index}>{dateItem}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowData.map((row) => (
              <tr key={row.id}>
                <td className="sticky-column">
                  <span className="row-name">{row.name}</span>
                  <p className="row-description">{row.description}</p>
                </td>
                {row.values.map((value, colIndex) => {
                  const previousValue = colIndex > 0 ? row.values[colIndex - 1] : null;
                  const growth = previousValue ? calculateGrowth(value, previousValue) : null;
                  
                  return (
                    <td key={colIndex}>
                      <div className="cell-value">{formatValue(value)}</div>
                      {growth !== null && (
                        <div className={`cell-growth ${
                          growth > 0 ? 'positive' : 
                          growth < 0 ? 'negative' : 'neutral'
                        }`}>
                          {growth > 0 ? '▲' : growth < 0 ? '▼' : '•'} {Math.abs(growth).toFixed(2)}%
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}