import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Ship } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { supabase, Booking } from '../lib/supabase';

export function MyBookings() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery || !email) {
      alert('Masukkan kode booking dan email');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          schedule:schedules(
            *,
            ship:ships(*, operator:operators(*)),
            departure_port:ports!schedules_departure_port_id_fkey(*),
            arrival_port:ports!schedules_arrival_port_id_fkey(*)
          ),
          passengers(*)
        `)
        .or(`booking_code.ilike.%${searchQuery}%,contact_name.ilike.%${searchQuery}%`)
        .eq('contact_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookings((data as any) || []);
    } catch (error) {
      console.error('Error searching bookings:', error);
      alert('Terjadi kesalahan saat mencari pesanan');
    } finally {
      setLoading(false);
    }
  };

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
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { variant: 'success' | 'warning' | 'error' | 'info'; label: string } } = {
      pending_payment: { variant: 'warning', label: 'Menunggu Pembayaran' },
      paid: { variant: 'success', label: 'Lunas' },
      confirmed: { variant: 'success', label: 'Terkonfirmasi' },
      boarding: { variant: 'info', label: 'Boarding' },
      completed: { variant: 'success', label: 'Selesai' },
      cancelled: { variant: 'error', label: 'Dibatalkan' },
    };

    const statusInfo = statusMap[status] || { variant: 'default' as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Saya</h1>
          <p className="text-gray-600">
            Cari pesanan Anda dengan kode booking dan email
          </p>
        </div>

        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Kode Booking atau Nama"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SHIP-XXXXXX atau Nama Pemesan"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Mencari...' : 'Cari Pesanan'}
            </Button>
          </form>
        </Card>

        {searched && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Mencari pesanan...</p>
              </div>
            ) : bookings.length === 0 ? (
              <Card className="p-12 text-center">
                <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak Ada Pesanan
                </h3>
                <p className="text-gray-600 mb-4">
                  Tidak ada pesanan ditemukan dengan kode booking dan email tersebut.
                </p>
                <Button onClick={() => navigate('/')}>Pesan Tiket Baru</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Ditemukan {bookings.length} pesanan
                </h2>

                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-6 hover" hover>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-bold text-lg text-gray-900">
                              {booking.booking_code}
                            </div>
                            <div className="text-sm text-gray-600">
                              Dibuat: {formatDate(booking.created_at)}
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="mb-4">
                          <div className="font-semibold text-gray-900 mb-1">
                            {booking.schedule?.ship?.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.schedule?.operator?.name}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600">Keberangkatan</div>
                            <div className="font-medium text-gray-900">
                              {booking.schedule?.departure_port?.city}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(booking.schedule?.departure_time || '')} •{' '}
                              {formatTime(booking.schedule?.departure_time || '')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Tujuan</div>
                            <div className="font-medium text-gray-900">
                              {booking.schedule?.arrival_port?.city}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(booking.schedule?.arrival_time || '')} •{' '}
                              {formatTime(booking.schedule?.arrival_time || '')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Kelas: {booking.selected_class}</span>
                          <span>•</span>
                          <span>{booking.total_passengers} Penumpang</span>
                        </div>
                      </div>

                      <div className="md:w-48 flex flex-col justify-between items-end">
                        <div className="text-right mb-4">
                          <div className="text-sm text-gray-600 mb-1">Total</div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatPrice(booking.payment_amount)}
                          </div>
                        </div>

                        <div className="space-y-2 w-full">
                          <Button
                            onClick={() => navigate(`/ticket/${booking.booking_code}`)}
                            className="w-full"
                          >
                            Lihat Detail
                          </Button>

                          {booking.status === 'pending_payment' && (
                            <Button variant="secondary" className="w-full">
                              Bayar Sekarang
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {!searched && (
          <Card className="p-12 text-center">
            <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cari Pesanan Anda
            </h3>
            <p className="text-gray-600">
              Masukkan kode booking dan email untuk melihat detail pesanan
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
