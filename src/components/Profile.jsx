// Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');  // Hämta JWT-token från localStorage
        console.log('Token hämtad i Profile-komponenten:', token);  // Kontrollera att token hämtas
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },  // Skicka token i headern
        });
        setUserData(res.data.user); // Spara användardata i state
      } catch (error) {
        console.error('Kunde inte hämta användardata', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <p>Laddar användarinfo...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Välkommen, {userData.name}!</h2>
      <p>Email: {userData.email}</p>
      <p>Detta är din profilsida där du kan se dina uppgifter och uppdatera din information.</p>
    </div>
  );
};

export default Profile;
