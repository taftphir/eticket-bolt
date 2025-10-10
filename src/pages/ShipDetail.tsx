import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, Clock, MapPin, Users, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SeatMap } from '../components/SeatMap';
import { useBooking } from '../context/BookingContext';

export function ShipDetail() {
  const navigate = useNavigate();
  const { selectedSchedule, searchParams, selectedClass, setSelectedClass, selectedSeats, setSelectedSeats } =
    useBooking();
  const [step, setStep] = useState<'class' | 'seats'>('class');

  useEffect(() => {
    if (!selectedSchedule || !searchParams) {
      navigate('/');
    }
  }, [selectedSchedule, searchParams]);

  if (!selectedSchedule || !searchParams) {
    return null;
  }

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} jam ${mins} menit`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPassengers = searchParams.adults + searchParams.children + searchParams.infants;

  const selectedClassInfo = selectedSchedule.classes.find((c) => c.class === selectedClass);

  const handleClassSelect = (classType: string) => {
    setSelectedClass(classType);
    setSelectedSeats([]);
    setStep('seats');
  };

  const handleContinue = () => {
    if (selectedSeats.length !== totalPassengers) {
      alert(`Pilih ${totalPassengers} kursi untuk ${totalPassengers} penumpang`);
      return;
    }
    navigate('/passenger-data');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button onClick={() => navigate('/search')} className="text-blue-600 hover:text-blue-700 mb-2">
            ← Kembali ke hasil pencarian
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Detail Kapal</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <img
                src={selectedSchedule.ship?.image_url || ''}
                alt={selectedSchedule.ship?.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedSchedule.ship?.name}
                </h2>
                <p className="text-gray-600">{selectedSchedule.operator?.name}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Kapasitas</div>
                  <div className="font-semibold text-gray-900">
                    {selectedSchedule.ship?.capacity} orang
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Tahun</div>
                  <div className="font-semibold text-gray-900">
                    {selectedSchedule.ship?.year_built}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Panjang</div>
                  <div className="font-semibold text-gray-900">
                    {selectedSchedule.ship?.length_meters}m
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <Badge variant="success">Beroperasi</Badge>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Fasilitas Kapal</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedSchedule.ship?.facilities?.map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Jadwal Perjalanan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(selectedSchedule.departure_time)}
                    </div>
                    <div className="text-gray-600">
                      {selectedSchedule.departure_port?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedSchedule.departure_time)}
                    </div>
                  </div>

                  <div className="text-center px-4">
                    <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">
                      {formatDuration(selectedSchedule.duration_minutes)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(selectedSchedule.arrival_time)}
                    </div>
                    <div className="text-gray-600">
                      {selectedSchedule.arrival_port?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedSchedule.arrival_time)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {step === 'class' && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Pilih Kelas
                </h3>
                <div className="space-y-3">
                  {selectedSchedule.classes.map((classInfo) => (
                    <button
                      key={classInfo.class}
                      onClick={() => handleClassSelect(classInfo.class)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedClass === classInfo.class
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">
                            {classInfo.class}
                          </div>
                          <div className="text-sm text-gray-600">
                            {classInfo.available_seats} kursi tersedia
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            {formatPrice(classInfo.price)}
                          </div>
                          <div className="text-xs text-gray-500">per orang</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {step === 'seats' && selectedClass && selectedClassInfo && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Pilih Kursi - Kelas {selectedClass}
                  </h3>
                  <button
                    onClick={() => {
                      setStep('class');
                      setSelectedClass(null);
                      setSelectedSeats([]);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Ubah Kelas
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Pilih {totalPassengers} kursi untuk {totalPassengers} penumpang
                </p>
                <SeatMap
                  totalSeats={selectedClassInfo.available_seats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={setSelectedSeats}
                  maxSeats={totalPassengers}
                />
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>

                <div className="space-y-3 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Rute</div>
                    <div className="font-medium text-gray-900">
                      {selectedSchedule.departure_port?.city} →{' '}
                      {selectedSchedule.arrival_port?.city}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Tanggal</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedSchedule.departure_time)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Penumpang</div>
                    <div className="font-medium text-gray-900">
                      {totalPassengers} orang
                    </div>
                  </div>

                  {selectedClass && (
                    <div>
                      <div className="text-sm text-gray-600">Kelas</div>
                      <div className="font-medium text-gray-900">{selectedClass}</div>
                    </div>
                  )}

                  {selectedSeats.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600">Kursi</div>
                      <div className="font-medium text-gray-900">
                        {selectedSeats.sort().join(', ')}
                      </div>
                    </div>
                  )}
                </div>

                {selectedClass && selectedClassInfo && (
                  <div className="border-t pt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Tiket ({totalPassengers}x)
                        </span>
                        <span className="text-gray-900">
                          {formatPrice(selectedClassInfo.price * totalPassengers)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Biaya Admin</span>
                        <span className="text-gray-900">
                          {formatPrice(5000 * totalPassengers)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Biaya Layanan</span>
                        <span className="text-gray-900">
                          {formatPrice(10000 * totalPassengers)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(
                          (selectedClassInfo.price + 15000) * totalPassengers
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleContinue}
                  disabled={!selectedClass || selectedSeats.length !== totalPassengers}
                  className="w-full mt-6"
                  size="lg"
                >
                  Lanjutkan
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
