import { Ship, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ShipTix</span>
            </div>
            <p className="text-sm">
              Platform pemesanan tiket kapal online terpercaya di Indonesia.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Cari Tiket
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-white transition-colors">
                  Pesanan Saya
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Bantuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kebijakan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kebijakan Pembatalan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>021-12345678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@shiptix.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 ShipTix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
