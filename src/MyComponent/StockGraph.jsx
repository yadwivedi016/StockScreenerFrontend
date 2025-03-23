import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useParams } from "react-router-dom";
import "../styles/StockGraph.css"; // Custom CSS file for additional styling

const StockGraph = () => {
  const { symbol } = useParams();
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState("1M");

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-graph-data/${symbol}/`, {
        params: { time_frame: timeFrame },
      });

      let data = response.data.data;

      // Downsample data based on the selected time frame
      if (timeFrame === "1M") {
        data = data.filter((_, index) => index % 5 === 0);
      } else if (timeFrame === "6M") {
        data = data.filter((_, index) => index % 20 === 0);
      } else if (timeFrame === "1Y") {
        data = data.filter((_, index) => index % 30 === 0);
      }

      setGraphData(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data.");
      setLoading(false);
      console.error("Error fetching stock data:", err);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [symbol, timeFrame]);

  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  // Calculate the min and max values for Y-axis dynamically based on data
  const getYAxisDomain = (data) => {
    const prices = data.map(item => item.close_price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return [minPrice - (maxPrice * 0.1), maxPrice + (maxPrice * 0.1)]; // Adjust range to allow space around the data
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="stock-graph-container">
      <h2 className="stock-title">{symbol} Stock Price Chart</h2>

      <div className="time-frame-selector">
        <label>Time Frame: </label>
        <select value={timeFrame} onChange={handleTimeFrameChange}>
          <option value="1M">1 Month</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
          <option value="3Y">3 Years</option>
          <option value="5Y">5 Years</option>
          <option value="10Y">10 Years</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="5 5" stroke="#ddd" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#888" }} />
          <YAxis tick={{ fontSize: 12, fill: "#888" }} domain={getYAxisDomain(graphData)} scale="linear" />
          <Tooltip contentStyle={{ backgroundColor: "#f4f4f4", borderColor: "#888" }} />
          <Legend wrapperStyle={{ fontSize: "14px", padding: "5px", marginTop: "20px" }} />
          <Line
            type="monotone"
            dataKey="close_price"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }} // Show the dot only when hovering
            dot={false} // Remove the dot from the line
          />
          <Line
            type="monotone"
            dataKey="open_price"
            stroke="#82ca9d"
            strokeWidth={2}
            activeDot={{ r: 8 }} // Show the dot only when hovering
            dot={false} // Remove the dot from the line
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockGraph;
