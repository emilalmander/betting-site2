// UserStatsCard.jsx
import React from 'react';

const UserStatsCard = ({ totalPoints, guessCount }) => (
  <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
    <h2 className="text-2xl font-bold text-green-500 mb-4">Användarstatistik</h2>
    <div className="flex justify-around text-lg">
      <div>
        <p className="font-semibold">Totala Poäng</p>
        <p className="text-green-400 text-2xl font-bold">{totalPoints}</p>
      </div>
      <div>
        <p className="font-semibold">Antal Gissningar</p>
        <p className="text-green-400 text-2xl font-bold">{guessCount}</p>
      </div>
    </div>
  </div>
);

export default UserStatsCard;
