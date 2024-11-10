// InfoSection.jsx
import React from 'react';

const InfoSection = () => {
  return (
    <section id="infoSection" className="py-20 bg-gray-900 text-gray-200">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-500 mb-6">How Betting Works</h2>
        <p className="text-lg mb-6">
          Betting on our site is easy! Choose your favorite team, set your stakes, and enjoy the thrill of betting with friends.
          You can view the latest odds and manage your bets all in one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Choose Your Team</h3>
            <p>Select a team to bet on from the latest matches.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Set Your Stakes</h3>
            <p>Decide how much you want to bet and confirm.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
