
// Types for the ParkEase application

export interface ParkingSpot {
  id: string;
  row: number;
  column: number;
  isAvailable: boolean; // Available for reservation this week
  isReserved: boolean; // Currently reserved by a user
  reservationId?: string;
}

export interface Reservation {
  id: string;
  parkingSpotId: string;
  fullName: string;
  phoneNumber: string;
  licensePlate: string;
  startTime: string | null; // When the session starts (ticket scanned)
  endTime: string | null; // When the session ends (ticket scanned again)
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  ticketId: string;
  createdAt: string;
  reservationStartTime?: string; // New field for reservation start time
  reservationEndTime?: string; // New field for reservation end time
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal';

export interface User {
  role: 'user' | 'admin';
}
