import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useBooking } from '../context/BookingContext';
import { Passenger } from '../lib/supabase';

export function PassengerData() {
  const navigate = useNavigate();
  const {
    selectedSchedule,
    searchParams,
    selectedClass,
    selectedSeats,
    passengers,
    setPassengers,
    contactInfo,
    setContactInfo,
  } = useBooking();

  const [localPassengers, setLocalPassengers] = useState<Passenger[]>([]);
  const [localContact, setLocalContact] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!selectedSchedule || !searchParams || !selectedClass || selectedSeats.length === 0) {
      navigate('/');
      return;
    }

    if (passengers.length > 0) {
      setLocalPassengers(passengers);
    } else {
      const totalPassengers = searchParams.adults + searchParams.children + searchParams.infants;
      const initialPassengers: Passenger[] = [];

      for (let i = 0; i < searchParams.adults; i++) {
        initialPassengers.push({
          id_type: 'KTP',
          id_number: '',
          full_name: '',
          gender: 'male',
          birth_date: '',
          category: 'adult',
          phone: '',
          email: '',
          seat_number: selectedSeats[i] || '',
        });
      }

      for (let i = 0; i < searchParams.children; i++) {
        initialPassengers.push({
          id_type: 'KTP',
          id_number: '',
          full_name: '',
          gender: 'male',
          birth_date: '',
          category: 'child',
          phone: '',
          email: '',
          seat_number: selectedSeats[searchParams.adults + i] || '',
        });
      }

      for (let i = 0; i < searchParams.infants; i++) {
        initialPassengers.push({
          id_type: 'KTP',
          id_number: '',
          full_name: '',
          gender: 'male',
          birth_date: '',
          category: 'infant',
          phone: '',
          email: '',
          seat_number: selectedSeats[searchParams.adults + searchParams.children + i] || '',
        });
      }

      setLocalPassengers(initialPassengers);
    }

    if (contactInfo) {
      setLocalContact(contactInfo);
    }
  }, []);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...localPassengers];
    updated[index] = { ...updated[index], [field]: value };
    setLocalPassengers(updated);
  };

  const useContactAsFirstPassenger = () => {
    if (!localContact.name || !localContact.email || !localContact.phone) {
      alert('Lengkapi data kontak terlebih dahulu');
      return;
    }

    const updated = [...localPassengers];
    updated[0] = {
      ...updated[0],
      full_name: localContact.name,
      email: localContact.email,
      phone: localContact.phone,
    };
    setLocalPassengers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!localContact.name || !localContact.email || !localContact.phone) {
      alert('Mohon lengkapi data kontak');
      return;
    }

    for (let i = 0; i < localPassengers.length; i++) {
      const p = localPassengers[i];
      if (!p.id_type || !p.id_number || !p.full_name || !p.gender || !p.birth_date) {
        alert(`Mohon lengkapi data penumpang ${i + 1}`);
        return;
      }
    }

    setPassengers(localPassengers);
    setContactInfo(localContact);
    navigate('/payment');
  };

  if (!selectedSchedule || !searchParams) {
    return null;
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'adult':
        return 'Dewasa';
      case 'child':
        return 'Anak';
      case 'infant':
        return 'Bayi';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button onClick={() => navigate('/ship-detail')} className="text-blue-600 hover:text-blue-700 mb-2">
            ← Kembali
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Data Penumpang</h1>
          <p className="text-gray-600 mt-1">Lengkapi data penumpang dan kontak pemesan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kontak Pemesan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                type="text"
                value={localContact.name}
                onChange={(e) => setLocalContact({ ...localContact, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={localContact.email}
                onChange={(e) => setLocalContact({ ...localContact, email: e.target.value })}
                required
              />
              <Input
                label="Nomor Telepon"
                type="tel"
                value={localContact.phone}
                onChange={(e) => setLocalContact({ ...localContact, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
          </Card>

          {localPassengers.map((passenger, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Penumpang {index + 1} - {getCategoryLabel(passenger.category)}
                </h2>
                {index === 0 && (
                  <Button type="button" variant="outline" size="sm" onClick={useContactAsFirstPassenger}>
                    Gunakan Data Pemesan
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Identitas
                  </label>
                  <select
                    value={passenger.id_type}
                    onChange={(e) => handlePassengerChange(index, 'id_type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="KTP">KTP</option>
                    <option value="Passport">Paspor</option>
                    <option value="SIM">SIM</option>
                    <option value="KK">Kartu Keluarga</option>
                  </select>
                </div>

                <Input
                  label="Nomor Identitas"
                  type="text"
                  value={passenger.id_number}
                  onChange={(e) => handlePassengerChange(index, 'id_number', e.target.value)}
                  required
                />

                <Input
                  label="Nama Lengkap"
                  type="text"
                  value={passenger.full_name}
                  onChange={(e) => handlePassengerChange(index, 'full_name', e.target.value)}
                  placeholder="Sesuai identitas"
                  required
                  className="md:col-span-2"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>

                <Input
                  label="Tanggal Lahir"
                  type="date"
                  value={passenger.birth_date}
                  onChange={(e) => handlePassengerChange(index, 'birth_date', e.target.value)}
                  required
                />

                <Input
                  label="Nomor Telepon"
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />

                <Input
                  label="Email"
                  type="email"
                  value={passenger.email}
                  onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                />

                <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Nomor Kursi:</span>{' '}
                    <span className="font-bold text-blue-600">{passenger.seat_number}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/ship-detail')}>
              Kembali
            </Button>
            <Button type="submit" size="lg">
              Lanjut ke Pembayaran
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
