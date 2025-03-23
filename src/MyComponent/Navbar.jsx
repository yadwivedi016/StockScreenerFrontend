import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../App";
import "../styles/Navbar.css";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Stock Screener</Link>
      <button 
        className="theme-toggle" 
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle Theme"
      >
        {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
      </button>
    </nav>
  );
};

export default Navbar;
