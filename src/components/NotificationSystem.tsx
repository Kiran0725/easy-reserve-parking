
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { sendSmsNotification } from '@/utils/parkingUtils';
import { Reservation } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface NotificationSystemProps {
  reservation: Reservation;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ reservation }) => {
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = React.useState('');
  
  const handleSendNotification = async (preset: string) => {
    let message = preset;
    if (preset === 'custom') {
      if (!customMessage) {
        toast({
          title: "Error",
          description: "Please enter a custom message",
          variant: "destructive",
        });
        return;
      }
      message = customMessage;
    }
    
    try {
      await sendSmsNotification(
        reservation.phoneNumber,
        message
      );
      
      toast({
        title: "Notification Sent",
        description: `Message sent to ${reservation.phoneNumber}`,
      });
      
      setCustomMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSendNotification(
              `Your parking session will expire in 10 minutes. Ticket ID: ${reservation.ticketId}`
            )}
          >
            10-Min Warning
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleSendNotification(
              `Your parking session has expired. Please return to your vehicle. Ticket ID: ${reservation.ticketId}`
            )}
          >
            Expiry Alert
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleSendNotification(
              `Your grace period is ending. Additional charges will apply. Ticket ID: ${reservation.ticketId}`
            )}
          >
            Grace Period Ending
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleSendNotification(
              `Your vehicle is parked in the wrong spot. Please move it immediately. Ticket ID: ${reservation.ticketId}`
            )}
          >
            Wrong Spot Alert
          </Button>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-2">Custom Message:</p>
          <div className="flex space-x-2">
            <Input 
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your custom message..."
            />
            <Button onClick={() => handleSendNotification('custom')}>Send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
