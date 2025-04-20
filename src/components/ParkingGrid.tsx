
import React from 'react';
import { useParkingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ParkingLegend } from './ParkingLegend';

interface ParkingGridProps {
  isAdmin?: boolean;
}

export const ParkingGrid: React.FC<ParkingGridProps> = ({ isAdmin = false }) => {
  const { parkingLayout, toggleSpotAvailability, selectSpot, selectedSpotId } = useParkingStore();

  const handleSpotClick = (spotId: string, isAvailable: boolean, isReserved: boolean) => {
    if (isAdmin) {
      toggleSpotAvailability(spotId);
    } else if (isAvailable && !isReserved) {
      selectSpot(spotId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ParkingLegend isAdmin={isAdmin} />

      <div className="grid grid-cols-6 gap-3">
        {parkingLayout.flat().map((spot) => (
          <Button
            key={spot.id}
            variant="outline"
            className={cn(
              "h-16 w-full relative",
              spot.isAvailable
                ? spot.isReserved
                  ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                  : selectedSpotId === spot.id
                  ? "bg-parking-selected hover:bg-parking-selected text-white"
                  : "bg-white hover:bg-gray-100"
                : "bg-parking-unavailable hover:bg-parking-unavailable text-white cursor-not-allowed"
            )}
            disabled={isAdmin ? false : (!spot.isAvailable || spot.isReserved)}
            onClick={() => handleSpotClick(spot.id, spot.isAvailable, spot.isReserved)}
          >
            <span className="absolute top-1 left-1 text-xs text-gray-500">
              {spot.id.replace('spot-', '')}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
