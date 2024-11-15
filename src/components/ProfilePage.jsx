// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import UserInfoCard from './UserInfoCard';
import MatchHistoryCard from './MatchHistoryCard';
import UserStatsCard from './UserStatsCard';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [guessHistory, setGuessHistory] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchGuessHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/guesses/user/${user.id}`);
        setGuessHistory(response.data);
        const total = response.data.reduce((acc, guess) => acc + (guess.pointsEarned || 0), 0);
        setTotalPoints(total);
      } catch (error) {
        console.error("Kunde inte hämta gissningshistorik:", error);
      }
    };

    if (user) fetchGuessHistory();
  }, [user]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-6 space-y-6">
      <UserInfoCard user={user} logout={logout} />
      <UserStatsCard totalPoints={totalPoints} guessCount={guessHistory.length} />
      <MatchHistoryCard guessHistory={guessHistory} />
    </div>
  );
};

export default ProfilePage;
