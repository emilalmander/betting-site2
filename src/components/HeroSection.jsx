// HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative bg-cover bg-center bg-gray-800 min-h-screen flex items-center justify-center text-center" 
             style={{ backgroundImage: 'url("/path-to-your-background-image.jpg")' }}>
      <div className="absolute inset-0 bg-black opacity-60"></div> {/* Mörk overlay */}
      <div className="relative z-10 text-white px-4 md:px-8 lg:px-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Välkommen till Handbolls-EM Betting</h1>
        <p className="text-lg md:text-xl mb-6">Gissa resultat, samla poäng och tävla med familj och vänner.</p>
        
        <div className="space-x-4">
          <Link to="/matches">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-semibold">
              Se Matcher
            </button>
          </Link>
          <Link to="/my-groups">
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-semibold">
              Gå med i en Grupp
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
