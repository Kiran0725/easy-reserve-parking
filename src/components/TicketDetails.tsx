
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reservation } from '@/types';
import { Button } from '@/components/ui/button';

interface TicketDetailsProps {
  ticketId: string;
  reservation: Reservation;
  onClose: () => void;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({ ticketId, reservation, onClose }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Reservation Confirmed!</CardTitle>
        <CardDescription>Your parking spot has been reserved successfully.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-6 rounded-lg text-center">
          <div className="text-lg font-semibold">Ticket ID</div>
          <div className="text-3xl font-bold">{ticketId}</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Use this ID to start and end your parking session
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Parking Space</div>
            <div className="font-semibold">{reservation.parkingSpotId.replace('spot-', 'Space ')}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Date</div>
            <div className="font-semibold">{new Date(reservation.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Vehicle</div>
            <div className="font-semibold">{reservation.licensePlate}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Payment Method</div>
            <div className="font-semibold capitalize">
              {reservation.paymentMethod.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="text-sm text-muted-foreground mb-2">
            Please note:
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Enter your ticket ID when you arrive to start your session</li>
            <li>Enter again when you leave to end the session</li>
            <li>A 10-minute grace period is provided after the reservation ends</li>
            <li>Additional charges will apply after the grace period</li>
          </ul>
        </div>

        <Button className="w-full" onClick={onClose}>
          Done
        </Button>
      </CardContent>
    </Card>
  );
};
