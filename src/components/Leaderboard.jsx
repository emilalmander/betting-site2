// src/components/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/leaderboard');
        setLeaders(response.data);
      } catch (error) {
        console.error('Kunde inte hämta leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-6">Leaderboard</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2">Placering</th>
              <th className="py-2">Namn</th>
              <th className="py-2">Poäng</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, index) => (
              <tr key={user.userId} className={`${index < 3 ? 'text-green-400' : ''} border-b border-gray-700`}>
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
