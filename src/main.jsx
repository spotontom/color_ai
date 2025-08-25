import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ImageUpload from "./components/ImageUpload";
import About from "./components/About";
import Contact from "./components/Contact";
import { showRegistrationOverlay } from "./registration";
import BackgroundImage from './components/BackgroundImage';
import logo from './components/logo1.png';


const App = () => {
  React.useEffect(() => {
    showRegistrationOverlay();
  }, []);
  
  return (
    <div className="relative"> {/* Ensures content sits above background */}
      <BackgroundImage /> {/* ✅ Background Image is persistent across pages */}
    <Router>
      <img
      src={logo}
      alt="ColorAI Logo"
      className="fixed top-4 left-4 w-80 h-auto opacity-90 hover:opacity-100 transition-opacity duration-300 z-50"
      />
      
      <Navbar /> {/* Navbar stays visible on all pages */}
     
      <div className="p-8">
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/upload" element={<ImageUpload />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
};
// Render the App inside the root container
const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}