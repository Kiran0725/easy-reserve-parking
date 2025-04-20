
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useParkingStore } from '@/lib/store';
import { PaymentMethod } from '@/types';

const reservationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  licensePlate: z.string().min(1, "License plate number is required"),
  paymentMethod: z.enum(["credit_card", "debit_card", "paypal"] as const),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  onSuccess: (ticketId: string) => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess }) => {
  const { createReservation, selectedSpotId } = useParkingStore();

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      licensePlate: '',
      paymentMethod: 'credit_card' as PaymentMethod,
    },
  });

  const onSubmit = (data: ReservationFormValues) => {
    try {
      // In a real app, you would process payment here
      // For demo purposes, we'll just create the reservation
      const ticketId = createReservation({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        licensePlate: data.licensePlate,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'completed', // Simulating successful payment
        parkingSpotId: selectedSpotId as string,
      });
      
      onSuccess(ticketId);
    } catch (error) {
      console.error('Reservation failed:', error);
    }
  };

  if (!selectedSpotId) {
    return <div className="text-center my-8">Please select a parking spot first</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Reserve Your Spot</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate Number</FormLabel>
                <FormControl>
                  <Input placeholder="ABC123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="credit_card" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Credit Card
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="debit_card" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Debit Card
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="paypal" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        PayPal
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            Pay & Reserve
          </Button>
        </form>
      </Form>
    </div>
  );
};
