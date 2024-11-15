import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchCard from './MatchCard';
import { useAuth } from '../AuthContext';

const MatchesPage = () => {
  const [matchesByDate, setMatchesByDate] = useState({});
  const [userGuesses, setUserGuesses] = useState([]);
  const { user } = useAuth(); // Hämta användarens ID från AuthContext

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/matches');
        const matches = response.data;

        const groupedMatches = matches.reduce((groups, match) => {
          const date = new Date(match.date).toLocaleDateString();
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(match);
          return groups;
        }, {});

        setMatchesByDate(groupedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    const fetchUserGuesses = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/guesses/user/${user.id}`);
          setUserGuesses(response.data.map(guess => guess.match));
        } catch (error) {
          console.error('Error fetching user guesses:', error);
        }
      }
    };

    fetchMatches();
    fetchUserGuesses();
  }, [user]);

  const hasUserGuessed = (matchId) => userGuesses.includes(matchId);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">
      <h1 className="text-3xl font-bold text-center text-green-400 mb-8">Alla Matcher</h1>
      {Object.keys(matchesByDate).length > 0 ? (
        Object.keys(matchesByDate).map((date) => (
          <div key={date} className="mb-8">
            <h2 className="text-2xl font-semibold text-green-500 mb-4">{date}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {matchesByDate[date].map((match) => (
                <MatchCard key={match._id} match={match} hasGuessed={hasUserGuessed(match._id)} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">Inga matcher tillgängliga.</p>
      )}
    </div>
  );
};

export default MatchesPage;
