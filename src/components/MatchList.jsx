import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/matches/upcoming'); // Hämta endast kommande matcher
        setMatches(response.data); // Sätt matcherna
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Kunde inte hämta matchlistan.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div>Laddar matcher...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Kommande Matcher</h2>
      <ul>
        {matches.map((match) => (
          <li key={match._id}> {/* Använd match._id som unik nyckel */}
            {match.teamA} vs {match.teamB} - {match.date} {match.time}
            <br />
            Odds: Team A: {match.odds.teamA}, Draw: {match.odds.draw}, Team B: {match.odds.teamB}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
