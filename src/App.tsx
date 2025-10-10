import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { ShipDetail } from './pages/ShipDetail';
import { PassengerData } from './pages/PassengerData';
import { Payment } from './pages/Payment';
import { Ticket } from './pages/Ticket';
import { MyBookings } from './pages/MyBookings';
import { Help } from './pages/Help';

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/ship-detail" element={<ShipDetail />} />
              <Route path="/passenger-data" element={<PassengerData />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/ticket/:bookingCode" element={<Ticket />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BookingProvider>
    </BrowserRouter>
  );
}

export default App;
