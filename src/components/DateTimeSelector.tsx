
import React, { useState } from 'react';
import { format, setHours, setMinutes } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock } from 'lucide-react';
import { TimeSelector } from './TimeSelector';

interface DateTimeSelectorProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  label: string;
  className?: string;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  value,
  onChange,
  minDate,
  label,
  className,
}) => {
  const [date, setDate] = useState<Date | undefined>(value || undefined);
  const [time, setTime] = useState<Date | null>(value || null);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    setDate(selectedDate);
    
    // If time is already selected, combine date and time
    if (time) {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
      onChange(newDate);
    } else {
      // If no time selected, use the current time
      const newDate = new Date(selectedDate);
      const now = new Date();
      newDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      setTime(newDate);
      onChange(newDate);
    }
  };
  
  const handleTimeSelect = (selectedTime: Date) => {
    setTime(selectedTime);
    
    // If date is already selected, combine date and time
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      onChange(newDate);
    } else {
      // If no date selected, use today
      const today = new Date();
      today.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      setDate(today);
      onChange(today);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>{label}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(calendarDate) => {
                if (!calendarDate) return false;
                // Disable dates before minDate
                if (minDate && calendarDate < minDate) return true;
                // Disable dates before today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return calendarDate < today;
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !time && "text-muted-foreground"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              {time ? format(time, "h:mm a") : <span>Select time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <TimeSelector 
              label="Select time"
              value={time}
              onChange={handleTimeSelect}
              minTime={date && date.toDateString() === new Date().toDateString() ? new Date() : undefined}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
