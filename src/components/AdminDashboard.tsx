
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParkingGrid } from '@/components/ParkingGrid';
import { NotificationSystem } from '@/components/NotificationSystem';
import { useParkingStore } from '@/lib/store';

export const AdminDashboard: React.FC = () => {
  const { reservations, parkingLayout } = useParkingStore();
  const [activeTab, setActiveTab] = useState('layout');
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  
  // Calculate statistics
  const totalSpots = parkingLayout.flat().length;
  const availableSpots = parkingLayout.flat().filter(spot => spot.isAvailable).length;
  const reservedSpots = reservations.filter(res => !res.endTime).length;
  
  const handleExpandReservation = (id: string) => {
    if (expandedReservation === id) {
      setExpandedReservation(null);
    } else {
      setExpandedReservation(id);
    }
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">ParkEase Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Parking Spots</CardTitle>
            <CardDescription>Total spots in the parking lot</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalSpots}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Available For Booking</CardTitle>
            <CardDescription>Spots allocated for online reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{availableSpots}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Reservations</CardTitle>
            <CardDescription>Currently occupied reserved spots</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{reservedSpots}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="layout">Parking Layout</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Configure Available Parking Spots</h2>
            <p className="mb-6 text-gray-600">
              Click on parking spots to toggle their availability for online reservations this week.
              Grey spots will not be available for booking.
            </p>
            <ParkingGrid isAdmin={true} />
          </div>
        </TabsContent>
        
        <TabsContent value="reservations">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Current Reservations</h2>
            
            {reservations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reservations yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Ticket ID</th>
                      <th className="p-2 text-left">Spot</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">License</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Created</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <React.Fragment key={res.id}>
                        <tr className="border-t">
                          <td className="p-2 font-mono">{res.ticketId}</td>
                          <td className="p-2">{res.parkingSpotId.replace('spot-', '')}</td>
                          <td className="p-2">{res.fullName}</td>
                          <td className="p-2">{res.licensePlate}</td>
                          <td className="p-2">
                            {res.startTime 
                              ? res.endTime 
                                ? "Completed" 
                                : "Active" 
                              : "Not Started"}
                          </td>
                          <td className="p-2">{new Date(res.createdAt).toLocaleString()}</td>
                          <td className="p-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                if (res.startTime && !res.endTime) {
                                  handleExpandReservation(res.id);
                                }
                              }}
                              disabled={!res.startTime || !!res.endTime}
                            >
                              {res.startTime && !res.endTime ? (expandedReservation === res.id ? "Hide" : "Manage") : "-"}
                            </Button>
                          </td>
                        </tr>
                        {expandedReservation === res.id && (
                          <tr>
                            <td colSpan={7} className="p-4 bg-gray-50">
                              <NotificationSystem reservation={res} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
