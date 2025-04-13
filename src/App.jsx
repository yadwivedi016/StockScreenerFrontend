import React, { createContext, useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BSESearchPage  from "./MyComponent/BSE500SearchPage";
import NiftySearchPage from "./MyComponent/NIFTY50SearchPage"; 
import StockDetailWrapper from "./MyComponent/StockDetail";
import Navbar from "./MyComponent/Navbar";
import Footer from "./MyComponent/Footer";
import StockGraph from "./MyComponent/StockGraph";
import SelectIndex from "./MyComponent/SelectIndex";
import "./App.css";
import BSE500StockDetail from "./MyComponent/BSE500StockDetail";
import StockChart from "./MyComponent/BSEGraph"; // Assuming this is the correct path for the BSE chart component
import BSEStockGraph from "./MyComponent/BSE1dGraph";

// Create a Theme Context
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<SelectIndex />} />
              <Route path="/BSE500SearchComponent" element={<BSESearchPage />} />
              <Route path="/NIFTY50SearchComponent" element={<NiftySearchPage />} />
              <Route path="/nifty50stock/:symbol" element={<StockDetailWrapper />} />
              <Route path="/stock/:symbol/graph" element={<StockGraph />} />
              <Route path="/bsestock/:symbol" element={<BSE500StockDetail />} />
              <Route path="/bsegraph/:symbol" element={<BSEStockGraph />}/>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
