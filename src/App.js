// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-950 min-h-screen text-gray-200">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/howToBet" element={<InfoSection />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Lägg till andra routes här */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
