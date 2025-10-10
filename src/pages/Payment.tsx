import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Building2, Smartphone, QrCode, Store } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useBooking } from '../context/BookingContext';
import { supabase } from '../lib/supabase';

export function Payment() {
  const navigate = useNavigate();
  const {
    selectedSchedule,
    searchParams,
    selectedClass,
    selectedSeats,
    passengers,
    contactInfo,
    clearBooking,
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !selectedSchedule ||
      !searchParams ||
      !selectedClass ||
      selectedSeats.length === 0 ||
      passengers.length === 0 ||
      !contactInfo
    ) {
      navigate('/');
    }
  }, []);

  if (!selectedSchedule || !searchParams || !contactInfo) {
    return null;
  }

  const selectedClassInfo = selectedSchedule.classes.find((c) => c.class === selectedClass);
  if (!selectedClassInfo) return null;

  const totalPassengers = searchParams.adults + searchParams.children + searchParams.infants;
  const ticketPrice = selectedClassInfo.price * totalPassengers;
  const adminFee = 5000 * totalPassengers;
  const serviceFee = 10000 * totalPassengers;
  const totalAmount = ticketPrice + adminFee + serviceFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Pilih metode pembayaran');
      return;
    }

    setLoading(true);
    try {
      const paymentExpiredAt = new Date();
      paymentExpiredAt.setMinutes(paymentExpiredAt.getMinutes() + 15);

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_code: await generateBookingCode(),
          schedule_id: selectedSchedule.id,
          status: 'pending_payment',
          total_passengers: totalPassengers,
          selected_class: selectedClass!,
          contact_name: contactInfo.name,
          contact_email: contactInfo.email,
          contact_phone: contactInfo.phone,
          payment_method: paymentMethod,
          payment_amount: totalAmount,
          payment_breakdown: {
            ticket_price: ticketPrice,
            admin_fee: adminFee,
            service_fee: serviceFee,
          },
          payment_status: 'pending',
          payment_expired_at: paymentExpiredAt.toISOString(),
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      const passengersWithBookingId = passengers.map((p) => ({
        ...p,
        booking_id: bookingData.id,
      }));

      const { error: passengersError } = await supabase
        .from('passengers')
        .insert(passengersWithBookingId);

      if (passengersError) throw passengersError;

      clearBooking();
      navigate(`/ticket/${bookingData.booking_code}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Terjadi kesalahan saat membuat pemesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const generateBookingCode = async (): Promise<string> => {
    const { data } = await supabase.rpc('generate_booking_code');
    return data || `SHIP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  const paymentMethods = [
    {
      id: 'bca_va',
      name: 'BCA Virtual Account',
      icon: Building2,
      description: 'Transfer ke Virtual Account BCA',
    },
    {
      id: 'mandiri_va',
      name: 'Mandiri Virtual Account',
      icon: Building2,
      description: 'Transfer ke Virtual Account Mandiri',
    },
    {
      id: 'bni_va',
      name: 'BNI Virtual Account',
      icon: Building2,
      description: 'Transfer ke Virtual Account BNI',
    },
    {
      id: 'gopay',
      name: 'GoPay',
      icon: Smartphone,
      description: 'Bayar dengan GoPay',
    },
    {
      id: 'ovo',
      name: 'OVO',
      icon: Smartphone,
      description: 'Bayar dengan OVO',
    },
    {
      id: 'dana',
      name: 'DANA',
      icon: Smartphone,
      description: 'Bayar dengan DANA',
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: QrCode,
      description: 'Scan QR untuk membayar',
    },
    {
      id: 'alfamart',
      name: 'Alfamart',
      icon: Store,
      description: 'Bayar di Alfamart terdekat',
    },
    {
      id: 'indomaret',
      name: 'Indomaret',
      icon: Store,
      description: 'Bayar di Indomaret terdekat',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button onClick={() => navigate('/passenger-data')} className="text-blue-600 hover:text-blue-700 mb-2">
            ← Kembali
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pilih Metode Pembayaran</h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Pemesanan</h3>

                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div>
                    <div className="text-sm text-gray-600">Kapal</div>
                    <div className="font-medium text-gray-900">{selectedSchedule.ship?.name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Rute</div>
                    <div className="font-medium text-gray-900">
                      {selectedSchedule.departure_port?.city} →{' '}
                      {selectedSchedule.arrival_port?.city}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Keberangkatan</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedSchedule.departure_time)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(selectedSchedule.departure_time)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Kelas</div>
                    <div className="font-medium text-gray-900">{selectedClass}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Penumpang</div>
                    <div className="font-medium text-gray-900">{totalPassengers} orang</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Kursi</div>
                    <div className="font-medium text-gray-900">
                      {selectedSeats.sort().join(', ')}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tiket ({totalPassengers}x)</span>
                    <span className="text-gray-900">{formatPrice(ticketPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span className="text-gray-900">{formatPrice(adminFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Layanan</span>
                    <span className="text-gray-900">{formatPrice(serviceFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-gray-900">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={!paymentMethod || loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Memproses...' : 'Bayar Sekarang'}
                </Button>

                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    Selesaikan pembayaran dalam 15 menit setelah pemesanan dibuat
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
