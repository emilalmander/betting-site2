import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/solid';

const MatchCard = ({ match, hasGuessed }) => {
  return (
    <Link to={`/matches/${match._id}`} className="block w-full max-w-xs mx-auto relative">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:bg-gray-800 transition transform hover:scale-105 duration-200 ease-in-out">
        
        {/* Bock-ikon om gissning har lagts */}
        {hasGuessed && (
          <div className="absolute top-4 right-4 text-green-500">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
        )}
        
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold mb-2">
            {match.teamA} <span className="text-green-500">vs</span> {match.teamB}
          </h2>
          <p className="text-gray-400">{new Date(match.date).toLocaleDateString()} - {match.time}</p>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg mt-4 text-center">
          <h3 className="text-green-500 text-lg font-semibold mb-2">Odds</h3>
          <div className="flex justify-around">
            <div>
              <p className="text-sm text-gray-400">Team A</p>
              <p className="text-white font-semibold">{match.odds.teamA}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Oavgjort</p>
              <p className="text-white font-semibold">{match.odds.draw}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Team B</p>
              <p className="text-white font-semibold">{match.odds.teamB}</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg">
          Visa Detaljer
        </button>
      </div>
    </Link>
  );
};

export default MatchCard;
