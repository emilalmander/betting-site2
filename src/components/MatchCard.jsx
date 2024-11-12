import React from 'react';
import { Link } from 'react-router-dom';

const MatchCard = ({ match }) => {
  return (
    <Link to={`/matches/${match._id}`} className="block">
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-md hover:bg-gray-800 transition">
        <h2 className="text-xl font-semibold text-center mb-2">
          {match.teamA} vs {match.teamB}
        </h2>
        <p className="text-center">
          {new Date(match.date).toLocaleDateString()} - {match.time}
        </p>
        <div className="mt-2 text-center">
          <p>Odds:</p>
          <p>Team A: {match.odds.teamA}</p>
          <p>Team B: {match.odds.teamB}</p>
          <p>Draw: {match.odds.draw}</p>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
