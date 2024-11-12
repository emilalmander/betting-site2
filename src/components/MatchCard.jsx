// src/components/MatchCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MatchCard = ({ match }) => {
  return (
    <Link to={`/matches/${match.matchId}`} className="block">
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-md hover:bg-gray-800 transition">
        <h2 className="text-xl font-semibold text-center mb-2">
          {match.teamA} vs {match.teamB}
        </h2>
        <p className="text-center">
          {match.date} - {match.time}
        </p>
        <div className="mt-2 text-center">
          <p>Odds:</p>
          <p>Team A: {match.odds.teamA}</p>
          <p>Team B: {match.odds.teamB}</p>
          <p>Draw: {match.odds.draw}</p>
        </div>

        {/* Visa användarens gissning om den finns */}
        {match.userGuess && (
          <div className="mt-4 p-2 bg-gray-800 rounded-md text-center">
            <h3 className="text-sm font-medium text-green-500">Din Gissning</h3>
            <p>Exakt resultat: {match.userGuess.exactScore.teamA} - {match.userGuess.exactScore.teamB}</p>
            <p>Vinnande lag: {match.userGuess.winningTeam === "teamA" ? match.teamA : match.teamB}</p>
            <p>Totalpoäng: {match.userGuess.totalGoals}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MatchCard;
