// src/components/MyGroupsSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const MyGroupsSection = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/groups/user/${user.id}`);
          setGroups(response.data);
        } catch (error) {
          console.error('Kunde inte hämta användarens grupper:', error);
        }
      }
    };

    fetchGroups();
  }, [user]);

  return (
    <section className="my-8 p-4 bg-gray-900 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-green-400 mb-4">Mina Grupper</h2>
      {groups.length > 0 ? (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li key={group._id} className="bg-gray-800 p-4 rounded-md">
              <Link to={`/groups/${group._id}`} className="text-green-400 hover:underline">
                <p className="font-semibold">{group.name}</p>
                <p className="text-sm text-gray-400">
                  {group.members.length} {group.members.length === 1 ? 'medlem' : 'medlemmar'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic">Du måste logga in för att se dina grupper.</p>
      )}
    </section>
  );
};

export default MyGroupsSection;
