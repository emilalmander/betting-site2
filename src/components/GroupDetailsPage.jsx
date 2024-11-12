import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberScores, setMemberScores] = useState([]);
  const [inviteUserId, setInviteUserId] = useState(''); // Ändra till userId

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
      alert(response.data.message); // Visar meddelandet från servern
      setInviteUserId('');
    } catch (error) {
      console.error("Kunde inte skicka inbjudan:", error);
      alert("Misslyckades att skicka inbjudan. Försök igen.");
    }
  };

  if (loading) return <p>Laddar...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-gray-200 p-4">
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

            {/* Visa inbjudningsfältet endast för skaparen */}
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupDetailsPage;
