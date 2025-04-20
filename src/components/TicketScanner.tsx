
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useParkingStore } from '@/lib/store';
import { calculateParkingFee } from '@/utils/parkingUtils';

export const TicketScanner: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  
  const { startSession, endSession, reservations } = useParkingStore();
  
  const handleScan = () => {
    if (!ticketId) {
      setMessage({ text: 'Please enter a ticket ID', type: 'error' });
      return;
    }
    
    // Find the reservation
    const reservation = reservations.find(r => r.ticketId === ticketId);
    
    if (!reservation) {
      setMessage({ text: 'Invalid ticket ID', type: 'error' });
      return;
    }
    
    // Check if session has already started
    if (reservation.startTime) {
      // End the session
      const updatedReservation = endSession(ticketId);
      
      if (updatedReservation && updatedReservation.startTime) {
        const startTime = new Date(updatedReservation.startTime);
        const endTime = new Date();
        const fee = calculateParkingFee(startTime, endTime);
        
        setFee(fee);
        setMessage({
          text: 'Session ended successfully',
          type: 'success',
        });
      }
    } else {
      // Start the session
      const updatedReservation = startSession(ticketId);
      
      if (updatedReservation) {
        setMessage({
          text: 'Session started successfully',
          type: 'success',
        });
      }
    }
    
    // Clear the ticket ID
    setTicketId('');
  };
  
  const resetScanner = () => {
    setMessage(null);
    setFee(null);
    setTicketId('');
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ticket Scanner</CardTitle>
        <CardDescription>
          Enter your ticket ID to start or end your parking session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message ? (
          <div className={`p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' :
            message.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {message.text}
            
            {fee !== null && (
              <div className="mt-2">
                <p className="font-semibold">Total Fee: ${fee.toFixed(2)}</p>
                <p className="text-sm mt-1">Thank you for using our parking service!</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter ticket ID"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
              />
              <Button onClick={handleScan}>Scan</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your ticket ID when you arrive and when you leave
            </p>
          </>
        )}
      </CardContent>
      
      {message && (
        <CardFooter>
          <Button onClick={resetScanner} className="w-full">
            Scan Another Ticket
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
