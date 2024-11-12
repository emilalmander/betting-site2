// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user } = useAuth();
  const [guesses, setGuesses] = useState([]);

  useEffect(() => {
    const fetchGuesses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/guesses/user/${user.id}`);
        setGuesses(response.data);
      } catch (error) {
        console.error('Kunde inte hämta gissningshistorik:', error.response ? error.response.data : error.message);
      }
    };
  
    if (user) {
      fetchGuesses();
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-4">Profil</h2>
        {user && (
          <div className="mb-6">
            <p><strong>Namn:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}

        <h3 className="text-2xl font-bold mb-4">Gissningshistorik</h3>
        {guesses.length > 0 ? (
          <ul className="space-y-4">
            {guesses.map((guess) => (
              <li key={guess._id} className="bg-gray-800 p-4 rounded-md">
                <p><strong>Match:</strong> {guess.match.teamA} vs {guess.match.teamB}</p>
                <p><strong>Gissat Resultat:</strong> {guess.exactScore.teamA} - {guess.exactScore.teamB}</p>
                <p><strong>Vinnande Lag:</strong> {guess.winningTeam}</p>
                <p><strong>Segermarginal:</strong> {guess.winMargin}</p>
                <p><strong>Totalpoäng:</strong> {guess.totalGoals}</p>
                <p><strong>Poäng:</strong> {guess.pointsEarned || 0}</p> 
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">Inga gissningar gjorda ännu.</p>
        )}
      </div>
    </div>
  );
};


export default ProfilePage;
