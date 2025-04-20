
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import UserHome from './UserHome';
import Admin from './Admin';
import { useParkingStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';

const Index: React.FC = () => {
  const { currentUser, setCurrentUser } = useParkingStore();
  const navigate = useNavigate();
  
  // Set up auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (!session) {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Initialize user on first load
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ role: 'user' });
    }
  }, [currentUser, setCurrentUser]);
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {currentUser.role === 'admin' ? <Admin /> : <UserHome />}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
