// src/mockUserGuesses.js
export const mockUserGuesses = [
    {
      matchId: "1",
      teamA: "Team Alpha",
      teamB: "Team Beta",
      date: "2024-11-20",
      time: "18:00",
      userGuess: {
        exactScore: { teamA: 26, teamB: 29 },
        winMargin: 3,
        winningTeam: "teamB",
        totalGoals: 55,
        pointsEarned: 10, // Poäng användaren tjänade på denna gissning
      },
    },
    {
      matchId: "2",
      teamA: "Team Gamma",
      teamB: "Team Delta",
      date: "2024-11-21",
      time: "20:00",
      userGuess: {
        exactScore: { teamA: 24, teamB: 26 },
        winMargin: 2,
        winningTeam: "teamB",
        totalGoals: 50,
        pointsEarned: 5,
      },
    },
    // Lägg till fler gissningar om du vill
  ];
  