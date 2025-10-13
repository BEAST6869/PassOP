import { useState, useEffect } from 'react';
import './App.css';
import api from './api';

import Navbar from './components/Navbar';
import Manager from './components/Manager';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/api/auth/session');
        setUser(data.user || false);
      } catch (error) {
        console.error("Not authenticated");
        setUser(false);
      }
    };
    fetchUser();
  }, []);

  // 1. Create the logout handler function here
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      // 2. Set the user state to false immediately on success
      setUser(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const renderMainContent = () => {
    switch (user) {
      case null:
        return <div className="text-center p-10 font-bold">Loading...</div>;
      case false:
        return <LoginPage />;
      default:
        return <Manager user={user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>
      
      {/* 3. Pass the handleLogout function as a prop to Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex-1">
        {renderMainContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;