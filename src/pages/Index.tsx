
import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import UserHome from './UserHome';
import Admin from './Admin';
import { useParkingStore } from '@/lib/store';

const Index: React.FC = () => {
  const { currentUser, setCurrentUser } = useParkingStore();
  
  // Initialize user on first load
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ role: 'user' });
    }
  }, [currentUser, setCurrentUser]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {currentUser?.role === 'admin' ? <Admin /> : <UserHome />}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
