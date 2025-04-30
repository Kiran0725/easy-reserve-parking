
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParkingStore } from '@/lib/store';
import { useTicketTimer } from '@/hooks/useTicketTimer';
import { format } from 'date-fns';

export const TicketStatus: React.FC = () => {
  const [searchTicketId, setSearchTicketId] = useState('');
  const [currentTicket, setCurrentTicket] = useState<string | null>(null);
  
  const { reservations } = useParkingStore();
  const reservation = reservations.find(r => r.ticketId === currentTicket);
  
  const { formatTimeRemaining, isExpired, isInGracePeriod } = useTicketTimer({
    startTime: reservation?.startTime || null,
    parkingDuration: 60 // 60 minutes parking time
  });
  
  const handleSearch = () => {
    if (searchTicketId.trim()) {
      setCurrentTicket(searchTicketId.trim());
      setSearchTicketId('');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Ticket Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter ticket ID"
              value={searchTicketId}
              onChange={(e) => setSearchTicketId(e.target.value)}
            />
            <Button onClick={handleSearch}>Check</Button>
          </div>
          
          {currentTicket && !reservation && (
            <div className="p-4 bg-red-100 text-red-800 rounded-md">
              Ticket not found. Please check the ID and try again.
            </div>
          )}
          
          {reservation && (
            <div className="p-4 bg-gray-100 rounded-md space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Ticket ID:</span>
                <span className="font-mono">{reservation.ticketId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Parking Spot:</span>
                <span>{reservation.parkingSpotId.replace('spot-', '')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">License Plate:</span>
                <span>{reservation.licensePlate}</span>
              </div>
              
              {reservation.reservationStartTime && (
                <div className="flex justify-between">
                  <span className="font-medium">Reserved From:</span>
                  <span>{format(new Date(reservation.reservationStartTime), 'MMM d, h:mm a')}</span>
                </div>
              )}
              
              {reservation.reservationEndTime && (
                <div className="flex justify-between">
                  <span className="font-medium">Reserved Until:</span>
                  <span>{format(new Date(reservation.reservationEndTime), 'MMM d, h:mm a')}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span>
                  {!reservation.startTime 
                    ? "Not started yet" 
                    : reservation.endTime 
                    ? "Completed" 
                    : "Active"}
                </span>
              </div>
              
              {reservation.startTime && !reservation.endTime && (
                <div className="flex justify-between">
                  <span className="font-medium">Time Remaining:</span>
                  <span className={`font-mono ${isExpired ? 'text-red-600' : ''}`}>
                    {isInGracePeriod 
                      ? `Grace period: ${formatTimeRemaining()}` 
                      : isExpired
                      ? "Expired - Extra charges apply"
                      : formatTimeRemaining()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
