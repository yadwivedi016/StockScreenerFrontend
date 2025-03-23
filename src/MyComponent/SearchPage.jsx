import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "../styles/SearchPage.css"; // Import CSS

const niftyStocks = [
  "Reliance Industries", "Tata Consultancy Services", "HDFC Bank", "Bharti Airtel",
  "ICICI Bank", "Infosys", "State Bank of India", "Hindustan Unilever", "Bajaj Finance",
  "ITC", "LIC of India", "HCL Technologies", "Larsen & Toubro", "Sun Pharmaceutical",
  "Maruti Suzuki", "Kotak Bank", "Mahindra & Mahindra", "Wipro", "UltraTech Cement",
  "Axis Bank", "NTPC", "Oil & Natural Gas Corporation", "Bajaj Finserv", "Titan",
  "Adani Enterprises", "Tata Motors", "Power Grid Corporation of India", "Avenue Supermarts DMart",
  "JSW Steel", "Bajaj Auto", "Adani Ports & SEZ", "Zomato", "Hindustan Aeronautics",
  "Coal India", "Asian Paints", "Nestle", "Adani Power", "Bharat Electronics",
  "Trent", "Siemens", "Hindustan Zinc", "DLF", "Interglobe Aviation", "Tata Steel",
  "Indian Oil Corporation", "Vedanta", "Tech Mahindra", "IRFC", "Grasim Industries",
  "LTI Mindtree"
];

const SearchComponent = () => {
  const [symbol, setSymbol] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  

  const handleSearch = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      navigate(`/stock/${symbol.trim()}`);
      setSymbol("");
      setFilteredStocks([]);
      setSelectedIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSymbol(value);

    if (value.trim() === "") {
      setFilteredStocks([]);
    } else {
      const filtered = niftyStocks.filter((stock) =>
        stock.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(filtered);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => Math.min(prev + 1, filteredStocks.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      setSymbol(filteredStocks[selectedIndex]);
      setFilteredStocks([]);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (stock) => {
    setSymbol(stock);
    setFilteredStocks([]);
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Looking for a stock?</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={symbol}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter stock symbol (e.g., Reliance, TCS)"
            className="search-input"
            aria-label="Search stock symbol"
          />
          <button type="submit" className="search-button" disabled={!symbol.trim()} aria-label="Search">
            Search
          </button>
        </div>
        {filteredStocks.length > 0 && (
          <ul className="suggestions-list">
            {filteredStocks.map((stock, index) => (
              <li
                key={stock}
                className={index === selectedIndex ? "suggestion-item active" : "suggestion-item"}
                onClick={() => handleSuggestionClick(stock)}
              >
                {stock}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default SearchComponent;
