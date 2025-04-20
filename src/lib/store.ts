
import { create } from 'zustand';
import { ParkingSpot, Reservation, User } from '@/types';
import { loadParkingData, saveParkingData, initializeParkingLayout, generateTicketId } from '@/utils/parkingUtils';

interface ParkingState {
  parkingLayout: ParkingSpot[][];
  reservations: Reservation[];
  selectedSpotId: string | null;
  currentUser: User | null;
  
  // Admin actions
  initializeLayout: (rows: number, columns: number) => void;
  toggleSpotAvailability: (spotId: string) => void;
  
  // User actions
  selectSpot: (spotId: string) => void;
  createReservation: (reservationData: Omit<Reservation, 'id' | 'ticketId' | 'createdAt' | 'startTime' | 'endTime'>) => string;
  startSession: (ticketId: string) => Reservation | null;
  endSession: (ticketId: string) => Reservation | null;
  
  // Authentication
  setCurrentUser: (user: User | null) => void;
}

// Initialize the store
export const useParkingStore = create<ParkingState>((set, get) => ({
  // Initial state
  parkingLayout: loadParkingData<ParkingSpot[][]>('parkingLayout', initializeParkingLayout(5, 6)),
  reservations: loadParkingData<Reservation[]>('reservations', []),
  selectedSpotId: null,
  currentUser: null,
  
  // Admin actions
  initializeLayout: (rows: number, columns: number) => {
    const layout = initializeParkingLayout(rows, columns);
    set({ parkingLayout: layout });
    saveParkingData('parkingLayout', layout);
  },
  
  toggleSpotAvailability: (spotId: string) => {
    const { parkingLayout } = get();
    
    const newLayout = parkingLayout.map(row => 
      row.map(spot => 
        spot.id === spotId 
          ? { ...spot, isAvailable: !spot.isAvailable } 
          : spot
      )
    );
    
    set({ parkingLayout: newLayout });
    saveParkingData('parkingLayout', newLayout);
  },
  
  // User actions
  selectSpot: (spotId: string) => {
    set({ selectedSpotId: spotId });
  },
  
  createReservation: (reservationData) => {
    const { parkingLayout, reservations, selectedSpotId } = get();
    
    if (!selectedSpotId) {
      throw new Error('No parking spot selected');
    }
    
    // Generate ticket ID and reservation ID
    const ticketId = generateTicketId();
    const reservationId = `res-${Date.now()}`;
    
    // Create the reservation
    const newReservation: Reservation = {
      id: reservationId,
      parkingSpotId: selectedSpotId,
      ticketId,
      startTime: null,
      endTime: null,
      createdAt: new Date().toISOString(),
      ...reservationData
    };
    
    // Update the parking layout to mark the spot as reserved
    const newLayout = parkingLayout.map(row => 
      row.map(spot => 
        spot.id === selectedSpotId 
          ? { ...spot, isReserved: true, reservationId } 
          : spot
      )
    );
    
    // Update state
    set({ 
      parkingLayout: newLayout, 
      reservations: [...reservations, newReservation],
      selectedSpotId: null
    });
    
    // Save to localStorage
    saveParkingData('parkingLayout', newLayout);
    saveParkingData('reservations', [...reservations, newReservation]);
    
    return ticketId;
  },
  
  startSession: (ticketId: string) => {
    const { reservations } = get();
    
    const reservationIndex = reservations.findIndex(res => res.ticketId === ticketId);
    
    if (reservationIndex === -1) {
      return null;
    }
    
    const updatedReservations = [...reservations];
    updatedReservations[reservationIndex] = {
      ...updatedReservations[reservationIndex],
      startTime: new Date().toISOString()
    };
    
    set({ reservations: updatedReservations });
    saveParkingData('reservations', updatedReservations);
    
    return updatedReservations[reservationIndex];
  },
  
  endSession: (ticketId: string) => {
    const { reservations } = get();
    
    const reservationIndex = reservations.findIndex(res => res.ticketId === ticketId);
    
    if (reservationIndex === -1) {
      return null;
    }
    
    const updatedReservations = [...reservations];
    updatedReservations[reservationIndex] = {
      ...updatedReservations[reservationIndex],
      endTime: new Date().toISOString()
    };
    
    set({ reservations: updatedReservations });
    saveParkingData('reservations', updatedReservations);
    
    return updatedReservations[reservationIndex];
  },
  
  // Authentication
  setCurrentUser: (user) => {
    set({ currentUser: user });
  }
}));
