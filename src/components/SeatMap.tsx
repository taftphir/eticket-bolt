import { useState } from 'react';

interface SeatMapProps {
  totalSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  maxSeats: number;
}

export function SeatMap({ totalSeats, selectedSeats, onSeatSelect, maxSeats }: SeatMapProps) {
  const rows = Math.ceil(totalSeats / 4);
  const [occupiedSeats] = useState<string[]>(
    Array.from({ length: Math.floor(totalSeats * 0.3) }, () => {
      const row = Math.floor(Math.random() * rows) + 1;
      const col = String.fromCharCode(65 + Math.floor(Math.random() * 4));
      return `${row}${col}`;
    })
  );

  const handleSeatClick = (seatNumber: string) => {
    if (occupiedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      onSeatSelect(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length < maxSeats) {
        onSeatSelect([...selectedSeats, seatNumber]);
      } else {
        alert(`Maksimal ${maxSeats} kursi`);
      }
    }
  };

  const getSeatStatus = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) return 'selected';
    if (occupiedSeats.includes(seatNumber)) return 'occupied';
    return 'available';
  };

  const seatStyles = {
    available: 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800 cursor-pointer',
    selected: 'bg-blue-500 border-blue-600 text-white',
    occupied: 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed',
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded border-2 bg-green-100 border-green-300"></div>
            <span>Tersedia</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded border-2 bg-blue-500 border-blue-600"></div>
            <span>Dipilih</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded border-2 bg-gray-300 border-gray-400"></div>
            <span>Terisi</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="text-center mb-4 text-sm font-medium text-gray-600">
          DEPAN KAPAL
        </div>

        <div className="space-y-2">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center items-center space-x-2">
              <span className="w-8 text-sm text-gray-600 text-right">
                {rowIndex + 1}
              </span>

              {['A', 'B'].map((col) => {
                const seatNumber = `${rowIndex + 1}${col}`;
                const status = getSeatStatus(seatNumber);
                return (
                  <button
                    key={seatNumber}
                    type="button"
                    onClick={() => handleSeatClick(seatNumber)}
                    disabled={status === 'occupied'}
                    className={`w-10 h-10 rounded border-2 text-xs font-medium transition-all ${seatStyles[status]}`}
                  >
                    {seatNumber}
                  </button>
                );
              })}

              <div className="w-8"></div>

              {['C', 'D'].map((col) => {
                const seatNumber = `${rowIndex + 1}${col}`;
                const status = getSeatStatus(seatNumber);
                return (
                  <button
                    key={seatNumber}
                    type="button"
                    onClick={() => handleSeatClick(seatNumber)}
                    disabled={status === 'occupied'}
                    className={`w-10 h-10 rounded border-2 text-xs font-medium transition-all ${seatStyles[status]}`}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Kursi Dipilih ({selectedSeats.length}/{maxSeats}):
          </p>
          <p className="text-blue-600 font-semibold">
            {selectedSeats.sort().join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
