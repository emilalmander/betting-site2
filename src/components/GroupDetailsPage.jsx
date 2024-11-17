import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberScores, setMemberScores] = useState([]);
  const [inviteUserId, setInviteUserId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false); // For confirming restore

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
        setGroup(response.data);

        // Hämta medlemmarnas poäng
        const membersResponse = await axios.get(`http://localhost:5000/api/leaderboard/group/${groupId}`);
        setMemberScores(membersResponse.data);
      } catch (error) {
        console.error("Kunde inte hämta gruppdata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleInvite = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/invite`, {
        userId: inviteUserId,
      });
      alert(response.data.message);
      setInviteUserId('');
    } catch (error) {
      console.error("Kunde inte skicka inbjudan:", error);
      alert("Misslyckades att skicka inbjudan. Försök igen.");
    }
  };

  const handleEditGroupName = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/groups/${groupId}/rename`, { name: newGroupName });
      setGroup((prevGroup) => ({ ...prevGroup, name: response.data.name }));
      setShowEditModal(false);
    } catch (error) {
      console.error('Kunde inte byta namn på grupp:', error);
      alert('Misslyckades att byta namn på gruppen. Försök igen.');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.put(`http://localhost:5000/api/groups/${groupId}/soft-delete`);
      alert('Gruppen har flyttats till borttagna grupper.');
      navigate('/deleted-groups');
    } catch (error) {
      console.error('Kunde inte flytta grupp till borttagna grupper:', error);
      alert('Misslyckades att ta bort gruppen. Försök igen.');
    }
  };

  const handleRestoreGroup = async () => {
    try {
      await axios.put(`http://localhost:5000/api/groups/${groupId}/restore`);
      alert('Gruppen har återställts.');
      navigate('/my-groups');
    } catch (error) {
      console.error('Kunde inte återställa grupp:', error);
      alert('Misslyckades att återställa gruppen. Försök igen.');
    }
  };

  if (loading) return <p>Laddar...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-4">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
      >
        Tillbaka
      </button>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        {group && (
          <>
            <h2 className="text-3xl font-bold text-center text-green-500 mb-4">{group.name}</h2>
            <h3 className="text-xl font-bold mb-4">Medlemmar och Poäng</h3>
            <ul className="space-y-4">
              {memberScores.map((member) => (
                <li key={member.userId} className="bg-gray-800 p-4 rounded-md">
                  <p><strong>Namn:</strong> {member.name}</p>
                  <p><strong>Poäng:</strong> {member.totalPoints}</p>
                </li>
              ))}
            </ul>

            {group.creator === user.id && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Bjud in en medlem</h3>
                <input
                  type="text"
                  placeholder="Ange användar-ID"
                  value={inviteUserId}
                  onChange={(e) => setInviteUserId(e.target.value)}
                  className="mt-2 bg-gray-800 p-2 rounded-md w-full text-gray-200"
                />
                <button
                  onClick={handleInvite}
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full"
                >
                  Skicka inbjudan
                </button>

                {!group.deleted ? (
                  <>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full"
                    >
                      Redigera Gruppnamn
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
                    >
                      Ta Bort Grupp
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowRestoreConfirm(true)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
                  >
                    Ångra borttagning
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Redigera Gruppnamn</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full bg-gray-700 p-2 rounded-md text-white mb-4"
            />
            <button
              onClick={handleEditGroupName}
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Bekräfta borttagning</h3>
            <p className="text-gray-400 mb-4">Är du säker på att du vill ta bort {group.name}?</p>
            <button
              onClick={handleDeleteGroup}
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

      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Bekräfta återställning</h3>
            <p className="text-gray-400 mb-4">Är du säker på att du vill återställa {group.name}?</p>
            <button
              onClick={handleRestoreGroup}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            >
              Återställ Grupp
            </button>
            <button
              onClick={() => setShowRestoreConfirm(false)}
              className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetailsPage;
