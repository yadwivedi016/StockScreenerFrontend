import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from "recharts";
import "../styles/Graph.css";

const BSEStockChart = ({ symbol }) => {
  const [stockData, setStockData] = useState([]);
  const [timeframe, setTimeframe] = useState("1D");

  // Function to fetch stock data
  const fetchStockData = useCallback(async () => {
    try {
      let url = `http://localhost:8000/bse-graph/${symbol}`;
      let params = {};

      if (timeframe !== "1D") {
        url = `http://localhost:8000/bse-year-month-graph-data/${symbol}/`;
        params = { time_frame: timeframe };
      }

      const response = await axios.get(url, { params });
      let data = response.data.data || [];

      // Filter out invalid values first
      data = data.filter(item => 
        item && 
        item.close_price !== undefined && 
        item.close_price !== null && 
        !isNaN(Number(item.close_price)) && 
        Number(item.close_price) > 0 && 
        Number(item.close_price) < 100000 &&
        item.date
      );

      // Downsample for longer timeframes
      let processedData = [...data];
      
      if (timeframe === "1M") {
        processedData = data.filter((_, index) => index % 2 === 0);
      } else if (timeframe === "6M") {
        processedData = data.filter((_, index) => index % 20 === 0);
      } else if (timeframe === "1Y") {
        processedData = data.filter((_, index) => index % 30 === 0);
      } else if (timeframe === "5Y" || timeframe === "10Y") {
        processedData = [];
        // Properly aggregate data over 5 years or 10 years
        for (let i = 0; i < data.length; i += 50) {
          const chunk = data.slice(i, i + 50);
          if (chunk.length > 0) {
            const validPrices = chunk
              .map(d => Number(d.close_price))
              .filter(price => !isNaN(price) && price > 0);
              
            if (validPrices.length > 0) {
              const avgPrice = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
              processedData.push({
                date: chunk[0].date,
                close_price: avgPrice
              });
            }
          }
        }
      }

      // Convert to the format needed for the chart
      setStockData(processedData.map(item => ({
        time: new Date(item.date).toLocaleDateString("en-US"),
        close_price: Number(item.close_price)  // Ensure it's a number
      })));

    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 60000);
    return () => clearInterval(interval);
  }, [fetchStockData]);

  return (
    <div className="stock-chart-container">
      <h2 className="stock-chart-title">{symbol} {timeframe}</h2>
      <div className="stock-chart-content" style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={stockData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: "var(--text-color)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--text-color)" }} domain={['auto', 'auto']}>
              <Label value="Price (₹)" position="left" angle={-90} style={{ textAnchor: "middle", fill: "var(--text-color)" }} dx={-10} />
            </YAxis>
            <Tooltip 
              formatter={(value) => {
                // Simpler and more robust number check
                return isFinite(value) ? `₹${value.toFixed(2)}` : "N/A";
              }}
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                color: "var(--text-color)",
              }}
              itemStyle={{ color: "var(--text-color)" }}
              labelStyle={{ color: "var(--text-color)" }}
            />
            <Line 
              type="monotone" 
              dataKey="close_price" 
              stroke="var(--highlight-color)" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6 }} 
              name="Stock Price" 
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Timeframe Buttons */}
        <div 
          className="timeframe-buttons"
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--card-secondary-bg)",
            padding: "5px 10px",
            borderRadius: "8px",
            zIndex: 10,
            border: "1px solid var(--border-color)"
          }}
        >
          {["1D", "1M", "6M", "1Y", "3Y", "5Y", "10Y"].map((tf) => (
            <button 
              key={tf} 
              className={`timeframe-button ${tf === timeframe ? "active" : ""}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BSEStockChart;