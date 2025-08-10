// FinancialDataTable.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';  
import '../styles/FinancialDataTable.css'; // Import your CSS styles


export default function FinancialDataTable() {
  const { symbol } = useParams();  // Extract the symbol from the URL
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/balance-sheet-data/${symbol}/`);
        
        // Remove duplicates by year
        const uniqueYears = {};
        const processedData = response.data.filter(item => {
          if (!uniqueYears[item.year]) {
            uniqueYears[item.year] = true;
            return true;
          }
          return false;
        });
        
        setData(processedData);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch financial data: ${err.response ? err.response.status : err.message}`);
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [symbol]);

  // Format number with commas
  const formatNumber = (num) => {
    if (typeof num === 'string') {
      return num;
    }
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  if (loading) {
    return <div className="loading-container">Loading financial data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="financial-data-container">
      <div className="header-section">
        <h1 className="main-title">{symbol} Financial Data</h1>
        <p className="subtitle">Financial statements from 2020-2024</p>
      </div>
      
      {/* Liabilities table */}
      <div className="table-wrapper">
        <table className="financial-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Share Capital</th>
              <th>Reserve & Surplus</th>
              <th>Minority Interest</th>
              <th>Non-Current Liabilities</th>
              <th>Current Liabilities</th>
              <th>Total Liabilities</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="year-cell">{item.year}</td>
                <td>{formatNumber(item.share_capital)}</td>
                <td>{formatNumber(item.reserve_and_surplus)}</td>
                <td>{formatNumber(item.minority_interest)}</td>
                <td>{formatNumber(item.non_current_liabilities)}</td>
                <td>{formatNumber(item.current_liabilities)}</td>
                <td>{formatNumber(item.total_liabilities)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Assets table */}
      <div className="section-container">
        <h2 className="section-title">Asset Details</h2>
        <div className="table-wrapper">
          <table className="financial-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Fixed Assets</th>
                <th>Capital Work in Progress</th>
                <th>Investments</th>
                <th>Other Assets</th>
                <th>Total Assets</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="year-cell">{item.year}</td>
                  <td>{formatNumber(item.fixed_assets)}</td>
                  <td>{formatNumber(item.capital_work_in_progress)}</td>
                  <td>{formatNumber(item.investments)}</td>
                  <td>{formatNumber(item.other_assets)}</td>
                  <td>{formatNumber(item.total_assets)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary cards */}
      {data.length > 1 && (
        <div className="section-container">
          <h2 className="section-title">Growth Summary</h2>
          <div className="summary-container">
            <div className="summary-card">
              <p className="card-label">Latest Year Total Assets</p>
              <p className="card-value">{formatNumber(data[data.length - 1]?.total_assets)}</p>
            </div>
            <div className="summary-card">
              <p className="card-label">Latest Year Total Liabilities</p>
              <p className="card-value">{formatNumber(data[data.length - 1]?.total_liabilities)}</p>
            </div>
            <div className="summary-card">
              <p className="card-label">Latest Year Investments</p>
              <p className="card-value">{formatNumber(data[data.length - 1]?.investments)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
