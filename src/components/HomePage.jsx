// Uppdaterad HomePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchCard from './MatchCard';
import HeroSection from './HeroSection';
import HowToBetSection from './HowToBetSection';
import LeaderboardSection from './LeaderBoardSection';
import MyGroupsSection from './MyGroupsSection';

const HomePage = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/matches/upcoming'); // Justera URL om nödvändigt
        setMatches(response.data);
      } catch (error) {
        console.error("Kunde inte hämta matcher:", error);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      {/* Hero Section */}
      <HeroSection />
        <HowToBetSection />
      {/* Kommande Matcher Sektion */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Kommande Matcher</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {matches.length > 0 ? (
            matches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))
          ) : (
            <p className="text-center text-gray-400">Inga kommande matcher tillgängliga.</p>
          )}
        </div>

      </section>
      <LeaderboardSection />
      <MyGroupsSection />
    </div>
  );
};

export default HomePage;
