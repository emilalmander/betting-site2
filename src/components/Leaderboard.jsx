import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState(() => {
    // Försök ladda cached data från localStorage
    const cachedData = localStorage.getItem('leaderboardData');
    return cachedData ? JSON.parse(cachedData) : [];
  });
  const [loading, setLoading] = useState(leaders.length === 0);

  useEffect(() => {
    if (leaders.length > 0) {
      // Använd cached data om det redan finns
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/leaderboard');
        setLeaders(response.data);
        localStorage.setItem('leaderboardData', JSON.stringify(response.data)); // Spara data i localStorage
      } catch (error) {
        console.error('Kunde inte hämta leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [leaders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200">
        <p className="text-center text-gray-400">Laddar leaderboard...</p>
      </div>
    );
  }

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
              <tr
                key={user.userId}
                className={`${index < 3 ? 'text-green-400' : ''} border-b border-gray-700`}
              >
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
