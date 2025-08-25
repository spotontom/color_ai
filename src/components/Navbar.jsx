import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Upload, Info, Phone } from "lucide-react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [tokens, setTokens] = useState(0);
  
  useEffect(() => {
    console.log("✅ Navbar useEffect ran!");
    const auth = getAuth(); // Move inside useEffect
    console.log("Current User:", auth.currentUser);
    const db = getFirestore(); // Move inside useEffect
    
    console.log("Navbar mounted, setting up auth listener");
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // Use imported function
      console.log("Auth state changed", user ? `User: ${user.email}` : "No user");
      
      if (user) {
        setUserEmail(user.email);

        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            console.log("User data:", userSnap.data());
            setTokens(userSnap.data().tokens || 0); // Add fallback for missing tokens
          } else {
            console.log("No Firestore document found for user");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserEmail(null);
        setTokens(0);
      }
    });
    
    // Clean up subscription
    return () => {
      console.log("Cleaning up auth listener");
      unsubscribe();
    };
  }, []); // Remove auth and db dependencies

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="fixed top-5 right-5 md:hidden bg-gray-800 p-2 rounded-full text-white z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      
      {/* Right-Side Navigation Bar */}
      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-pink-500 via-teal-500 to-blue-500 animate-gradient text-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <h1 className="text-2xl font-bold">🎨 ColorAI</h1>
          <button onClick={() => setIsMenuOpen(false)} className="md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Navigation Links */}
        <ul className="mt-5 space-y-4 px-6">
          <li className="p-3 rounded hover:bg-white hover:bg-opacity-20 transition">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-5 w-5" /> <span>Home</span>
            </Link>
          </li>
          <li className="p-3 rounded hover:bg-white hover:bg-opacity-20 transition">
            <Link to="/upload" className="flex items-center space-x-2">
              <Upload className="h-5 w-5" /> <span>Upload</span>
            </Link>
          </li>
          <li className="p-3 rounded hover:bg-white hover:bg-opacity-20 transition">
            <Link to="/about" className="flex items-center space-x-2">
              <Info className="h-5 w-5" /> <span>About</span>
            </Link>
          </li>
          <li className="p-3 rounded hover:bg-white hover:bg-opacity-20 transition">
            <Link to="/contact" className="flex items-center space-x-2">
              <Phone className="h-5 w-5" /> <span>Contact</span>
            </Link>
          </li>
        </ul>
        {userEmail ? (
          <div className="absolute -bottom-[-15px] left-1/2 transform -translate-x-1/2 w-[90%] bg-purple-800 text-white rounded-xl shadow-lg py-4 px-6 text-center">
          <p className="text-sm font-semibold">🔑 {userEmail}</p> 
          
          <p className="text-xs mt-1">⚡ {tokens} Tokens</p>
        
          {/* Get More Button */}
          <button 
            className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-yellow-500 transition"
            onClick={() => alert("Redirecting to Token Store...")} // Placeholder action
          >
            + Get More
          </button>
        </div>
        ) : (
          <div className="px-6 py-3 bg-gray-800 text-white rounded-lg text-center mt-4">
            <p className="text-sm">Not logged in</p>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;