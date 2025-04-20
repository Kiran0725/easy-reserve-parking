
import React, { useEffect } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { useParkingStore } from '@/lib/store';

const Admin: React.FC = () => {
  const { currentUser } = useParkingStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not admin
    if (currentUser?.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  if (currentUser?.role !== 'admin') {
    return null; // Will redirect
  }
  
  return <AdminDashboard />;
};

export default Admin;
