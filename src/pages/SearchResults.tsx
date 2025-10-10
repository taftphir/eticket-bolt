import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, Clock, MapPin, Users, Filter } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { supabase, Schedule } from '../lib/supabase';
import { useBooking } from '../context/BookingContext';

export function SearchResults() {
  const navigate = useNavigate();
  const { searchParams, setSelectedSchedule } = useBooking();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'duration'>('time');
  const [filterClass, setFilterClass] = useState<string>('');

  useEffect(() => {
    if (!searchParams) {
      navigate('/');
      return;
    }
    loadSchedules();
  }, [searchParams]);

  const loadSchedules = async () => {
    if (!searchParams) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          *,
          ship:ships(*, operator:operators(*)),
          departure_port:ports!schedules_departure_port_id_fkey(*),
          arrival_port:ports!schedules_arrival_port_id_fkey(*)
        `)
        .eq('departure_port_id', searchParams.departurePort)
        .eq('arrival_port_id', searchParams.arrivalPort)
        .gte('departure_time', `${searchParams.departureDate}T00:00:00`)
        .lte('departure_time', `${searchParams.departureDate}T23:59:59`)
        .eq('status', 'scheduled');

      if (error) throw error;

      if (data) {
        const formattedData = data.map((schedule: any) => ({
          ...schedule,
          ship: schedule.ship,
          operator: schedule.ship?.operator,
          departure_port: schedule.departure_port,
          arrival_port: schedule.arrival_port,
        }));
        setSchedules(formattedData);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSortedSchedules = () => {
    let sorted = [...schedules];

    if (sortBy === 'price') {
      sorted.sort((a, b) => {
        const priceA = Math.min(...a.classes.map((c) => c.price));
        const priceB = Math.min(...b.classes.map((c) => c.price));
        return priceA - priceB;
      });
    } else if (sortBy === 'time') {
      sorted.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());
    } else if (sortBy === 'duration') {
      sorted.sort((a, b) => a.duration_minutes - b.duration_minutes);
    }

    if (filterClass) {
      sorted = sorted.filter((s) => s.classes.some((c) => c.class === filterClass));
    }

    return sorted;
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    navigate('/ship-detail');
  };

  if (!searchParams) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hasil Pencarian Tiket Kapal
          </h1>
          <p className="text-gray-600">
            {schedules[0]?.departure_port?.city} → {schedules[0]?.arrival_port?.city} •{' '}
            {formatDate(searchParams.departureDate)} • {searchParams.adults + searchParams.children + searchParams.infants} Penumpang
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter & Urutkan
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urutkan
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="time">Waktu Keberangkatan</option>
                    <option value="price">Harga Termurah</option>
                    <option value="duration">Durasi Tercepat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kelas
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="class"
                        value=""
                        checked={filterClass === ''}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Semua Kelas</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="class"
                        value="Ekonomi"
                        checked={filterClass === 'Ekonomi'}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Ekonomi</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="class"
                        value="Bisnis"
                        checked={filterClass === 'Bisnis'}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Bisnis</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="class"
                        value="VIP"
                        checked={filterClass === 'VIP'}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">VIP</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Mencari jadwal tersedia...</p>
              </div>
            ) : schedules.length === 0 ? (
              <Card className="p-12 text-center">
                <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak Ada Jadwal Tersedia
                </h3>
                <p className="text-gray-600 mb-4">
                  Maaf, tidak ada jadwal kapal untuk rute dan tanggal yang Anda pilih.
                </p>
                <Button onClick={() => navigate('/')}>Cari Rute Lain</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {getSortedSchedules().map((schedule) => (
                  <Card key={schedule.id} className="p-6 hover" hover>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          {schedule.ship?.image_url && (
                            <img
                              src={schedule.ship.image_url}
                              alt={schedule.ship.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {schedule.ship?.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {schedule.operator?.name}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatTime(schedule.departure_time)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {schedule.departure_port?.city}
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center">
                            <div className="text-sm text-gray-600 mb-1">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {formatDuration(schedule.duration_minutes)}
                            </div>
                            <div className="w-full h-px bg-gray-300 relative">
                              <Ship className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatTime(schedule.arrival_time)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {schedule.arrival_port?.city}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {schedule.ship?.facilities?.slice(0, 4).map((facility) => (
                            <Badge key={facility} variant="info">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="md:w-48 flex flex-col justify-between items-end">
                        <div className="text-right mb-4">
                          <div className="text-sm text-gray-600 mb-1">Mulai dari</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatPrice(Math.min(...schedule.classes.map((c) => c.price)))}
                          </div>
                          <div className="text-xs text-gray-500">per penumpang</div>
                        </div>

                        <div className="space-y-2 w-full">
                          {schedule.classes.map((classInfo) => (
                            <div
                              key={classInfo.class}
                              className="text-sm text-gray-600 flex justify-between"
                            >
                              <span>{classInfo.class}</span>
                              <span className="text-gray-900">
                                {classInfo.available_seats} kursi
                              </span>
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => handleSelectSchedule(schedule)}
                          className="w-full mt-4"
                        >
                          Pilih
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
