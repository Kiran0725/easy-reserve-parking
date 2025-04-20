
import { ParkingSpot, Reservation } from '@/types';

// Initialize parking layout with default values
export const initializeParkingLayout = (rows: number, columns: number): ParkingSpot[][] => {
  const layout: ParkingSpot[][] = [];
  
  for (let r = 0; r < rows; r++) {
    const row: ParkingSpot[] = [];
    
    for (let c = 0; c < columns; c++) {
      row.push({
        id: `spot-${r}-${c}`,
        row: r,
        column: c,
        isAvailable: true, // By default all spots are available for admin to configure
        isReserved: false,
      });
    }
    
    layout.push(row);
  }
  
  return layout;
};

// Generate a random ticket ID
export const generateTicketId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calculate parking fee based on time spent
export const calculateParkingFee = (startTime: Date, endTime: Date, baseRate = 5, hourlyRate = 2): number => {
  const timeSpentMs = endTime.getTime() - startTime.getTime();
  const timeSpentHours = timeSpentMs / (1000 * 60 * 60);
  
  // Base rate + hourly rate for each hour or part thereof
  return baseRate + Math.ceil(timeSpentHours) * hourlyRate;
};

// Save parking data to localStorage
export const saveParkingData = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

// Load parking data from localStorage
export const loadParkingData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return defaultValue;
  }
};

// Simulate sending an SMS notification
export const sendSmsNotification = (phoneNumber: string, message: string): Promise<boolean> => {
  // This would be replaced with a real SMS API call
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};
