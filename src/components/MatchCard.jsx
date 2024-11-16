import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/solid';

const MatchCard = ({ match = {}, hasGuessed }) => {
  const { teamA = 'N/A', teamB = 'N/A', date = 'N/A', time = 'N/A' } = match;

  return (
    <Link to={`/matches/${match._id || match.matchId}`} className="block w-full max-w-xs mx-auto relative">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition transform hover:scale-105 duration-200 ease-in-out">
        {hasGuessed && (
          <div className="absolute top-4 right-4 text-green-500">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
        )}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 truncate">
            <span className="text-white">{teamA}</span> <span className="text-green-500">vs</span>{' '}
            <span className="text-white">{teamB}</span>
          </h2>
          <p className="text-gray-400 text-sm">
            {new Date(date).toLocaleDateString()} - {time !== 'N/A' ? time : 'Tid ej satt'}
          </p>
        </div>
        
      </div>
    </Link>
  );
};

export default MatchCard;
