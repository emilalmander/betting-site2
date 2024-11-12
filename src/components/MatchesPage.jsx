// src/components/MatchesPage.jsx
import React from 'react';
import { mockMatches } from '../mockMatches';
import MatchCard from './MatchCard';

const MatchesPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200">
      <h1 className="text-3xl font-bold text-green-500 mb-6">Alla Matcher</h1>
      <div className="space-y-4">
        {mockMatches.map((match) => (
          <MatchCard key={match.matchId} match={match} />
        ))}
      </div>
    </div>
  );
};

export default MatchesPage;
