// UserInfoCard.jsx
import React from 'react';

const UserInfoCard = ({ user, logout }) => {
  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
      <h2 className="text-3xl font-bold text-green-500 mb-4">Profil</h2>
      <p><strong>Namn:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
      >
        Logga ut
      </button>
    </div>
  );
};

export default UserInfoCard;
