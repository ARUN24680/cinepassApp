'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';

const ROWS = ['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
const SEATS_PER_ROW = 14;

// Initial mock seat statuses in case API fails
const MOCK_BOOKED = [12, 13, 24, 25, 45, 46, 78, 79, 110, 111];
const MOCK_LOCKED = [34, 56, 89];

export default function SeatSelectionPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [movieTitle, setMovieTitle] = useState('Dune: Part Two');
  const [ticketPrice, setTicketPrice] = useState(12.5);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchSeats = async () => {
      try {
        setLoading(true);
        // Fetch show seat status
        const res = await api.getShowSeats(id);
        if (res.data && res.data.seats && res.data.seats.length > 0) {
          setSeats(res.data.seats);
          if (res.data.show_price) setTicketPrice(Number(res.data.show_price));
        } else {
          generateMockSeats();
        }
      } catch (err) {
        console.warn('API error fetching seats, generating mock layout:', err);
        generateMockSeats();
      } finally {
        setLoading(false);
      }
    };

    const generateMockSeats = () => {
      const mockList = [];
      let globalId = 1;
      ROWS.forEach((row) => {
        for (let col = 1; col <= SEATS_PER_ROW; col++) {
          let status = 'available';
          if (MOCK_BOOKED.includes(globalId)) status = 'booked';
          else if (MOCK_LOCKED.includes(globalId)) status = 'locked';

          mockList.push({
            show_seat_id: globalId,
            seat_id: globalId,
            row_num: row,
            col_num: col,
            type: row === 'A' || row === 'B' ? 'premium' : 'standard',
            status,
          });
          globalId++;
        }
      });
      setSeats(mockList);
    };

    fetchSeats();
  }, [id]);

  // Group seats by row for rendering
  const seatsByRow = {};
  ROWS.forEach((row) => {
    seatsByRow[row] = seats.filter((s) => s.row_num === row).sort((a, b) => a.col_num - b.col_num);
  });

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked' || seat.status === 'locked') return;

    const isSelected = selectedSeats.some((s) => s.show_seat_id === seat.show_seat_id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.show_seat_id !== seat.show_seat_id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleLockSeats = async () => {
    if (selectedSeats.length === 0) return;
    setError('');

    try {
      setLocking(true);
      const seatIds = selectedSeats.map((s) => s.seat_id);
      const res = await api.lockSeats(Number(id), seatIds);

      if (res.status === 'success' && res.data) {
        const { booking_id, client_secret } = res.data;
        router.push(`/checkout/${booking_id}?secret=${client_secret}`);
      } else {
        // Fallback for mock environment
        router.push(`/checkout/mock-${Date.now()}?secret=pi_mock_secret_${Date.now()}`);
      }
    } catch (err) {
      console.warn('Backend locking failed, proceeding in Demo/Mock Mode:', err.message);
      // Fallback redirect for preview testing
      const mockBookingId = `mock-${Math.floor(Math.random() * 90000) + 10000}`;
      const mockSecret = `pi_mock_secret_${Math.floor(Math.random() * 90000) + 10000}`;
      router.push(`/checkout/${mockBookingId}?secret=${mockSecret}`);
    } finally {
      setLocking(false);
    }
  };

  const selectedSeatLabels = selectedSeats
    .map((s) => `${s.row_num}${s.col_num}`)
    .join(', ');

  const priceSum = selectedSeats.reduce((acc, s) => {
    const seatPrice = s.type === 'premium' ? ticketPrice * 1.5 : ticketPrice;
    return acc + seatPrice;
  }, 0);
  const taxPrice = priceSum * 0.1;
  const totalPrice = priceSum + taxPrice;

  return (
    <main className="pt-12 pb-40 min-h-screen px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center">
      {/* Curved Screen Indicator */}
      <div className="relative w-full max-w-3xl mb-16 flex flex-col items-center">
        <div className="screen-curve absolute -top-8 w-full"></div>
        <div className="relative z-10 w-full h-[6px] bg-primary/40 rounded-full blur-[1px] shadow-[0_0_20px_#ffb3ad]"></div>
        <p className="mt-4 font-label-md text-label-md text-primary/60 tracking-[0.3em] uppercase font-bold">
          Screen This Way
        </p>
      </div>

      {/* Main Grid & Sidepane */}
      <div className="w-full flex flex-col md:flex-row gap-gutter items-start justify-center">
        {/* Interactive Grid */}
        <div className="w-full md:w-3/4 flex flex-col items-center overflow-x-auto pb-8 custom-scrollbar">
          {loading ? (
            <div className="text-center py-20 text-on-surface-variant">Loading seating chart...</div>
          ) : (
            <div className="grid gap-4 min-w-[650px] px-4">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-6">
                  <span className="w-6 text-label-sm text-on-surface-variant font-bold text-center">{row}</span>
                  <div className="flex gap-2">
                    {seatsByRow[row]?.map((seat, idx) => {
                      const isSelected = selectedSeats.some((s) => s.show_seat_id === seat.show_seat_id);

                      let statusClass = 'bg-white/10 border-white/20 hover:bg-tertiary-container/40';
                      let content = null;

                      if (isSelected) {
                        statusClass = 'bg-tertiary-container border-tertiary shadow-[0_0_15px_rgba(105,216,212,0.5)]';
                      } else if (seat.status === 'booked') {
                        statusClass = 'bg-surface-container-highest/40 border-transparent opacity-30 booked pointer-events-none';
                      } else if (seat.status === 'locked') {
                        statusClass = 'bg-secondary-container border-secondary/50 locked pointer-events-none';
                        content = <span className="material-symbols-outlined text-[10px] text-on-secondary">lock</span>;
                      } else if (seat.type === 'premium') {
                        statusClass = 'bg-white/10 border-secondary/40 hover:bg-tertiary-container/40';
                      }

                      return (
                        <div key={seat.show_seat_id} className="flex items-center">
                          {/* Center aisle spacer */}
                          {idx === 7 && <div className="w-8" />}
                          <button
                            onClick={() => handleSeatClick(seat)}
                            className={`seat w-8 h-8 rounded-t-lg border ${statusClass} flex items-center justify-center transition-all duration-300`}
                            disabled={seat.status === 'booked' || seat.status === 'locked'}
                            title={`Seat ${row}-${seat.col_num} (${seat.type})`}
                          >
                            {content}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <span className="w-6 text-label-sm text-on-surface-variant font-bold text-center">{row}</span>
                </div>
              ))}
            </div>
          )}

          {/* Seat Status Legend */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 glass-panel px-8 py-4 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-t-sm bg-white/10 border border-white/20" />
              <span className="text-label-sm text-on-surface-variant font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-t-sm bg-white/10 border border-secondary/40" />
              <span className="text-label-sm text-on-surface-variant font-medium">Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-t-sm bg-tertiary-container border border-tertiary shadow-[0_0_8px_rgba(105,216,212,0.4)]" />
              <span className="text-label-sm text-on-surface-variant font-medium">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-t-sm bg-surface-container-highest/40 border-transparent opacity-30" />
              <span className="text-label-sm text-on-surface-variant font-medium">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-t-sm bg-secondary-container border border-secondary/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[8px] text-on-secondary">lock</span>
              </div>
              <span className="text-label-sm text-on-surface-variant font-medium">Locked</span>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside className="w-full md:w-80 glass-panel rounded-2xl p-6 sticky top-28 action-glow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Selection</h2>
            <div className="flex items-center gap-2 bg-error-container/20 px-3 py-1 rounded-full border border-error/20">
              <span className="material-symbols-outlined text-sm text-error">timer</span>
              <span className="text-label-sm font-bold text-error tracking-wider" id="timer">
                10:00
              </span>
            </div>
          </div>

          {error && <div className="text-error text-label-sm mb-4 bg-error/10 p-2 rounded">{error}</div>}

          <div className="space-y-4 mb-8 font-medium">
            <div className="flex justify-between text-body-md">
              <span className="text-on-surface-variant">Movie</span>
              <span className="text-on-surface font-semibold truncate max-w-[180px]">{movieTitle}</span>
            </div>
            <div className="flex justify-between text-body-md border-t border-white/5 pt-4">
              <span className="text-on-surface-variant">Seats</span>
              <span className="text-on-surface font-semibold max-w-[180px] truncate">
                {selectedSeatLabels || 'None selected'}
              </span>
            </div>
            <div className="flex justify-between text-body-md border-t border-white/5 pt-4">
              <span className="text-on-surface-variant">Tax (CGST/SGST)</span>
              <span className="text-on-surface font-semibold">${taxPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-end mb-8">
            <span className="text-label-md text-on-surface-variant uppercase tracking-widest font-semibold">
              Total Price
            </span>
            <span className="text-headline-md text-primary font-extrabold">${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handleLockSeats}
            disabled={selectedSeats.length === 0 || locking}
            className={`w-full bg-inverse-primary hover:bg-on-primary-fixed-variant text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
              selectedSeats.length === 0 || locking ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {locking ? 'Locking Seats...' : 'Proceed to Checkout'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <p className="text-center text-label-sm text-on-surface-variant/60 mt-4">No cancellation once booked.</p>
        </aside>
      </div>
    </main>
  );
}
