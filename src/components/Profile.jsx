import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [guessCount, setGuessCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Hämta JWT-token från localStorage
        console.log('Token hämtad i Profile-komponenten:', token); // Kontrollera att token hämtas

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }, // Skicka token i headern
        });
        setUserData(res.data.user); // Spara användardata i state
      } catch (error) {
        console.error('Kunde inte hämta användardata', error);
      }
    };

    const fetchGuessCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/guesses/user/${userData?._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGuessCount(res.data.totalGuesses || 0);
      } catch (error) {
        console.error('Kunde inte hämta antal gissningar', error);
      }
    };

    const fetchTotalPoints = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/leaderboard/user/${userData?._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalPoints(res.data.totalPoints || 0);
      } catch (error) {
        console.error('Kunde inte hämta totala poäng', error);
      }
    };

    const fetchMatchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/matches/history');
        setMatchHistory(res.data);
      } catch (error) {
        console.error('Kunde inte hämta matchhistorik', error);
      }
    };

    fetchUserData();
    if (userData) {
      fetchGuessCount();
      fetchTotalPoints();
      fetchMatchHistory();
    }
  }, [userData]);

  if (!userData) {
    return <p>Laddar användarinfo...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Välkommen, {userData.name}!</h2>
      <p>Email: {userData.email}</p>
      <p>Detta är din profilsida där du kan se dina uppgifter och uppdatera din information.</p>

      <div className="profile-stats">
        <h3>Statistik</h3>
        <p>Antal gissningar: {guessCount}</p>
        <p>Totala poäng: {totalPoints}</p>
      </div>

      <div className="match-history">
        <h3>Matchhistorik</h3>
        {matchHistory.length > 0 ? (
          <ul>
            {matchHistory.map((match) => (
              <li key={match._id}>
                {match.teamA} vs {match.teamB} - {new Date(match.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>Ingen matchhistorik tillgänglig.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
