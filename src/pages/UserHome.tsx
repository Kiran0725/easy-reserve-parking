
import React, { useState, useEffect } from 'react';
import { ParkingGrid } from '@/components/ParkingGrid';
import { ReservationForm } from '@/components/ReservationForm';
import { TicketDetails } from '@/components/TicketDetails';
import { useParkingStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReservationTimeForm } from '@/components/ReservationTimeForm';

const UserHome: React.FC = () => {
  const [step, setStep] = useState<'grid' | 'time' | 'form' | 'confirmation'>('grid');
  const [ticketId, setTicketId] = useState<string | null>(null);
  
  const { selectedSpotId, reservations } = useParkingStore();
  
  const handleReservationSuccess = (newTicketId: string) => {
    setTicketId(newTicketId);
    setStep('confirmation');
  };
  
  const reservation = ticketId
    ? reservations.find(res => res.ticketId === ticketId)
    : null;
  
  // Poll for updates every 30 seconds to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Polling for updates...");
      // In a real app, this would call an API endpoint
      // For our demo, the state is already reactive
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Reserve Your Parking Space</h1>
      
      {step === 'grid' && (
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              Select an available parking spot from the map below
            </p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <ParkingGrid />
            </CardContent>
          </Card>
          
          {selectedSpotId && (
            <div className="flex justify-center">
              <Button onClick={() => setStep('time')} className="mt-4">
                Continue to Select Time
              </Button>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-800 mb-2">How it works:</h2>
            <ol className="list-decimal pl-5 text-blue-700 space-y-1">
              <li>Select an available parking spot</li>
              <li>Choose your parking time</li>
              <li>Fill in your details and payment information</li>
              <li>Receive your ticket ID for entry and exit</li>
              <li>Use the ticket scanner when you arrive and leave</li>
              <li>Enjoy a 10-minute grace period after your time expires</li>
            </ol>
          </div>
        </div>
      )}
      
      {step === 'time' && (
        <div className="space-y-4 max-w-md mx-auto">
          <Button variant="outline" onClick={() => setStep('grid')} className="mb-4">
            ← Back to Parking Map
          </Button>
          
          <ReservationTimeForm 
            onNext={() => setStep('form')}
            onBack={() => setStep('grid')} 
          />
        </div>
      )}
      
      {step === 'form' && (
        <div className="space-y-4 max-w-md mx-auto">
          <Button variant="outline" onClick={() => setStep('time')} className="mb-4">
            ← Back to Time Selection
          </Button>
          
          <ReservationForm onSuccess={handleReservationSuccess} />
        </div>
      )}
      
      {step === 'confirmation' && ticketId && reservation && (
        <TicketDetails 
          ticketId={ticketId} 
          reservation={reservation} 
          onClose={() => setStep('grid')}
        />
      )}
    </div>
  );
};

export default UserHome;
