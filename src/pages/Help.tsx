import { HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export function Help() {
  const faqs = [
    {
      question: 'Bagaimana cara memesan tiket?',
      answer:
        'Pilih rute dan tanggal keberangkatan di halaman utama, pilih jadwal yang tersedia, pilih kelas dan kursi, isi data penumpang, lalu lakukan pembayaran.',
    },
    {
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer:
        'Kami menerima pembayaran melalui Virtual Account (BCA, Mandiri, BNI), E-Wallet (GoPay, OVO, DANA), QRIS, dan gerai retail (Alfamart, Indomaret).',
    },
    {
      question: 'Berapa lama batas waktu pembayaran?',
      answer:
        'Setelah melakukan pemesanan, Anda memiliki waktu 15 menit untuk menyelesaikan pembayaran. Setelah itu, pesanan akan dibatalkan otomatis.',
    },
    {
      question: 'Bagaimana cara check-in?',
      answer:
        'Datang ke pelabuhan minimal 1 jam sebelum keberangkatan, tunjukkan e-ticket atau scan QR code yang ada di e-ticket Anda, dan tunjukkan identitas asli.',
    },
    {
      question: 'Apakah bisa membatalkan pesanan?',
      answer:
        'Ya, pembatalan dapat dilakukan maksimal 24 jam sebelum keberangkatan. Biaya pembatalan dan refund akan disesuaikan dengan kebijakan operator kapal.',
    },
    {
      question: 'Berapa bagasi yang diperbolehkan?',
      answer:
        'Setiap penumpang dapat membawa bagasi maksimal 20kg. Bagasi berlebih akan dikenakan biaya tambahan sesuai ketentuan operator kapal.',
    },
    {
      question: 'Apa yang harus dibawa saat keberangkatan?',
      answer:
        'Bawa e-ticket (cetak atau digital), identitas asli sesuai yang didaftarkan saat pemesanan (KTP/Paspor/SIM), dan datang minimal 1 jam sebelum keberangkatan.',
    },
    {
      question: 'Bagaimana jika jadwal kapal berubah?',
      answer:
        'Kami akan mengirimkan notifikasi via email dan SMS jika terjadi perubahan jadwal. Anda dapat mengubah jadwal atau membatalkan pesanan tanpa biaya tambahan.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pusat Bantuan</h1>
          <p className="text-gray-600">
            Temukan jawaban untuk pertanyaan Anda atau hubungi tim kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover" hover>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Telepon</h3>
            <p className="text-sm text-gray-600 mb-4">
              Senin - Jumat, 08:00 - 20:00 WIB
            </p>
            <a href="tel:02112345678" className="text-blue-600 font-medium">
              021-12345678
            </a>
          </Card>

          <Card className="p-6 text-center hover" hover>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600 mb-4">
              Respon dalam 1x24 jam
            </p>
            <a href="mailto:support@shiptix.com" className="text-blue-600 font-medium">
              support@shiptix.com
            </a>
          </Card>

          <Card className="p-6 text-center hover" hover>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-sm text-gray-600 mb-4">
              Chat dengan tim kami
            </p>
            <a href="https://wa.me/628123456789" className="text-blue-600 font-medium">
              0812-3456-789
            </a>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2" />
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 mt-8 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tidak menemukan jawaban?
            </h3>
            <p className="text-gray-600 mb-6">
              Tim customer service kami siap membantu Anda
            </p>
            <div className="flex justify-center space-x-4">
              <Button>Hubungi Kami</Button>
              <Button variant="outline">Kirim Email</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
