// LeaderboardSection.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaderboardSection = () => {
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
    <section className="my-10 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-green-400 mb-6">Top 10 Leaderboard</h2>
      {leaders.length > 0 ? (
        <table className="w-full text-left bg-gray-900 rounded-lg">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2">Placering</th>
              <th className="py-2">Namn</th>
              <th className="py-2">Poäng</th>
            </tr>
          </thead>
          <tbody>
            {leaders.slice(0, 10).map((user, index) => (
              <tr key={user.userId} className="border-b border-gray-700">
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">Inga poäng tillgängliga ännu.</p>
      )}
    </section>
  );
};

export default LeaderboardSection;
