import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRightLeft, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase, Port } from '../lib/supabase';
import { useBooking } from '../context/BookingContext';

export function Home() {
  const navigate = useNavigate();
  const { setSearchParams } = useBooking();
  const [ports, setPorts] = useState<Port[]>([]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const [formData, setFormData] = useState({
    departurePort: '',
    arrivalPort: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
  });

  useEffect(() => {
    loadPorts();
  }, []);

  const loadPorts = async () => {
    const { data } = await supabase
      .from('ports')
      .select('*')
      .order('city');
    if (data) setPorts(data);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.departurePort || !formData.arrivalPort || !formData.departureDate) {
      alert('Mohon lengkapi data pencarian');
      return;
    }

    if (formData.departurePort === formData.arrivalPort) {
      alert('Pelabuhan keberangkatan dan tujuan tidak boleh sama');
      return;
    }

    setSearchParams({
      ...formData,
      isRoundTrip,
    });

    navigate('/search');
  };

  const swapPorts = () => {
    setFormData({
      ...formData,
      departurePort: formData.arrivalPort,
      arrivalPort: formData.departurePort,
    });
  };

  const totalPassengers = formData.adults + formData.children + formData.infants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/80"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pesan Tiket Kapal Dengan Mudah
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Jelajahi Indonesia dengan perjalanan laut yang nyaman dan aman
          </p>

          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isRoundTrip}
                  onChange={() => setIsRoundTrip(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 font-medium">Sekali Jalan</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isRoundTrip}
                  onChange={() => setIsRoundTrip(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 font-medium">Pulang Pergi</span>
              </label>
            </div>

            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dari
                  </label>
                  <select
                    value={formData.departurePort}
                    onChange={(e) => setFormData({ ...formData, departurePort: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih pelabuhan</option>
                    {ports.map((port) => (
                      <option key={port.id} value={port.id}>
                        {port.city} - {port.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ke
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={formData.arrivalPort}
                      onChange={(e) => setFormData({ ...formData, arrivalPort: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Pilih pelabuhan</option>
                      {ports.map((port) => (
                        <option key={port.id} value={port.id}>
                          {port.city} - {port.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={swapPorts}
                      className="absolute right-2 top-11 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <ArrowRightLeft className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Berangkat
                  </label>
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {isRoundTrip && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Pulang
                    </label>
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      min={formData.departureDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={isRoundTrip}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penumpang
                  </label>
                  <div className="relative">
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span>{totalPassengers} Penumpang</span>
                      </div>
                    </div>
                    <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Dewasa</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{formData.adults}</span>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, adults: formData.adults + 1 })}
                              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Anak (2-11 th)</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{formData.children}</span>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, children: formData.children + 1 })}
                              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Bayi (0-2 th)</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, infants: Math.max(0, formData.infants - 1) })}
                              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{formData.infants}</span>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, infants: formData.infants + 1 })}
                              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">
                <Search className="w-5 h-5 mr-2" />
                Cari Tiket
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Rute Populer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ports.slice(0, 6).map((port, idx) => (
            <div
              key={port.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {port.city}
              </h3>
              <p className="text-sm text-gray-600">{port.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Rute Tersedia</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Operator Kapal</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Penumpang Puas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
