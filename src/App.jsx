import React, { createContext, useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./MyComponent/SearchPage";
import StockDetailWrapper from "./MyComponent/StockDetail";
import Navbar from "./MyComponent/Navbar";
import Footer from "./MyComponent/Footer";
import StockGraph from "./MyComponent/StockGraph";  // Import StockGraph
import "./App.css";

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
              <Route path="/" element={<SearchPage />} />
              <Route path="/stock/:symbol" element={<StockDetailWrapper />} />
              <Route path="/stock/:symbol/graph" element={<StockGraph />} /> {/* Add route for StockGraph */}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
