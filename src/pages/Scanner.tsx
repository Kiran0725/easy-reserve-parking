
import React from 'react';
import { TicketScanner } from '@/components/TicketScanner';
import { TicketStatus } from '@/components/TicketStatus';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Scanner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8">Parking Ticket Scanner</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <p className="text-center text-gray-600 mb-6">
              Use this scanner to start or end your parking session
            </p>
            <TicketScanner />
          </div>
          
          <div>
            <p className="text-center text-gray-600 mb-6">
              Check the status of your parking reservation
            </p>
            <TicketStatus />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Scanner;
