
import { useState, useEffect } from 'react';

interface TicketTimerProps {
  startTime: string | null;
  parkingDuration?: number; // in minutes, default 60
}

export const useTicketTimer = ({ startTime, parkingDuration = 60 }: TicketTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isInGracePeriod, setIsInGracePeriod] = useState(false);
  
  useEffect(() => {
    if (!startTime) {
      setTimeRemaining(null);
      setIsExpired(false);
      setIsInGracePeriod(false);
      return;
    }
    
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(startTimeDate.getTime() + parkingDuration * 60 * 1000);
    const gracePeriodEndDate = new Date(endTimeDate.getTime() + 10 * 60 * 1000); // 10 min grace period
    
    const updateTimer = () => {
      const now = new Date();
      
      if (now < endTimeDate) {
        // Still within regular time
        setTimeRemaining(Math.floor((endTimeDate.getTime() - now.getTime()) / 1000));
        setIsExpired(false);
        setIsInGracePeriod(false);
      } else if (now < gracePeriodEndDate) {
        // In grace period
        setTimeRemaining(Math.floor((gracePeriodEndDate.getTime() - now.getTime()) / 1000));
        setIsExpired(true);
        setIsInGracePeriod(true);
      } else {
        // Expired completely
        setTimeRemaining(0);
        setIsExpired(true);
        setIsInGracePeriod(false);
      }
    };
    
    // Update immediately
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, parkingDuration]);
  
  const formatTimeRemaining = (): string => {
    if (timeRemaining === null) return '--:--';
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return {
    timeRemaining,
    isExpired,
    isInGracePeriod,
    formatTimeRemaining,
  };
};
