
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useParkingStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser } = useParkingStore();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigate('/auth');
  };
  
  const handleRoleToggle = () => {
    if (currentUser?.role === 'admin') {
      setCurrentUser({ role: 'user' });
    } else if (currentUser?.role === 'user') {
      setCurrentUser({ role: 'admin' });
    } else {
      setCurrentUser({ role: 'user' });
    }
  };
  
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          ParkEase
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          
          <Link to="/scanner" className="text-gray-600 hover:text-gray-900">
            Ticket Scanner
          </Link>
          
          {currentUser && (
            <Button variant="outline" onClick={handleRoleToggle}>
              {currentUser.role === 'admin' 
                ? 'Switch to User' 
                : 'Switch to Admin'}
            </Button>
          )}

          {currentUser ? (
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-primary hover:text-primary-dark"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
