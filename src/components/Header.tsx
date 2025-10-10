import { Link, useLocation } from 'react-router-dom';
import { Ship, Calendar, HelpCircle } from 'lucide-react';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ShipTix</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Ship className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            <Link
              to="/bookings"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/bookings')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Pesanan Saya</span>
            </Link>
            <Link
              to="/help"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/help')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
