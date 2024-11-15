import React from 'react';

const HowToBetSection = () => {
  const cards = [
    {
      title: 'Om Sidan',
      content: 'Den här sidan låter dig tävla med vänner och familj genom att betta på handbollsresultat. Välj en match, gör dina gissningar och samla poäng baserat på hur väl du gissat. Bäst rankade spelare hamnar på vår leaderboard!'
    },
    {
      title: 'Poängsystemet',
      content: 'Poäng delas ut baserat på dina gissningar:\n\n- Exakt resultat: 10 poäng\n- Rätt vinnare: 5 poäng\n- Rätt segermarginal: 3 poäng\n- Rätt antal totala mål (inom 2 mål): 2 poäng\n\nJu mer exakt din gissning, desto fler poäng får du!'
    },
    {
      title: 'Hur Man Bettar',
      content: 'För att göra en gissning, välj en match från listan, fyll i ditt resultat och klicka på "Skicka Gissning". När matchen är över uppdateras dina poäng baserat på matchens faktiska resultat. Se hur dina poäng utvecklas på leaderboarden!'
    },
    {
      title: 'Grupper och Tävlingar',
      content: 'Gå med i en grupp eller skapa din egen för att tävla med vänner och familj. Varje grupp har sin egen leaderboard, så ni kan tävla mot varandra och hålla reda på era resultat. Bjud in nya medlemmar direkt från gruppsidan.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-800 text-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Information om Betting och Sidan</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-green-500 mb-4">{card.title}</h3>
              <p className="text-gray-300 whitespace-pre-line">{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToBetSection;
