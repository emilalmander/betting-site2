// MatchHistoryCard.jsx
import React from 'react';

const MatchHistoryCard = ({ guessHistory }) => (
  <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl">
    <h2 className="text-2xl font-bold text-green-500 mb-4 text-center">Matchhistorik</h2>
    {guessHistory.length > 0 ? (
      <ul className="space-y-4">
        {guessHistory.map((guess) => (
          <li key={guess._id} className="bg-gray-800 p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{guess.match.teamA} vs {guess.match.teamB}</span>
              <span className="text-gray-400 text-sm">{new Date(guess.match.date).toLocaleDateString()}</span>
            </div>
            <p className="mb-1"><strong>Gissat Resultat:</strong> {guess.exactScore.teamA} - {guess.exactScore.teamB}</p>
            <p className="mb-1"><strong>Vinnande Lag:</strong> {guess.winningTeam}</p>
            <p className="mb-1"><strong>Segermarginal:</strong> {guess.winMargin} mål</p>
            <p className="mb-1"><strong>Totalpoäng:</strong> {guess.totalGoals}</p>
            <p className="font-bold text-green-400"><strong>Poäng Tjänade:</strong> {guess.pointsEarned}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center text-gray-400">Ingen matchhistorik tillgänglig.</p>
    )}
  </div>
);

export default MatchHistoryCard;
