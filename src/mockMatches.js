// src/mockMatches.js
export const mockMatches = [
    {
      matchId: "1",
      teamA: "Team Alpha",
      teamB: "Team Beta",
      date: "2024-11-20",
      time: "18:00",
      odds: {
        teamA: 1.5,
        teamB: 2.8,
        draw: 3.0,
      },
      userGuess: {
        exactScore: { teamA: 26, teamB: 29 },
        winMargin: 3,
        winningTeam: "teamB",
        totalGoals: 55,
      }
    },
    {
      matchId: "2",
      teamA: "Team Gamma",
      teamB: "Team Delta",
      date: "2024-11-21",
      time: "20:00",
      odds: {
        teamA: 2.0,
        teamB: 2.5,
        draw: 3.2,
      },
      userGuess: null // Ingen gissning för denna match än
    },
    // Fler matcher...
  ];
  