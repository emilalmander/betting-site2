import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const MyGroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups/user/${user.id}`);
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Kunde inte hämta grupper:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchGroups();
    }
  }, [user]);

  if (loading) {
    return <p>Laddar...</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-4">Mina Grupper</h2>
        {groups && groups.length > 0 ? (
          <ul className="space-y-4">
          {groups.map((group) => (
            <li key={group._id} className="bg-gray-800 p-4 rounded-md">
              <Link to={`/groups/${group._id}`}>
                <p><strong>Gruppnamn:</strong> {group.name}</p>
                <p><strong>Antal medlemmar:</strong> {group.members ? group.members.length : 0}</p>
              </Link>
            </li>
          ))}
        </ul>
        ) : (
          <p className="text-gray-400 italic">Du har inga grupper ännu.</p>
        )}
      </div>
    </div>
  );
};

export default MyGroupsPage;
