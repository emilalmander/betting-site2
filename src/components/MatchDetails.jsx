import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [match, setMatch] = useState(null);
  const [exactScore, setExactScore] = useState({ teamA: 20, teamB: 20 });
  const [winMargin, setWinMargin] = useState(0);
  const [winningTeam, setWinningTeam] = useState(null);
  const [totalGoals, setTotalGoals] = useState(0);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/matches/${id}`);
        setMatch(response.data);
      } catch (error) {
        console.error('Error fetching match:', error);
      }
    };

    fetchMatch();
  }, [id]);

  const handleTeamSelection = (team) => {
    setWinningTeam(team);
  };

  const handleScoreChange = (team, increment) => {
    setExactScore((prevScore) => ({
      ...prevScore,
      [team]: Math.max(0, prevScore[team] + increment),
    }));
  };

  const handleTotalGoalsChange = (value) => {
    setTotalGoals((prevTotal) => Math.max(0, prevTotal + value));
  };

  const handleSubmitGuess = async () => {
    try {
      await axios.post('http://localhost:5000/api/guesses', {
        matchId: id,
        userId: user.id,
        exactScore,
        winMargin,
        winningTeam,
        totalGoals,
      });
      setHasGuessed(true);
      alert('Gissning skickad!');
    } catch (error) {
      console.error('Error submitting guess:', error);
      alert('Kunde inte skicka din gissning. Försök igen.');
    }
  };

  const handleChangeGuess = () => {
    setShowConfirmPopup(true);
  };

  const confirmChangeGuess = () => {
    setShowConfirmPopup(false);
    setHasGuessed(false); // Låter användaren göra en ny gissning
  };

  const cancelChangeGuess = () => {
    setShowConfirmPopup(false);
  };

  if (!match) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-6">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg text-center relative">
        
        {/* Tillbaka-knapp */}
        <button onClick={() => navigate(-1)} className="absolute top-20 left-4 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">
          Tillbaka
        </button>

        <h2 className="text-3xl font-bold text-green-500 mb-4">
          {match.teamA} vs {match.teamB}
        </h2>
        <p className="text-gray-400 mb-6">
          {new Date(match.date).toLocaleDateString()} - {match.time}
        </p>

        {/* Välj vinnande lag */}
        <div className="flex justify-center gap-6 mb-6">
          {[match.teamA, match.teamB].map((team) => (
            <button
              key={team}
              onClick={() => handleTeamSelection(team)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                winningTeam === team ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              {team}
            </button>
          ))}
        </div>

        {/* Exakt resultat */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Exakt Resultat</h3>
          <div className="flex justify-center gap-4">
            {['teamA', 'teamB'].map((team) => (
              <div key={team} className="text-center">
                <button
                  onClick={() => handleScoreChange(team, 1)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold"
                >
                  +
                </button>
                <p className="text-xl font-semibold mt-2 mb-2">{exactScore[team]}</p>
                <button
                  onClick={() => handleScoreChange(team, -1)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
                >
                  -
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Förinställda mål för totalpoäng */}
        <div className="mb-4 text-center">
          <label className="block mb-1 font-medium">Totalpoäng (Summan av båda lagens mål)</label>
          <div className="flex justify-center items-center space-x-2">
            <button
              type="button"
              onClick={() => setTotalGoals(totalGoals > 0 ? totalGoals - 1 : 0)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md"
            >-</button>
            <input
              type="number"
              value={totalGoals}
              onChange={(e) => setTotalGoals(parseInt(e.target.value) || 0)}
              className="w-20 text-center bg-gray-800 p-2 rounded-md"
            />
            <button
              type="button"
              onClick={() => setTotalGoals(totalGoals + 1)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md"
            >+</button>
          </div>
          <div className="flex justify-center space-x-2 mt-2">
            {[20, 30, 40].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTotalGoals(value)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                {value} mål
              </button>
            ))}
          </div>
        </div>

        {/* Segermarginal förval */}
        <div className="mb-4 text-center">
          <label className="block mb-1 font-medium">Segermarginal</label>
          <div className="flex justify-center items-center space-x-2">
            <button
              type="button"
              onClick={() => setWinMargin(winMargin > 0 ? winMargin - 1 : 0)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md"
            >-</button>
            <input
              type="number"
              value={winMargin}
              onChange={(e) => setWinMargin(parseInt(e.target.value) || 0)}
              className="w-20 text-center bg-gray-800 p-2 rounded-md"
            />
            <button
              type="button"
              onClick={() => setWinMargin(winMargin + 1)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md"
            >+</button>
          </div>
          <div className="flex justify-center space-x-2 mt-2">
            {[3, 5, 7, 10].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setWinMargin(value)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                {value} mål
              </button>
            ))}
          </div>
        </div>

        {/* Skicka eller Ändra Gissning */}
        <button
          onClick={hasGuessed ? handleChangeGuess : handleSubmitGuess}
          className={`w-full ${hasGuessed ? 'bg-red-500' : 'bg-green-500'} hover:bg-green-600 text-white py-2 rounded-md font-semibold transition duration-200`}
        >
          {hasGuessed ? 'Ändra Gissning' : 'Skicka Gissning'}
        </button>

        {/* Bekräftelseprompt för ändring */}
        {showConfirmPopup && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <p className="text-white mb-4">Vill du ändra din gissning?</p>
              <button onClick={confirmChangeGuess} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mr-2">Ja</button>
              <button onClick={cancelChangeGuess} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Nej</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetails;
