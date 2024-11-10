// ProfilePage.jsx
import React from 'react';

const ProfilePage = () => {
  // Mock-data som vi kommer att ersätta med riktig användardata från backend senare
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    // Vi kan lägga till mer data här senare, t.ex. bettinghistorik
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-6">Your Profile</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Name:</h3>
            <p className="text-gray-300">{user.name}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Email:</h3>
            <p className="text-gray-300">{user.email}</p>
          </div>

          {/* Kommande sektion för tidigare betting */}
          <div>
            <h3 className="text-xl font-semibold">Betting History:</h3>
            <p className="text-gray-400 italic">No bets placed yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
