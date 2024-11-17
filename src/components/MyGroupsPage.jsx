import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const MyGroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [deletedGroups, setDeletedGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.error("Användaren är inte inloggad.");
      return;
    }

    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups/user/${user.id}`);
        setGroups(response.data.filter((group) => !group.deleted));
      } catch (error) {
        console.error('Kunde inte hämta grupper:', error);
      }
    };

    const fetchDeletedGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups/user/${user.id}/deleted`);
        setDeletedGroups(response.data);
      } catch (error) {
        console.error('Kunde inte hämta borttagna grupper:', error);
      }
    };

    fetchGroups();
    fetchDeletedGroups();
  }, [user]);

  const handleCreateGroup = async () => {
    if (!newGroupName) return;
    try {
      const response = await axios.post('http://localhost:5000/api/groups', {
        name: newGroupName,
        creatorId: user?.id,
        memberIds: [],
      });
      setGroups((prevGroups) => [...prevGroups, response.data]);
      setNewGroupName('');
    } catch (error) {
      console.error('Kunde inte skapa grupp:', error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await axios.post(`http://localhost:5000/api/groups/${groupId}/leave`, { userId: user?.id });
      setGroups(groups.filter((group) => group._id !== groupId));
    } catch (error) {
      console.error('Kunde inte lämna grupp:', error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.put(`http://localhost:5000/api/groups/${groupId}/soft-delete`);
      setGroups(groups.filter((group) => group._id !== groupId));
      setShowDeleteConfirm(false);
      // Fetch deleted groups again to update the list
      const response = await axios.get(`http://localhost:5000/api/groups/user/${user.id}/deleted`);
      setDeletedGroups(response.data);
    } catch (error) {
      console.error('Kunde inte ta bort grupp:', error);
    }
  };

  const handleEditGroupName = async (groupId, newName) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/groups/${groupId}/rename`, { name: newName });
      setGroups(groups.map((group) => (group._id === groupId ? response.data : group)));
      setShowEditModal(false);
    } catch (error) {
      console.error('Kunde inte byta namn på grupp:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-200">
        <p className="text-xl text-gray-400">Du måste vara inloggad för att visa denna sida.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full md:w-1/3">
          <h2 className="text-xl font-semibold text-green-500 mb-4">Skapa Ny Grupp</h2>
          <input
            type="text"
            placeholder="Gruppnamn"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded-md text-white mb-4"
          />
          <button
            onClick={handleCreateGroup}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
          >
            Skapa Grupp
          </button>
        </div>

        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-green-500 mb-6 text-center">Mina Grupper</h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {groups.length > 0 ? (
              groups.map((group) => (
                <Link to={`/groups/${group._id}`} key={group._id} className="block">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition">
                    <h3 className="text-xl font-semibold text-green-400 mb-2">{group.name}</h3>
                    <p className="text-gray-400 mb-4">Antal medlemmar: {group.members?.length || 0}</p>

                    <div className="flex gap-2">
                      {group.creator === user.id ? (
                        <>
                          <button
                            onClick={(e) => { e.preventDefault(); setSelectedGroup(group); setShowEditModal(true); }}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded-md"
                          >
                            Redigera Grupp
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); setSelectedGroup(group); setShowDeleteConfirm(true); }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-md"
                          >
                            Ta Bort Grupp
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => { e.preventDefault(); handleLeaveGroup(group._id); }}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-md"
                        >
                          Lämna Grupp
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400 col-span-full">Inga grupper tillgängliga.</p>
            )}
          </div>
        </div>
      </div>

      {showEditModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Redigera Gruppnamn</h3>
            <input
              type="text"
              defaultValue={selectedGroup.name}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full bg-gray-700 p-2 rounded-md text-white mb-4"
            />
            <button
              onClick={() => handleEditGroupName(selectedGroup._id, newGroupName)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
            >
              Spara
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Bekräfta borttagning</h3>
            <p className="text-gray-400 mb-4">Är du säker på att du vill ta bort {selectedGroup.name}?</p>
            <button
              onClick={() => handleDeleteGroup(selectedGroup._id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            >
              Ta Bort
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-3xl font-bold text-red-500 mb-6 text-center">Borttagna Grupper</h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {deletedGroups.length > 0 ? (
            deletedGroups.map((group) => (
              <div key={group._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-red-400 mb-2">{group.name}</h3>
                <p className="text-gray-400 mb-4">Antal medlemmar: {group.members?.length || 0}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">Inga borttagna grupper tillgängliga.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGroupsPage;
