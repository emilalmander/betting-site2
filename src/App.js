// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import { AuthProvider } from './AuthContext';
import MatchesPage from './components/MatchesPage';
import MatchDetails from './components/MatchDetails';
import Leaderboard from './components/Leaderboard';
import CreateGroup from './components/CreateGroup';
import MyGroupsPage from './components/MyGroupsPage';
import GroupDetailsPage from './components/GroupDetailsPage';
import HomePage from './components/HomePage';



function App() {
  console.log("App laddas"); // Testutmatning
  return (
    <AuthProvider>
    <Router>
      <div className="bg-gray-950 min-h-screen text-gray-200">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/howToBet" element={<InfoSection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:id" element={<MatchDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/my-groups" element={<MyGroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
          

          
          {/* Lägg till andra routes här */}
        </Routes>

        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
