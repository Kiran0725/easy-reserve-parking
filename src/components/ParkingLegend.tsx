
import React from 'react';

interface ParkingLegendProps {
  isAdmin?: boolean;
}

export const ParkingLegend: React.FC<ParkingLegendProps> = ({ isAdmin = false }) => {
  return (
    <div className="flex justify-center mb-4 flex-wrap">
      <div className="flex items-center mr-6 mb-2">
        <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center mr-6 mb-2">
        <div className="w-4 h-4 bg-parking-unavailable mr-2"></div>
        <span>Unavailable</span>
      </div>
      <div className="flex items-center mr-6 mb-2">
        <div className="w-4 h-4 bg-parking-selected mr-2"></div>
        <span>{isAdmin ? 'Toggling' : 'Selected'}</span>
      </div>
      {!isAdmin && (
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-gray-400 mr-2"></div>
          <span>Reserved</span>
        </div>
      )}
    </div>
  );
};
