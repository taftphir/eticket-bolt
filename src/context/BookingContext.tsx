import { createContext, useContext, useState, ReactNode } from 'react';
import { Schedule, Passenger } from '../lib/supabase';

type SearchParams = {
  departurePort: string;
  arrivalPort: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  isRoundTrip: boolean;
};

type BookingContextType = {
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams) => void;
  selectedSchedule: Schedule | null;
  setSelectedSchedule: (schedule: Schedule | null) => void;
  selectedClass: string | null;
  setSelectedClass: (classType: string | null) => void;
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  passengers: Passenger[];
  setPassengers: (passengers: Passenger[]) => void;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  } | null;
  setContactInfo: (info: { name: string; email: string; phone: string } | null) => void;
  clearBooking: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [contactInfo, setContactInfo] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  const clearBooking = () => {
    setSearchParams(null);
    setSelectedSchedule(null);
    setSelectedClass(null);
    setSelectedSeats([]);
    setPassengers([]);
    setContactInfo(null);
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        selectedSchedule,
        setSelectedSchedule,
        selectedClass,
        setSelectedClass,
        selectedSeats,
        setSelectedSeats,
        passengers,
        setPassengers,
        contactInfo,
        setContactInfo,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
