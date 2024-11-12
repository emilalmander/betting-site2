// src/components/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../AuthContext';
import { mockUserGuesses } from '../mockUserGuesses';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Ingen användare är inloggad.</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-6">Your Profile</h2>
        
        <div className="space-y-4">
          {/* Användarinformation */}
          <div>
            <h3 className="text-xl font-semibold">Name:</h3>
            <p className="text-gray-300">{user.name}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Email:</h3>
            <p className="text-gray-300">{user.email}</p>
          </div>

          {/* Bettinghistorik */}
          <div>
            <h3 className="text-xl font-semibold">Betting History:</h3>
            {mockUserGuesses.length > 0 ? (
              <div className="space-y-4 mt-4">
                {mockUserGuesses.map((guess) => (
                  <div key={guess.matchId} className="bg-gray-800 p-4 rounded-md">
                    <h4 className="text-lg font-medium mb-2">{guess.teamA} vs {guess.teamB}</h4>
                    <p><strong>Date:</strong> {guess.date} - {guess.time}</p>
                    <p><strong>Exact Score:</strong> {guess.userGuess.exactScore.teamA} - {guess.userGuess.exactScore.teamB}</p>
                    <p><strong>Winning Team:</strong> {guess.userGuess.winningTeam === "teamA" ? guess.teamA : guess.teamB}</p>
                    <p><strong>Total Points:</strong> {guess.userGuess.totalGoals}</p>
                    <p><strong>Points Earned:</strong> {guess.userGuess.pointsEarned}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No bets placed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
