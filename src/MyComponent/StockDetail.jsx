import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StockDetail.css";
import StockChart from "./Graph";
import SearchComponent from "./NIFTY50SearchPage";
import FinancialDataTable from "./BalanceSheetUpdated"; // Assuming this is the correct path for the balance sheet component

const StockDetail = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [stock, setStock] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchTime, setFetchTime] = useState(null);
    const [activeTab, setActiveTab] = useState("details"); // Track active tab

    useEffect(() => {
        let intervalId;

        const fetchStockData = async () => {
            const startTime = performance.now(); // Start timing
            setLoading(true);
            setError(null);
            setFetchTime(null);

            try {
                const response = await axios.get(`http://localhost:8000/stockdetail/${symbol}/`);
                setStock(response.data.stock || response.data);
                const endTime = performance.now(); // End timing
                setFetchTime((endTime - startTime).toFixed(2));
            } catch (err) {
                setError("Failed to fetch stock data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchStockData(); // Initial fetch

        intervalId = setInterval(fetchStockData, 60000); // Fetch every 60 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount or symbol change
    }, [symbol]);


    const handleSearchNavigate = (newSymbol) => {
        navigate(`/stock/${newSymbol}`);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
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
            <SearchComponent onSearch={handleSearchNavigate} />

            <div className="stock-container">
                <div className="stock-header">
                    <h1>{stock.company_name} ({stock.exchange})</h1>
                    <p className="price">
                        Current Price: <span className={stock.current_price >= stock.previous_close ? "up" : "down"}>
                            ₹{stock.current_price}
                        </span>
                    </p>
                    <p>Previous Close: ₹{stock.previous_close}</p>
                    <p className="percent-change">📉 {stock.percent_change}% Today</p>

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
                    <div
                        className={`nav-item ${activeTab === "balanceSheet" ? "active" : ""}`}
                        onClick={() => handleTabChange("balanceSheet")}
                    >
                        Balance Sheet
                    </div>
                </div>

                {/* Content sections based on active tab */}
                {activeTab === "details" && (
                    <div className="content-section">
                        {/* Stock Details Grid */}
                        <div className="stock-details">
                            <DetailRow label="52 Week High" value={`₹${stock.fifty_two_week_high}`} />
                            <DetailRow label="52 Week Low" value={`₹${stock.fifty_two_week_low}`} />
                            <DetailRow label="Dividend Yield" value={`${stock.dividend_yield}%`} />
                            <DetailRow label="Book Value" value={`₹${stock.book_value.toFixed(2)}`} />
                            {/* <DetailRow label="Enterprise Value" value={`₹${(stock.enterprise_value / 1e7).toFixed(2)} Cr`} /> */}
                            <DetailRow label="Earnings Yield" value={`${stock.earnings_yield.toFixed(2)}%`} />
                            <DetailRow label="PEG Ratio" value={stock.peg_ratio.toFixed(2)} />
                            {/* <DetailRow label="Dividend Payout Ratio" value={`${stock.dividend_payout_ratio.toFixed(2)}%`} /> */}
                            <DetailRow label="Average Volume" value={stock.avg_volume.toLocaleString()} />
                            <DetailRow label="EPS" value={stock.eps.toFixed(2)} />
                            <DetailRow label="Revenue Growth (YoY)" value={`${stock.year_revenue_growth.toFixed(2)}%`} />
                            <DetailRow label="ROCE" value={`${stock.roce}%`} />
                            {/* <DetailRow label="Revenue" value={`₹${(stock.revenue / 1e7).toFixed(2)} Cr`} /> */}
                            <DetailRow label="Market Cap" value={`₹${stock.market_cap.toFixed(2)} Cr`} />
                            <DetailRow label="P/E Ratio" value={stock.price_to_earning} />
                            <DetailRow label="P/B Ratio" value={stock.price_to_book} />
                            <DetailRow label="RSI" value={stock.rsi} />
                        </div>

                        {/* Performance Section - Now displayed directly after stock details */}
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

                {activeTab === "graph" && (
                    <div className="content-section">
                        {/* Stock Chart */}
                        <StockChart symbol={symbol} />
                    </div>
                )}
                {activeTab === "balanceSheet" && (
                <div className="content-section">
                    <FinancialDataTable symbol={symbol} />
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

export default StockDetail;