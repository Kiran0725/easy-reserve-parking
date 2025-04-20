
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useParkingStore } from '@/lib/store';

export const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser } = useParkingStore();
  
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
          
          <Button variant="outline" onClick={handleRoleToggle}>
            {currentUser?.role === 'admin' 
              ? 'Switch to User' 
              : 'Switch to Admin'}
          </Button>
        </div>
      </div>
    </div>
  );
};
