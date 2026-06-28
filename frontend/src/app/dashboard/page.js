'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import useAuthStore from '@/store/useAuthStore';

const MOCK_BOOKINGS = [
  {
    id: 'CP-9928475',
    movie_title: 'Neon Horizon: Genesis',
    format: 'IMAX 3D',
    status: 'confirmed',
    date: 'Oct 24, 2026',
    time: '08:30 PM',
    theater: 'CinePass Grand, Hall 4',
    seats: ['Row H - 12', 'Row H - 13'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhdn8fnF_oATmxT_WAoawHrskrlY2m-B3fPrHFa3eUoLoT_C8Lu_yVDWhTgMCGVTOUtsCDU20gso3kbZAzgNkcdFOtaBc74jPov5dQ-4S81v5KNfejOg8bk5mHHOn8pmMCECNdnIpqUZFMeW8FFyP3KXMkA4Sqn6kQ9WVwXdXyxr6cmfoHnbBrj2Y0GKCGtNAr1o3NAGHWWAduoX3iO9qn59XL2N1TvJgtgx2rKLGC39Kok-vzcmikJLEV_Qao0r1Q04Naia19hg',
  },
  {
    id: 'CP-8837194',
    movie_title: 'The Last Witness',
    format: 'Standard 2D',
    status: 'pending',
    date: 'Oct 26, 2026',
    time: '06:15 PM',
    theater: 'CinePass Plaza, Screen 2',
    seats: ['Row E - 8'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARTddp6O66evKDlPg2KDis6ZAV_0TUXrBpCXMtDyOmt1RRSLOJfK8dJ86dExugDUe42SurJ0GthfFci1G6j7MC3XYg1LyDqO1xmD2FpmL3-vkzAfa_2Kc5W6LC7aOFYxvIl-sgonWvz80ISCF-8ho4ysV4c9w_yR-hTX2kn0bmabzU8WiLwM_sx816t-NZI_4vBvine7QpYqlOkYZ88i_O9Ya4LD9pFxvK9iMo4cmUcsY1NnCIeqOwwVFberXFhaNjb0htgbbXMg',
  },
  {
    id: 'CP-1102938',
    movie_title: 'Starlight Adventures',
    format: 'Digital Dolby',
    status: 'cancelled',
    date: 'Oct 12, 2026',
    time: '04:00 PM',
    theater: 'CinePass Galleria, Hall 1',
    seats: ['Row A - 5'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKkEDxAZQFU9fMo5FCaQjxXvw09tRzxerbUmx7uLE_yAxKOYxaGUmuprCNjo7eVVIVo2E_l-ZnT6Kx0JlbUqkFWWOrqtlE6RwnA6If6VsA6zLFe_-sx-Pz0mxxmFvdn4B4osbKAXEdUJY2jO6fpJxjLXXn1ySHMQAeFOY1J2qcC7yEyC19SM6brrEalWL5wxXOBfFoCK6f7AAoIvosc_ajvpVl49bmLWAxMO4irHfdzplK628ccFg_aR8w1V6YOZ_AOb6y9lIepA',
  },
];

import { Suspense } from 'react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Load bookings
  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getBookingsHistory();
      if (res.data && res.data.bookings && res.data.bookings.length > 0) {
        // Map backend objects
        const mapped = res.data.bookings.map((b) => ({
          id: `CP-${b.booking_id}`,
          movie_title: b.movie_title || 'Dune: Part Two',
          format: b.screen_name || 'IMAX',
          status: b.status, // confirmed, pending, cancelled
          date: new Date(b.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          theater: 'CinePass Grand, Hall 1',
          seats: b.seats || [],
          image: MOCK_BOOKINGS[0].image,
        }));
        setBookings(mapped);
      } else {
        setBookings(MOCK_BOOKINGS);
      }
    } catch (err) {
      console.warn('API error, using mock dashboard data:', err.message);
      setBookings(MOCK_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Handle optional success parameters passed from checkout redirect
  useEffect(() => {
    const successBookingId = searchParams.get('booking_id');
    const successStatus = searchParams.get('status');

    if (successBookingId && successStatus === 'confirmed') {
      // Temporarily inject success item to top
      setBookings((prev) => {
        const exists = prev.some((b) => b.id.includes(successBookingId));
        if (exists) return prev;

        const newSuccessBooking = {
          id: `CP-${successBookingId.replace('mock-', '')}`,
          movie_title: 'Dune: Part Two',
          format: 'IMAX Experience',
          status: 'confirmed',
          date: 'Today',
          time: '19:30 PM',
          theater: 'CinePass Grand, Screen 01',
          seats: ['Row C - 4', 'Row C - 5'],
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVqX6733YMhMr5rCwF3Ak12nTTYuXPC4NHALyRdWzM2Mhoa4THSDe0LD1h1VBp3AX_C2-n0ao5VxGviwBKexDb0JrFJZ0TfUFwwB0_Dub-Os56rM-cftrWcMbyyKn-h05OpEQpxQ6CyJqcvTslIfIi5xLP1tkWT1futE9PSjIIrs9ycD3pgEuzrNAmJ47AX_s5etJtunmqf46FN3Xz3bpP9N0j27NgWIT-PqHbToeV_DQ2ZA5f0_IURaN4ELL0Q0EZkgv8BVbGdQ',
        };
        return [newSuccessBooking, ...prev];
      });
    }
  }, [searchParams]);

  const handleCancelBooking = async (bookingIdStr) => {
    const numericId = bookingIdStr.replace('CP-', '');
    if (!confirm(`Are you sure you want to cancel booking ${bookingIdStr}? You will receive a full refund to your card via Stripe.`)) {
      return;
    }

    try {
      setCancellingId(bookingIdStr);
      await api.cancelBooking(numericId);
      alert(`Booking ${bookingIdStr} has been cancelled successfully. Refund completed!`);
      loadBookings();
    } catch (err) {
      console.warn('Backend cancellation failed, running mock cancellation:', err.message);
      // Mock update
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id === bookingIdStr) {
            return { ...b, status: 'cancelled' };
          }
          return b;
        })
      );
      alert(`Booking ${bookingIdStr} has been cancelled (Demo Mode).`);
    } finally {
      setCancellingId(null);
    }
  };

  // Filter bookings based on active tabs
  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter((b) => b.status === 'cancelled' || b.status === 'expired' || b.status === 'past');

  return (
    <main className="pt-12 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      {/* Profile summary Card */}
      <section className="mb-stack-lg">
        <div className="glass rounded-3xl p-stack-md md:p-stack-lg flex flex-col md:flex-row justify-between items-center gap-stack-md border border-white/10 shadow-lg">
          <div className="flex items-center gap-stack-md">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-primary/20 rotate-3">
                <img
                  className="w-full h-full object-cover -rotate-3 scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPCaH5pmnyYRwY84r50ckVZVAUBI1J2Q64lLlWy9v-CuIK-4UFmFO3MOhqqwxMloBW6zp7Oyxa6x3wkjGTMlMh6rx94-L46-RodeF-PQO_k2fIVZ4adDOi7wPen2d8bBbpPXc7lM4iNtzUrjfZvY7-z3XBnoCVMPHYIWU5USznVCMVQvvgIwzi5XPjoDyBYhyAqsl5gtO-2mEWQ1h72dv5quKwRIQTgCPM5imqbwCSvRwhaoeFa4_wUmfFdI_RwU9yoLpFcry0RQ"
                  alt="Profile"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-label-sm font-bold shadow-lg">
                GOLD MEMBER
              </div>
            </div>
            <div>
              <h1 className="font-display-lg-mobile md:font-headline-md text-on-surface font-extrabold uppercase">
                {user?.name || 'Alex Rivera'}
              </h1>
              <p className="text-on-surface-variant font-body-md font-medium flex items-center gap-4 flex-wrap">
                <span>Member since Dec 2025</span>
              </p>
            </div>
          </div>
          <div className="flex gap-stack-md w-full md:w-auto font-medium">
            <div className="flex-1 md:flex-none glass bg-white/5 rounded-2xl p-stack-sm text-center border border-white/5">
              <span className="block text-primary font-headline-md font-bold">2,450</span>
              <span className="text-label-sm text-on-surface-variant uppercase tracking-widest font-semibold">
                Loyalty Points
              </span>
            </div>
            <div className="flex-1 md:flex-none glass bg-white/5 rounded-2xl p-stack-sm text-center border border-white/5">
              <span className="block text-secondary font-headline-md font-bold">12</span>
              <span className="text-label-sm text-on-surface-variant uppercase tracking-widest font-semibold">
                Movies Seen
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Selector */}
      <div className="flex items-center gap-stack-md border-b border-white/10 mb-stack-md relative font-bold text-lg">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-4 px-2 transition-all relative ${
            activeTab === 'upcoming' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Upcoming
          {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-4 px-2 transition-all relative ${
            activeTab === 'past' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Past & Cancelled
          {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-20 text-on-surface-variant font-semibold">Loading your tickets...</div>
      ) : (
        <div className="grid grid-cols-1 gap-stack-md">
          {activeTab === 'upcoming' &&
            upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="booking-card upcoming glass rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/10 hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={b.image}
                    alt={b.movie_title}
                  />
                  <div className="absolute top-4 left-4 glass bg-primary/95 text-on-surface px-3 py-1 rounded-lg text-label-sm font-bold border border-white/10">
                    {b.format}
                  </div>
                </div>
                <div className="flex-1 p-stack-md flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-sm text-on-surface font-bold text-xl">{b.movie_title}</h3>
                      <span
                        className={`border px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1 ${
                          b.status === 'confirmed'
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'bg-secondary/20 text-secondary border-secondary/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {b.status === 'confirmed' ? 'check_circle' : 'pending'}
                        </span>
                        {b.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-sm text-on-surface-variant font-medium">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary/60">calendar_today</span>
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary/60">schedule</span>
                        <span>{b.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary/60">location_on</span>
                        <span className="truncate max-w-[140px]" title={b.theater}>
                          {b.theater}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary/60">chair</span>
                        <span className="truncate max-w-[140px]">{b.seats.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-stack-md flex flex-col md:flex-row items-center justify-between gap-stack-sm border-t border-white/5 pt-stack-sm font-semibold">
                    <div className="text-on-surface-variant text-label-md">
                      Booking ID: <span className="text-on-surface font-mono">{b.id}</span>
                    </div>
                    <div className="flex gap-stack-sm w-full md:w-auto">
                      <button className="flex-1 md:flex-none glass border border-white/10 hover:bg-white/10 text-on-surface px-6 py-2 rounded-xl transition-all active:scale-95">
                        View Ticket
                      </button>
                      <button
                        disabled={cancellingId === b.id}
                        onClick={() => handleCancelBooking(b.id)}
                        className={`flex-1 md:flex-none bg-error/10 hover:bg-error/20 text-error border border-error/30 px-6 py-2 rounded-xl transition-all active:scale-95 ${
                          cancellingId === b.id ? 'opacity-55' : ''
                        }`}
                      >
                        {cancellingId === b.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {activeTab === 'past' &&
            pastBookings.map((b) => (
              <div
                key={b.id}
                className="booking-card past glass rounded-2xl overflow-hidden flex flex-col md:flex-row opacity-65 grayscale-[0.3] border border-white/5"
              >
                <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0">
                  <img className="w-full h-full object-cover" src={b.image} alt={b.movie_title} />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-error text-on-error px-4 py-1 rounded-full font-bold text-label-md">
                      {b.status === 'cancelled' ? 'CANCELLED' : 'EXPIRED'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-stack-md flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-headline-sm text-on-surface-variant font-bold text-xl">{b.movie_title}</h3>
                    <div className="grid grid-cols-2 gap-stack-sm text-on-surface-variant/70 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined">payments</span>
                        <span>Refunded to Bank</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-stack-md pt-pt-stack-sm">
                    <a href="/" className="text-primary font-bold text-label-md hover:underline">
                      Rebook Now
                    </a>
                  </div>
                </div>
              </div>
            ))}

          {/* Empty State */}
          {((activeTab === 'upcoming' && upcomingBookings.length === 0) ||
            (activeTab === 'past' && pastBookings.length === 0)) && (
            <div className="py-32 text-center flex flex-col items-center gap-stack-md">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-display-lg text-white/10">movie_off</span>
              </div>
              <div className="space-y-2">
                <h2 className="font-headline-md text-on-surface font-bold text-2xl">No bookings found</h2>
                <p className="text-on-surface-variant max-w-sm mx-auto font-medium">
                  It looks like you haven't booked any movies yet. Ready for your next red carpet adventure?
                </p>
              </div>
              <a
                href="/"
                className="bg-primary text-on-primary-container px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                Browse Movies
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-on-surface-variant font-semibold">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
