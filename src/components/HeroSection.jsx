// HeroSection.jsx
import React from 'react';

const HeroSection = () => {
  const handleGetStartedClick = () => {
    document.getElementById("infoSection").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="h-screen bg-gray-950 text-center text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Betting Site</h1>
      <p className="text-lg md:text-xl mb-8">Join the best betting community and start winning today!</p>
      <button
        onClick={handleGetStartedClick}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md text-lg"
      >
        Get Started
      </button>
    </section>
  );
};

export default HeroSection;
