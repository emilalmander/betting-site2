import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchCard from './MatchCard';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/matches');
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <h1>Alla Matcher</h1>
      {matches.length > 0 ? (
        matches.map((match) => <MatchCard key={match._id} match={match} />)
      ) : (
        <p>Inga matcher tillgängliga.</p>
      )}
    </div>
  );
};

export default MatchesPage;
