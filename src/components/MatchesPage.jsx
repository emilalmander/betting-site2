import React, { useState, useEffect } from "react";
import axios from "axios";
import MatchCard from "./MatchCard";
import { useAuth } from "../AuthContext"; // Om du har en AuthContext för användarinformation

const MatchesPage = () => {
  const { user } = useAuth(); // Hämta användaren från AuthContext
  const [allMatches, setAllMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("today");
  const [visibleMatches, setVisibleMatches] = useState(20); // Initial antal matcher
  const [searchTerm, setSearchTerm] = useState("");
  const [ongoingGuesses, setOngoingGuesses] = useState([]); // För pågående gissningar
  const [loadingGuesses, setLoadingGuesses] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/matches");
        const matches = response.data;
        setAllMatches(matches);
        filterMatches("today", matches); // Standardkategori
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchOngoingGuesses = async () => {
      if (!user?.id) {
        console.warn("Ingen användare inloggad, hämtar inte pågående gissningar.");
        return;
      }
      try {
        setLoadingGuesses(true);
        const response = await axios.get(`http://localhost:5000/api/guesses/user/${user.id}/ongoing`);
        setOngoingGuesses(response.data);
      } catch (error) {
        console.error("Error fetching ongoing guesses:", error);
      } finally {
        setLoadingGuesses(false);
      }
    };

    fetchOngoingGuesses();
  }, [user]);

  const filterMatches = (category, matches = allMatches) => {
    const today = new Date().toLocaleDateString();

    let filtered = [];
    switch (category) {
      case "today":
        filtered = matches.filter((match) => match.date === today);
        break;
      case "upcoming":
        filtered = matches.filter((match) => new Date(match.date) > new Date(today));
        break;
      case "popular":
        filtered = matches.slice(0, 10); // Mock för "populära matcher"
        break;
      default:
        filtered = matches;
    }

    setFilteredMatches(filtered);
    setCurrentCategory(category);
    setVisibleMatches(20); // Återställ synliga matcher vid kategoriändring
  };

  const loadMoreMatches = () => {
    setVisibleMatches((prev) => prev + 20);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const lowerSearchTerm = e.target.value.toLowerCase();
    setFilteredMatches(
      allMatches.filter(
        (match) =>
          match.teamA.toLowerCase().includes(lowerSearchTerm) ||
          match.teamB.toLowerCase().includes(lowerSearchTerm)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex">
      {/* Navigering */}
      <aside className="w-64 bg-gray-900 p-4">
        <h2 className="text-xl font-bold text-green-400 mb-6">Navigering</h2>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer p-2 rounded-lg ${
              currentCategory === "today" ? "bg-green-500 text-white" : "hover:bg-gray-800"
            }`}
            onClick={() => filterMatches("today")}
          >
            Dagens Matcher
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg ${
              currentCategory === "popular" ? "bg-green-500 text-white" : "hover:bg-gray-800"
            }`}
            onClick={() => filterMatches("popular")}
          >
            Populära Matcher
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg ${
              currentCategory === "upcoming" ? "bg-green-500 text-white" : "hover:bg-gray-800"
            }`}
            onClick={() => filterMatches("upcoming")}
          >
            Kommande Matcher
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg ${
              currentCategory === "ongoing" ? "bg-green-500 text-white" : "hover:bg-gray-800"
            }`}
            onClick={() => setCurrentCategory("ongoing")}
          >
            Mina Gissningar
          </li>
        </ul>
      </aside>

      {/* Innehåll */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-400">Matcher</h1>
          <input
            type="text"
            placeholder="Sök efter lag..."
            className="w-1/3 p-2 border rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {currentCategory === "ongoing" ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-green-400">Pågående Gissningar</h2>
            {loadingGuesses ? (
              <p className="text-gray-400">Laddar...</p>
            ) : ongoingGuesses.length === 0 ? (
              <p className="text-gray-400">Inga pågående gissningar.</p>
            ) : (
              <ul className="space-y-4">
                {ongoingGuesses.map((guess) => (
                  <li
                    key={guess._id}
                    className="bg-gray-800 p-4 rounded-lg shadow-md text-gray-300"
                  >
                    <p>
                      <span className="font-bold">{guess.match.teamA}</span> vs{" "}
                      <span className="font-bold">{guess.match.teamB}</span>
                    </p>
                    <p>
                      Gissat resultat:{" "}
                      <span className="font-semibold">
                        {guess.exactScore.teamA} - {guess.exactScore.teamB}
                      </span>
                    </p>
                    <p>Vinnande lag: {guess.winningTeam}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMatches.slice(0, visibleMatches).length > 0 ? (
              filteredMatches.slice(0, visibleMatches).map((match) => (
                <MatchCard key={match.matchId || match._id} match={match} />
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">Inga matcher hittades.</p>
            )}
          </div>
        )}

        {currentCategory !== "ongoing" && visibleMatches < filteredMatches.length && (
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg"
              onClick={loadMoreMatches}
            >
              Ladda fler matcher
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchesPage;
