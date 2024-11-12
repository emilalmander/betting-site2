// MatchDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const MatchDetails = () => {
  const { id: matchId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [match, setMatch] = useState(null);
  const [exactScore, setExactScore] = useState({ teamA: '', teamB: '' });
  const [winMargin, setWinMargin] = useState('');
  const [winningTeam, setWinningTeam] = useState('');
  const [totalGoals, setTotalGoals] = useState('');
  const [hasGuessed, setHasGuessed] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/matches/${matchId}`);
        setMatch(response.data);
        setLoading(false);

        if (isLoggedIn && user) {
          const checkGuessResponse = await axios.get(`http://localhost:5000/api/guesses/check/${user.id}/${matchId}`);
          setHasGuessed(checkGuessResponse.data.exists);
        }
      } catch (error) {
        console.error('Kunde inte hämta matchdata eller gissningsstatus:', error);
        setError('Kunde inte hämta matchdata');
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId, user, isLoggedIn]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmitGuess = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !user) {
      alert('Du måste vara inloggad för att göra en gissning.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/guesses', {
        matchId,
        userId: user.id,
        exactScore,
        winMargin,
        winningTeam,
        totalGoals,
      });

      setHasGuessed(true);
      alert('Din gissning har skickats!');
    } catch (error) {
      console.error('Kunde inte skicka gissning:', error);
      alert('Det gick inte att skicka din gissning. Försök igen.');
    }
  };

  const handleEditGuess = () => {
    setShowConfirmPopup(true);
  };

  const confirmEditGuess = () => {
    setShowConfirmPopup(false);
    setHasGuessed(false); // Tillåt redigering av fält
  };

  const cancelEditGuess = () => {
    setShowConfirmPopup(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button onClick={handleBackClick} className="absolute top-4 left-4 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">
          Tillbaka
        </button>

        {match && (
          <>
            <h2 className="text-2xl font-bold text-center text-green-500 mb-4">
              {match.teamA} vs {match.teamB}
            </h2>
            <p className="text-center text-gray-400 mb-2">
              {new Date(match.date).toLocaleDateString()} - {match.time}
            </p>
            <p className="text-center text-gray-400 mb-4">Location: {match.location || 'Ej specificerad'}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Lägg din gissning</h3>
              <form onSubmit={handleSubmitGuess} className="space-y-4 mt-4">
                {/* Exakt Resultat */}
                <div>
                  <label className="block mb-1 font-medium">Exakt resultat</label>
                  <input
                    type="number"
                    placeholder="Team A mål"
                    value={exactScore.teamA}
                    onChange={(e) => setExactScore({ ...exactScore, teamA: e.target.value })}
                    className="w-20 bg-gray-800 p-2 rounded-md mr-2 text-center"
                    disabled={hasGuessed}
                  />
                  <input
                    type="number"
                    placeholder="Team B mål"
                    value={exactScore.teamB}
                    onChange={(e) => setExactScore({ ...exactScore, teamB: e.target.value })}
                    className="w-20 bg-gray-800 p-2 rounded-md text-center"
                    disabled={hasGuessed}
                  />
                </div>

                {/* Segermarginal */}
                <div>
                  <label className="block mb-1 font-medium">Segermarginal (ex: Vinner med 5 mål)</label>
                  <input
                    type="number"
                    placeholder="Antal mål"
                    value={winMargin}
                    onChange={(e) => setWinMargin(e.target.value)}
                    className="w-32 bg-gray-800 p-2 rounded-md text-center"
                    disabled={hasGuessed}
                  />
                </div>

                {/* Vinnande Lag */}
                <div>
                  <label className="block mb-1 font-medium">Vinnande lag</label>
                  <select
                    value={winningTeam}
                    onChange={(e) => setWinningTeam(e.target.value)}
                    className="w-full bg-gray-800 p-2 rounded-md text-center"
                    disabled={hasGuessed}
                  >
                    <option value="">Välj lag</option>
                    <option value="teamA">{match.teamA}</option>
                    <option value="teamB">{match.teamB}</option>
                    <option value="draw">Oavgjort</option>
                  </select>
                </div>

                {/* Totalpoäng */}
                <div>
                  <label className="block mb-1 font-medium">Totalpoäng (Summan av båda lagens mål)</label>
                  <input
                    type="number"
                    placeholder="Total mål"
                    value={totalGoals}
                    onChange={(e) => setTotalGoals(e.target.value)}
                    className="w-32 bg-gray-800 p-2 rounded-md text-center"
                    disabled={hasGuessed}
                  />
                </div>

                {/* Skicka/Ändra knapp */}
                <button
                  type={hasGuessed ? 'button' : 'submit'}
                  onClick={hasGuessed ? handleEditGuess : undefined}
                  className={`w-full ${hasGuessed ? 'bg-red-500' : 'bg-green-500'} hover:bg-green-600 text-white py-2 rounded-md font-semibold transition duration-200`}
                >
                  {hasGuessed ? 'Ändra Gissning' : 'Skicka Gissning'}
                </button>
              </form>

              {/* Popup för att bekräfta ändring */}
              {showConfirmPopup && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                    <p className="text-white mb-4">Vill du ändra gissning?</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={confirmEditGuess}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                      >
                        Ja
                      </button>
                      <button
                        onClick={cancelEditGuess}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                      >
                        Nej
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchDetails;
