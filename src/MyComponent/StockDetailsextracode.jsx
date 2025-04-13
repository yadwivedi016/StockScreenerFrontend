// code 0 ***********************************************************************
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StockDetail.css";
import StockChart from "./Graph";
import SearchComponent from "./SearchPage";

const StockDetail = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [stock, setStock] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchTime, setFetchTime] = useState(null);  // Store fetch time

    useEffect(() => {
        setLoading(true);
        setError(null);
        setFetchTime(null);

        const fetchStockData = async () => {
            const startTime = performance.now(); // Start timing

            try {
                const response = await axios.get(`http://localhost:8000/stockdetail/${symbol}/`);
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

                {/* Stock Details Grid */}
                <div className="stock-details">
                    <DetailRow label="52 Week High" value={`₹${stock.fifty_two_week_high}`} />
                    <DetailRow label="52 Week Low" value={`₹${stock.fifty_two_week_low}`} />
                    <DetailRow label="Dividend Yield" value={`${stock.dividend_yield}%`} />
                    <DetailRow label="Book Value" value={`₹${stock.book_value.toFixed(2)}`} />
                    <DetailRow label="Enterprise Value" value={`₹${(stock.enterprise_value / 1e7).toFixed(2)} Cr`} />
                    <DetailRow label="Earnings Yield" value={`${stock.earnings_yield.toFixed(2)}%`} />
                    <DetailRow label="PEG Ratio" value={stock.peg_ratio.toFixed(2)} />
                    <DetailRow label="Dividend Payout Ratio" value={`${stock.dividend_payout_ratio.toFixed(2)}%`} />
                    <DetailRow label="Average Volume" value={stock.avg_volume.toLocaleString()} />
                    <DetailRow label="EPS" value={stock.eps.toFixed(2)} />
                    <DetailRow label="Revenue Growth (YoY)" value={`${stock.year_revenue_growth.toFixed(2)}%`} />
                    <DetailRow label="ROCE" value={`${stock.roce}%`} />
                    <DetailRow label="Revenue" value={`₹${(stock.revenue / 1e7).toFixed(2)} Cr`} />
                    <DetailRow label="Market Cap" value={`₹${(stock.market_cap / 1e7).toFixed(2)} Cr`} />
                    <DetailRow label="P/E Ratio" value={stock.price_to_earning} />
                    <DetailRow label="P/B Ratio" value={stock.price_to_book} />
                    <DetailRow label="RSI" value={stock.rsi} />
                </div>

                {/* Performance Table */}
                <h2 className="section-title">Performance</h2>
                <div className="performance-grid">
                    <PerformanceCard label="1 Month" value={stock.price_perchng_1mon} />
                    <PerformanceCard label="3 Months" value={stock.price_perchng_3mon} />
                    <PerformanceCard label="1 Year" value={stock.price_perchng_1year} />
                    <PerformanceCard label="3 Years" value={stock.price_perchng_3year} />
                    <PerformanceCard label="5 Years" value={stock.price_perchng_5year} />
                </div>
            </div>

            {/* Stock Chart */}
            <div>
                <StockChart symbol={symbol} />
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






//code 1 ***********************************************************************

// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/StockDetail.css";
// import StockChart from "./Graph";
// import SearchComponent from "./SearchPage";

// const StockDetail = () => {
//     const { symbol } = useParams();
//     const navigate = useNavigate();
//     const [stock, setStock] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [fetchTime, setFetchTime] = useState(null);
//     const [activeTab, setActiveTab] = useState("details"); // Track active tab

//     useEffect(() => {
//         setLoading(true);
//         setError(null);
//         setFetchTime(null);

//         const fetchStockData = async () => {
//             const startTime = performance.now(); // Start timing

//             try {
//                 const response = await axios.get(`http://localhost:8000/stockdetail/${symbol}/`);
//                 setStock(response.data.stock || response.data);
//                 const endTime = performance.now(); // End timing
//                 setFetchTime((endTime - startTime).toFixed(2)); // Store time in milliseconds
//             } catch (err) {
//                 setError("Failed to fetch stock data. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStockData();
//     }, [symbol]);

//     const handleSearchNavigate = (newSymbol) => {
//         navigate(`/stock/${newSymbol}`);
//     };

//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//     };

//     if (loading) {
//         return <div className="loading">Loading...</div>;
//     }

//     if (error || !stock) {
//         return (
//             <div className="error">
//                 ❌ {error || "Stock data not available."}
//                 <Link to="/" className="back-button">Back to Search</Link>
//             </div>
//         );
//     }

//     return (
//         <>
//             {/* Pass handleSearchNavigate to SearchComponent */}
//             <SearchComponent onSearch={handleSearchNavigate} />

//             <div className="stock-container">
//                 <div className="stock-header">
//                     <h1>{stock.company_name} ({stock.exchange})</h1>
//                     <p className="price">
//                         Current Price: <span className={stock.current_price >= stock.previous_close ? "up" : "down"}>
//                             ₹{stock.current_price}
//                         </span>
//                     </p>
//                     <p>Previous Close: ₹{stock.previous_close}</p>
//                     <p className="percent-change">📉 {stock.percent_change}% Today</p>

//                     {/* Show Fetch Time */}
//                     {fetchTime && <p className="fetch-time">⏳ Data fetched in {fetchTime} ms</p>}
//                 </div>

//                 {/* Secondary Navigation Bar - only Details and Graph */}
//                 <div className="secondary-navbar">
//                     <div 
//                         className={`nav-item ${activeTab === "details" ? "active" : ""}`} 
//                         onClick={() => handleTabChange("details")}
//                     >
//                         Stock Details
//                     </div>
//                     <div 
//                         className={`nav-item ${activeTab === "graph" ? "active" : ""}`} 
//                         onClick={() => handleTabChange("graph")}
//                     >
//                         Graph
//                     </div>
//                 </div>

//                 {/* Content sections based on active tab */}
//                 {activeTab === "details" && (
//                     <div className="content-section">
//                         {/* Stock Details Grid */}
//                         <div className="stock-details">
//                             <DetailRow label="52 Week High" value={`₹${stock.fifty_two_week_high}`} />
//                             <DetailRow label="52 Week Low" value={`₹${stock.fifty_two_week_low}`} />
//                             <DetailRow label="Dividend Yield" value={`${stock.dividend_yield}%`} />
//                             <DetailRow label="Book Value" value={`₹${stock.book_value.toFixed(2)}`} />
//                             <DetailRow label="Enterprise Value" value={`₹${(stock.enterprise_value / 1e7).toFixed(2)} Cr`} />
//                             <DetailRow label="Earnings Yield" value={`${stock.earnings_yield.toFixed(2)}%`} />
//                             <DetailRow label="PEG Ratio" value={stock.peg_ratio.toFixed(2)} />
//                             <DetailRow label="Dividend Payout Ratio" value={`${stock.dividend_payout_ratio.toFixed(2)}%`} />
//                             <DetailRow label="Average Volume" value={stock.avg_volume.toLocaleString()} />
//                             <DetailRow label="EPS" value={stock.eps.toFixed(2)} />
//                             <DetailRow label="Revenue Growth (YoY)" value={`${stock.year_revenue_growth.toFixed(2)}%`} />
//                             <DetailRow label="ROCE" value={`${stock.roce}%`} />
//                             <DetailRow label="Revenue" value={`₹${(stock.revenue / 1e7).toFixed(2)} Cr`} />
//                             <DetailRow label="Market Cap" value={`₹${(stock.market_cap / 1e7).toFixed(2)} Cr`} />
//                             <DetailRow label="P/E Ratio" value={stock.price_to_earning} />
//                             <DetailRow label="P/B Ratio" value={stock.price_to_book} />
//                             <DetailRow label="RSI" value={stock.rsi} />
//                         </div>
                        
//                         {/* Performance Section - Now displayed directly after stock details */}
//                         <h2 className="section-title">Performance</h2>
//                         <div className="performance-grid">
//                             <PerformanceCard label="1 Month" value={stock.price_perchng_1mon} />
//                             <PerformanceCard label="3 Months" value={stock.price_perchng_3mon} />
//                             <PerformanceCard label="1 Year" value={stock.price_perchng_1year} />
//                             <PerformanceCard label="3 Years" value={stock.price_perchng_3year} />
//                             <PerformanceCard label="5 Years" value={stock.price_perchng_5year} />
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === "graph" && (
//                     <div className="content-section">
//                         {/* Stock Chart */}
//                         <StockChart symbol={symbol} />
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// // Reusable Components
// const DetailRow = ({ label, value }) => (
//     <div className="detail-row">
//         <span className="detail-label">{label}</span>
//         <span className="detail-value">{value}</span>
//     </div>
// );

// const PerformanceCard = ({ label, value }) => {
//     const isPositive = parseFloat(value) > 0;
//     return (
//         <div className={`performance-card ${isPositive ? "positive" : "negative"}`}>
//             <span className="performance-label">{label}</span>
//             <span className="performance-value">{value}%</span>
//         </div>
//     );
// };

// export default StockDetail;







//code 2 ***********************************************************************
// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/StockDetail.css";
// import StockChart from "./Graph";
// import SearchComponent from "./SearchPage";

// const StockDetail = () => {
//     const { symbol } = useParams();
//     const navigate = useNavigate();
//     const [stock, setStock] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [fetchTime, setFetchTime] = useState(null);
//     const [activeTab, setActiveTab] = useState("details"); // Track active tab

//     useEffect(() => {
//         setLoading(true);
//         setError(null);
//         setFetchTime(null);

//         const fetchStockData = async () => {
//             const startTime = performance.now(); // Start timing

//             try {
//                 const response = await axios.get(`http://localhost:8000/stockdetail/${symbol}/`);
//                 setStock(response.data.stock || response.data);
//                 const endTime = performance.now(); // End timing
//                 setFetchTime((endTime - startTime).toFixed(2)); // Store time in milliseconds
//             } catch (err) {
//                 setError("Failed to fetch stock data. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStockData();
//     }, [symbol]);

//     const handleSearchNavigate = (newSymbol) => {
//         navigate(`/stock/${newSymbol}`);
//     };

//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//     };

//     if (loading) {
//         return <div className="loading">Loading...</div>;
//     }

//     if (error || !stock) {
//         return (
//             <div className="error">
//                 ❌ {error || "Stock data not available."}
//                 <Link to="/" className="back-button">Back to Search</Link>
//             </div>
//         );
//     }

//     return (
//         <>
//             {/* Pass handleSearchNavigate to SearchComponent */}
//             <SearchComponent onSearch={handleSearchNavigate} />

//             <div className="stock-container">
//                 <div className="stock-header">
//                     <h1>{stock.company_name} ({stock.exchange})</h1>
//                     <p className="price">
//                         Current Price: <span className={stock.current_price >= stock.previous_close ? "up" : "down"}>
//                             ₹{stock.current_price}
//                         </span>
//                     </p>
//                     <p>Previous Close: ₹{stock.previous_close}</p>
//                     <p className="percent-change">📉 {stock.percent_change}% Today</p>

//                     {/* Show Fetch Time */}
//                     {fetchTime && <p className="fetch-time">⏳ Data fetched in {fetchTime} ms</p>}
//                 </div>

//                 {/* Secondary Navigation Bar - only Details and Graph */}
//                 <div className="secondary-navbar">
//                     <div 
//                         className={`nav-item ${activeTab === "details" ? "active" : ""}`} 
//                         onClick={() => handleTabChange("details")}
//                     >
//                         Stock Details
//                     </div>
//                     <div 
//                         className={`nav-item ${activeTab === "graph" ? "active" : ""}`} 
//                         onClick={() => handleTabChange("graph")}
//                     >
//                         Graph
//                     </div>
//                 </div>

//                 {/* Content sections based on active tab */}
//                 {activeTab === "details" && (
//                     <div className="content-section">
//                         {/* Stock Details Grid */}
//                         <div className="stock-details">
//                             <DetailRow label="52 Week High" value={`₹${stock.fifty_two_week_high}`} />
//                             <DetailRow label="52 Week Low" value={`₹${stock.fifty_two_week_low}`} />
//                             <DetailRow label="Dividend Yield" value={`${stock.dividend_yield}%`} />
//                             <DetailRow label="Book Value" value={`₹${stock.book_value.toFixed(2)}`} />
//                             <DetailRow label="Enterprise Value" value={`₹${(stock.enterprise_value / 1e7).toFixed(2)} Cr`} />
//                             <DetailRow label="Earnings Yield" value={`${stock.earnings_yield.toFixed(2)}%`} />
//                             <DetailRow label="PEG Ratio" value={stock.peg_ratio.toFixed(2)} />
//                             <DetailRow label="Dividend Payout Ratio" value={`${stock.dividend_payout_ratio.toFixed(2)}%`} />
//                             <DetailRow label="Average Volume" value={stock.avg_volume.toLocaleString()} />
//                             <DetailRow label="EPS" value={stock.eps.toFixed(2)} />
//                             <DetailRow label="Revenue Growth (YoY)" value={`${stock.year_revenue_growth.toFixed(2)}%`} />
//                             <DetailRow label="ROCE" value={`${stock.roce}%`} />
//                             <DetailRow label="Revenue" value={`₹${(stock.revenue / 1e7).toFixed(2)} Cr`} />
//                             <DetailRow label="Market Cap" value={`₹${(stock.market_cap / 1e7).toFixed(2)} Cr`} />
//                             <DetailRow label="P/E Ratio" value={stock.price_to_earning} />
//                             <DetailRow label="P/B Ratio" value={stock.price_to_book} />
//                             <DetailRow label="RSI" value={stock.rsi} />
//                         </div>
                        
//                         {/* Performance Section - Now displayed directly after stock details */}
//                         <h2 className="section-title">Performance</h2>
//                         <div className="performance-grid">
//                             <PerformanceCard label="1 Month" value={stock.price_perchng_1mon} />
//                             <PerformanceCard label="3 Months" value={stock.price_perchng_3mon} />
//                             <PerformanceCard label="1 Year" value={stock.price_perchng_1year} />
//                             <PerformanceCard label="3 Years" value={stock.price_perchng_3year} />
//                             <PerformanceCard label="5 Years" value={stock.price_perchng_5year} />
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === "graph" && (
//                     <div className="content-section">
//                         {/* Stock Chart */}
//                         <StockChart symbol={symbol} />
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// // Reusable Components
// const DetailRow = ({ label, value }) => (
//     <div className="detail-row">
//         <span className="detail-label">{label}</span>
//         <span className="detail-value">{value}</span>
//     </div>
// );

// const PerformanceCard = ({ label, value }) => {
//     const isPositive = parseFloat(value) > 0;
//     return (
//         <div className={`performance-card ${isPositive ? "positive" : "negative"}`}>
//             <span className="performance-label">{label}</span>
//             <span className="performance-value">{value}%</span>
//         </div>
//     );
// };

// export default StockDetail;





// code 3 ***********************************************************************
// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/StockDetail.css";
// import StockChart from "./Graph";
// import SearchComponent from "./SearchPage";

// const StockDetail = () => {
//     const { symbol } = useParams();
//     const navigate = useNavigate();
//     const [stock, setStock] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [fetchTime, setFetchTime] = useState(null);
//     const [activeTab, setActiveTab] = useState("details");
//     const [theme, setTheme] = useState(() => {
//         return localStorage.getItem('theme') || 'light';
//     });

//     useEffect(() => {
//         document.documentElement.setAttribute('data-theme', theme);
//         localStorage.setItem('theme', theme);
//     }, [theme]);

//     useEffect(() => {
//         setLoading(true);
//         setError(null);
//         setFetchTime(null);

//         const fetchStockData = async () => {
//             const startTime = performance.now();

//             try {
//                 const response = await axios.get(`http://localhost:8000/stockdetail/${symbol}/`);
//                 setStock(response.data.stock || response.data);
//                 const endTime = performance.now();
//                 setFetchTime((endTime - startTime).toFixed(2));
//             } catch (err) {
//                 setError("Failed to fetch stock data. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStockData();
//     }, [symbol]);

//     const handleSearchNavigate = (newSymbol) => {
//         navigate(`/stock/${newSymbol}`);
//     };

//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//     };

//     const toggleTheme = () => {
//         setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
//     };

//     if (loading) {
//         return <div className="loading">Loading stock data...</div>;
//     }

//     if (error || !stock) {
//         return (
//             <div className="error">
//                 <div className="error-icon">❌</div>
//                 <div className="error-message">{error || "Stock data not available."}</div>
//                 <Link to="/" className="back-button">
//                     <span className="back-icon">←</span> Back to Search
//                 </Link>
//             </div>
//         );
//     }

//     const getPriceChangeClass = (value) => {
//         const numValue = parseFloat(value);
//         return numValue > 0 ? "positive" : numValue < 0 ? "negative" : "neutral";
//     };

//     return (
//         <div className="page-container">
//             <div className="toolbar">
//                 <SearchComponent onSearch={handleSearchNavigate} />
//                 <button className="theme-toggle" onClick={toggleTheme}>
//                     {theme === 'light' ? '🌙' : '☀️'}
//                 </button>
//             </div>

//             <div className="stock-container">
//                 <div className="stock-header">
//                     <div className="stock-badge">{stock.exchange}</div>
//                     <h1>{stock.company_name} <span className="stock-symbol">{symbol}</span></h1>
                    
//                     <div className="price-container">
//                         <p className="price">
//                             <span className={stock.current_price >= stock.previous_close ? "up" : "down"}>
//                                 ₹{stock.current_price.toLocaleString('en-IN')}
//                             </span>
//                             <span className={`price-change ${getPriceChangeClass(stock.percent_change)}`}>
//                                 {stock.percent_change > 0 ? '+' : ''}{stock.percent_change}%
//                             </span>
//                         </p>
//                         <p className="previous-close">Previous: ₹{stock.previous_close.toLocaleString('en-IN')}</p>
//                     </div>
                    
//                     {fetchTime && <p className="fetch-time">⏳ {fetchTime} ms</p>}
//                 </div>

//                 <div className="secondary-navbar">
//                     <div 
//                         className={`nav-item ${activeTab === "details" ? "active" : ""}`} 
//                         onClick={() => handleTabChange("details")}
//                     >
//                         <span className="nav-icon">📊</span> Stock Details
//                     </div>
//                     <div 
//                         className={`nav-item ${activeTab === "graph" ? "active" : ""}`} 
//                         onClick={() => handleTabChange("graph")}
//                     >
//                         <span className="nav-icon">📈</span> Graph
//                     </div>
//                 </div>

//                 {activeTab === "details" && (
//                     <div className="content-section">
//                         <div className="section-header">
//                             <h2 className="section-title">Key Metrics</h2>
//                         </div>
                        
//                         <div className="stock-details">
//                             <DetailCard label="Market Cap" value={`₹${(stock.market_cap / 1e7).toFixed(2)} Cr`} icon="💰" />
//                             <DetailCard label="P/E Ratio" value={stock.price_to_earning} icon="📊" />
//                             <DetailCard label="P/B Ratio" value={stock.price_to_book} icon="📚" />
//                             <DetailCard label="EPS" value={stock.eps.toFixed(2)} icon="💸" />
//                             <DetailCard label="Book Value" value={`₹${stock.book_value.toFixed(2)}`} icon="📝" />
//                             <DetailCard label="ROCE" value={`${stock.roce}%`} icon="🔄" />
//                             <DetailCard label="Revenue" value={`₹${(stock.revenue / 1e7).toFixed(2)} Cr`} icon="💵" />
//                             <DetailCard label="Revenue Growth" value={`${stock.year_revenue_growth.toFixed(2)}%`} icon="📈" />
//                             <DetailCard label="52W High" value={`₹${stock.fifty_two_week_high}`} icon="🔝" />
//                             <DetailCard label="52W Low" value={`₹${stock.fifty_two_week_low}`} icon="⬇️" />
//                             <DetailCard label="RSI" value={stock.rsi} icon="🔍" />
//                             <DetailCard label="Avg Volume" value={stock.avg_volume.toLocaleString()} icon="📶" />
//                             <DetailCard label="Dividend Yield" value={`${stock.dividend_yield}%`} icon="💎" />
//                             <DetailCard label="PEG Ratio" value={stock.peg_ratio.toFixed(2)} icon="📏" />
//                             <DetailCard label="Enterprise Value" value={`₹${(stock.enterprise_value / 1e7).toFixed(2)} Cr`} icon="🏢" />
//                             <DetailCard label="Earnings Yield" value={`${stock.earnings_yield.toFixed(2)}%`} icon="📈" />
//                         </div>
                        
//                         <div className="section-header">
//                             <h2 className="section-title">Performance</h2>
//                         </div>
//                         <div className="performance-grid">
//                             <PerformanceCard label="1 Month" value={stock.price_perchng_1mon} />
//                             <PerformanceCard label="3 Months" value={stock.price_perchng_3mon} />
//                             <PerformanceCard label="1 Year" value={stock.price_perchng_1year} />
//                             <PerformanceCard label="3 Years" value={stock.price_perchng_3year} />
//                             <PerformanceCard label="5 Years" value={stock.price_perchng_5year} />
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === "graph" && (
//                     <div className="content-section">
//                         <div className="chart-container">
//                             <StockChart symbol={symbol} />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // Enhanced Reusable Components
// const DetailCard = ({ label, value, icon }) => (
//     <div className="detail-card">
//         <div className="detail-icon">{icon}</div>
//         <div className="detail-content">
//             <span className="detail-label">{label}</span>
//             <span className="detail-value">{value}</span>
//         </div>
//     </div>
// );

// const PerformanceCard = ({ label, value }) => {
//     const numValue = parseFloat(value);
//     const isPositive = numValue > 0;
//     const isNeutral = numValue === 0;
    
//     return (
//         <div className={`performance-card ${isPositive ? "positive" : isNeutral ? "neutral" : "negative"}`}>
//             <span className="performance-label">{label}</span>
//             <span className="performance-value">
//                 {isPositive ? '+' : ''}{value}%
//             </span>
//         </div>
//     );
// };

// export default StockDetail;