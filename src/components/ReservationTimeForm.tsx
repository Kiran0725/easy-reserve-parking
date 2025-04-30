
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParkingStore } from '@/lib/store';
import { DateTimeSelector } from './DateTimeSelector';
import { addHours } from 'date-fns';

interface ReservationTimeFormProps {
  onNext: () => void;
  onBack: () => void;
}

export const ReservationTimeForm: React.FC<ReservationTimeFormProps> = ({ onNext, onBack }) => {
  const { setReservationTimes } = useParkingStore();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleStartTimeChange = (date: Date) => {
    setStartTime(date);
    
    // If end time is not set or is earlier than the new start time + 1 hour, update it
    if (!endTime || endTime <= addHours(date, 1)) {
      const newEndTime = addHours(date, 1);
      setEndTime(newEndTime);
    }
  };
  
  const handleEndTimeChange = (date: Date) => {
    setEndTime(date);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startTime || !endTime) {
      setError('Please select both start and end times');
      return;
    }
    
    if (endTime <= startTime) {
      setError('End time must be after start time');
      return;
    }
    
    // Calculate the duration in hours
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    if (durationHours < 1) {
      setError('Minimum booking duration is 1 hour');
      return;
    }
    
    if (durationHours > 24) {
      setError('Maximum booking duration is 24 hours');
      return;
    }
    
    // Save the reservation times
    setReservationTimes(startTime, endTime);
    onNext();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Reservation Time</CardTitle>
        <CardDescription>
          Choose when you'd like to park your vehicle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <DateTimeSelector
              label="Start Time"
              value={startTime}
              onChange={handleStartTimeChange}
              minDate={new Date()}
              className="w-full"
            />
            
            <DateTimeSelector
              label="End Time"
              value={endTime}
              onChange={handleEndTimeChange}
              minDate={startTime ? addHours(startTime, 1) : new Date()}
              className="w-full"
            />
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">
                Continue
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
