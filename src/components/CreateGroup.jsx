// src/components/CreateGroup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const CreateGroup = () => {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [memberIds, setMemberIds] = useState([]); // Lägg till fält för medlemsinbjudningar
  const [message, setMessage] = useState('');

  const handleCreateGroup = async () => {
    try {
        console.log("Användar-ID som skickas för skapande av grupp:", user.id);

        console.log('Skapar grupp med data:', {
            name: groupName,
            creatorId: user.id,
            memberIds: [],
          }); // Kontrollera datan här

      const response = await axios.post('http://localhost:5000/api/groups', {
        name: groupName,
        creatorId: user.id,
        memberIds,
      });
      setMessage(`Gruppen '${response.data.name}' har skapats!`);
    } catch (error) {
      console.error('Kunde inte skapa grupp:', error);
      setMessage('Kunde inte skapa grupp. Försök igen senare.');
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-6">Skapa en Grupp</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Gruppnamn"
          className="w-full p-2 mb-4 bg-gray-800 rounded-md"
        />
        <button
          onClick={handleCreateGroup}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold"
        >
          Skapa Grupp
        </button>
        {message && <p className="text-center text-green-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default CreateGroup;
