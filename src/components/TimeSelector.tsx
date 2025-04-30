
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addHours, format } from 'date-fns';

interface TimeSelectorProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minTime?: Date;
  className?: string;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  label, 
  value, 
  onChange, 
  minTime,
  className
}) => {
  // Generate time slots in 30-minute increments
  const generateTimeSlots = () => {
    const slots: Date[] = [];
    const baseDate = minTime || new Date();
    const startHour = minTime ? baseDate.getHours() : 0;
    const startMinute = minTime ? Math.ceil(baseDate.getMinutes() / 30) * 30 : 0;
    
    // Create a new date with the start hour and minute
    const startDate = new Date(baseDate);
    startDate.setHours(startHour, startMinute, 0, 0);
    
    // Generate 48 slots (24 hours with 30-minute increments)
    for (let i = 0; i < 48; i++) {
      const slotTime = addHours(startDate, i / 2);
      // Only include future times
      if (minTime && slotTime < minTime) continue;
      slots.push(slotTime);
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots();

  const handleChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hours, minutes, 0, 0);
    onChange(newDate);
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
      <Select
        onValueChange={handleChange}
        value={value ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` : undefined}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((slot) => {
            const timeString = format(slot, 'HH:mm');
            const displayTime = format(slot, 'h:mm a');
            return (
              <SelectItem key={timeString} value={timeString}>
                {displayTime}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
