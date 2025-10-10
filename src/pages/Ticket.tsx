import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Download, Mail, Share2, Ship, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { supabase, Booking } from '../lib/supabase';

export function Ticket() {
  const { bookingCode } = useParams<{ bookingCode: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingCode) {
      loadBooking();
    }
  }, [bookingCode]);

  const loadBooking = async () => {
    if (!bookingCode) return;

    setLoading(true);
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
        .eq('booking_code', bookingCode)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBooking(data as any);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
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
      weekday: 'long',
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

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `E-Ticket ${booking?.booking_code}`,
          text: `Tiket kapal ${booking?.schedule?.ship?.name}`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link disalin ke clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tiket Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">
            Kode booking yang Anda masukkan tidak ditemukan atau tidak valid.
          </p>
          <Link to="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">E-Ticket</h1>
            <p className="text-gray-600">Kode Booking: {booking.booking_code}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </Button>
          </div>
        </div>

        <Card className="p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              {booking.schedule?.ship?.image_url && (
                <img
                  src={booking.schedule.ship.image_url}
                  alt={booking.schedule.ship.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {booking.schedule?.ship?.name}
                </h2>
                <p className="text-gray-600">{booking.schedule?.operator?.name}</p>
              </div>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Keberangkatan</span>
              </div>
              <div className="font-bold text-2xl text-gray-900">
                {formatTime(booking.schedule?.departure_time || '')}
              </div>
              <div className="text-gray-700 font-medium">
                {booking.schedule?.departure_port?.name}
              </div>
              <div className="text-sm text-gray-600">
                {booking.schedule?.departure_port?.city}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {formatDate(booking.schedule?.departure_time || '')}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Tiba</span>
              </div>
              <div className="font-bold text-2xl text-gray-900">
                {formatTime(booking.schedule?.arrival_time || '')}
              </div>
              <div className="text-gray-700 font-medium">
                {booking.schedule?.arrival_port?.name}
              </div>
              <div className="text-sm text-gray-600">
                {booking.schedule?.arrival_port?.city}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {formatDate(booking.schedule?.arrival_time || '')}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Detail Penumpang
            </h3>
            <div className="space-y-3">
              {booking.passengers?.map((passenger, index) => (
                <div key={passenger.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Nama</div>
                      <div className="font-medium text-gray-900">{passenger.full_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Kategori</div>
                      <div className="font-medium text-gray-900 capitalize">
                        {passenger.category}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Nomor Kursi</div>
                      <div className="font-bold text-blue-600 text-lg">{passenger.seat_number}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Kelas</div>
                      <div className="font-medium text-gray-900">{booking.selected_class}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Kontak Pemesan</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Nama:</span>{' '}
                  <span className="text-gray-900 font-medium">{booking.contact_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>{' '}
                  <span className="text-gray-900 font-medium">{booking.contact_email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Telepon:</span>{' '}
                  <span className="text-gray-900 font-medium">{booking.contact_phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Rincian Pembayaran</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiket</span>
                  <span className="text-gray-900">
                    {formatPrice(booking.payment_breakdown.ticket_price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Admin</span>
                  <span className="text-gray-900">
                    {formatPrice(booking.payment_breakdown.admin_fee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Layanan</span>
                  <span className="text-gray-900">
                    {formatPrice(booking.payment_breakdown.service_fee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">{formatPrice(booking.payment_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block mb-3">
                <QRCode value={booking.booking_code} size={200} />
              </div>
              <p className="text-sm text-gray-600">
                Tunjukkan QR Code ini saat check-in
              </p>
              <p className="text-lg font-bold text-gray-900 mt-2">{booking.booking_code}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">Informasi Penting</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Check-in dibuka 2 jam sebelum keberangkatan</li>
            <li>• Harap tiba di pelabuhan minimal 1 jam sebelum keberangkatan</li>
            <li>• Bawa identitas asli sesuai yang terdaftar saat pemesanan</li>
            <li>• Bagasi maksimal 20kg per penumpang</li>
            <li>• Tunjukkan e-ticket atau QR code saat check-in</li>
          </ul>
        </Card>

        <div className="mt-6 text-center print:hidden">
          <Link to="/bookings">
            <Button variant="outline">Lihat Semua Pesanan</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
