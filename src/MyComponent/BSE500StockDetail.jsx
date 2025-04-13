import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StockDetail.css";
import BSESearchPage from "./BSE500SearchPage";
import BSEStockChart from "./BSEGraph"; // Assuming this is the correct path for the BSE chart component

const BSE500StockDetail = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [stock, setStock] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchTime, setFetchTime] = useState(null);
    const [activeTab, setActiveTab] = useState("details"); // Keeping tab structure for future extensibility

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        setFetchTime(null);

        const fetchStockData = async () => {
            const startTime = performance.now(); // Start timing

            try {
                const response = await axios.get(`http://localhost:8000/fetch-bse-500-stock-data/${symbol}/`);
                setStock(response.data.stock || response.data);
                const endTime = performance.now(); // End timing
                setFetchTime((endTime - startTime).toFixed(2)); // Store time in milliseconds
            } catch (err) {
                setError("Failed to fetch stock data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [symbol]);

    const handleSearchNavigate = (newSymbol) => {
        navigate(`/stock/${newSymbol}`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error || !stock) {
        return (
            <div className="error">
                ❌ {error || "Stock data not available."}
                <Link to="/" className="back-button">Back to Search</Link>
            </div>
        );
    }

    return (
        <>
            {/* Pass handleSearchNavigate to SearchComponent */}
            <BSESearchPage onSearch={handleSearchNavigate} />

            <div className="stock-container">
                <div className="stock-header">
                    <h1>{stock.company_name || stock.Company_Name} ({stock.exchange || "BSE"})</h1>
                    <p className="price">
                        Current Price: <span className={parseFloat(stock.LTP) >= 0 ? "up" : "down"}>
                            {stock.LTP}
                        </span>
                    </p>
                    <p className="percent-change">
                    {parseFloat(stock["Change_%"]) >= 0 ? "📈" : "📉"} {stock["Change_%"]} Today
                    </p>

                    {/* Show Fetch Time */}
                    {fetchTime && <p className="fetch-time">⏳ Data fetched in {fetchTime} ms</p>}
                </div>

                {/* Secondary Navigation Bar - only Details and Graph */}
                <div className="secondary-navbar">
                    <div 
                        className={`nav-item ${activeTab === "details" ? "active" : ""}`} 
                        onClick={() => handleTabChange("details")}
                    >
                        Stock Details
                    </div>
                    <div 
                        className={`nav-item ${activeTab === "graph" ? "active" : ""}`} 
                        onClick={() => handleTabChange("graph")}
                    >
                        Graph
                    </div>
                </div>

                {/* Stock Details Grid */}
                {activeTab === "details" && (
                    <div className="content-section">
                        <div className="stock-details">
                            <DetailRow label="52 Week High" value={stock.fifty_two_week_high} />
                            <DetailRow label="52 Week Low" value={stock.fifty_two_week_low} />
                            <DetailRow label="Dividend Yield" value={`${stock.dividend_yield}%`} />
                            <DetailRow label="Book Value" value={stock.book_value} />
                            <DetailRow label="Earnings Yield" value={`${stock.earnings_yield}%`} />
                            <DetailRow label="Dividend Payout Ratio" value={stock.dividend_payout_ratio} />
                            <DetailRow label="Average Volume" value={stock.avg_volume} />
                            <DetailRow label="EPS" value={stock.eps} />
                            <DetailRow label="Market Cap" value={stock.Market_Cap_Cr} />
                            <DetailRow label="P/E Ratio" value={stock.PE_Ratio} />
                            <DetailRow label="P/B Ratio" value={stock.PB_Ratio} />
                            <DetailRow label="RSI" value={stock.RSI} />
                            <DetailRow label="ROCE" value={stock.ROCE} />
                        </div>

                        {/* Performance Section */}
                        <h2 className="section-title">Performance</h2>
                        <div className="performance-grid">
                            <PerformanceCard label="1 Month" value={stock.price_perchng_1mon} />
                            <PerformanceCard label="3 Months" value={stock.price_perchng_3mon} />
                            <PerformanceCard label="1 Year" value={stock.price_perchng_1year} />
                            <PerformanceCard label="3 Years" value={stock.price_perchng_3year} />
                            <PerformanceCard label="5 Years" value={stock.price_perchng_5year} />
                        </div>
                    </div>
                )}

                {/* Stock Chart */}
                {activeTab === "graph" && (
                    <div className="content-section">
                        <BSEStockChart symbol={symbol} />
                    </div>
                )}
            </div>
        </>
    );
};

// Reusable Components
const DetailRow = ({ label, value }) => (
    <div className="detail-row">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value}</span>
    </div>
);

const PerformanceCard = ({ label, value }) => {
    const isPositive = parseFloat(value) > 0;
    return (
        <div className={`performance-card ${isPositive ? "positive" : "negative"}`}>
            <span className="performance-label">{label}</span>
            <span className="performance-value">{value}%</span>
        </div>
    );
};

export default BSE500StockDetail;
