'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/utils/api';

const MOCK_MOVIE = {
  id: 1,
  title: 'Dune: Part Two',
  rating: '9.1',
  genre: 'Sci-Fi',
  duration_mins: 166,
  release_date: 'Mar 1, 2024',
  description:
    'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
  backdrop:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUfdu726nlXL3igTrToCJucBYpFFMclQ373LDog2__oWTBSghyBsf2LpFSYyrFVbEG8aZK8OzfCszXy9BgGdpW7917wop-pWUL8X3mRhrB3ZdtMtWky4kGjjvZ-23xU_mcs76tWgb1fbYQv5DJgpxHaO3irsMluEBAegNk4EYNXK17hnv67Zq9pObtCCjEwVpI4mgy5ikgVNhfvAtkPu-s-S_NWm_st6VAoOCozj52ChzPerXU1q_u4_Q5oIGksS1vA0QHAJ0TfA',
  poster:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAUGbdggtrC7XiGuOT2rbIXly9woeehnlr0lS67mf-5HIWqZDkjTw8rEiJDztGKfgXZzgh87kdOawnHCR3w0o_5CrpWW7zMzBsU2S5893DzOg8Y8PAIGTGmwb3Hib8bueuTXtubkJih9Zks7tDLaJt9LW4pLq89Q9DhlmFOtOymrGEGVFenv6Val3b3duehqK_V_9lf1e9x2_m_bWDFIYdhWdnTBjyvkWnmukAhMXqdCcZTeSGkHm9_JyCWkzPHHCSYft-yl7PeTw',
  cast: [
    {
      name: 'Timothée Chalamet',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDjj3HeK929GtqyX-k5KM1WhqcbZ3Kd_r7rxK1ar6R7PzCWUnnIGC_qzClj7BDD1LlLZcrVhSH0UEWCtTzcikACe-9gSwGMgfgAMqW8j0gsL40GlJWCSA8X6bEu6qSJu6ruoN-anR2vq2C27l-dWZ8hdMLF4jX8bhCc8r4oJ4YGof1bZFUJorWY9uChG2BJPJpE1KjeQX0epzvyrsbBV4pzRifp68WoKKR-IPr87v7Gf6Wc6GMVUfKPUTusK0naokQk3fSx-Wn4qA',
    },
    {
      name: 'Zendaya',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVVXpV6FSkU_6akBBOcQIXwnVryy4Arxy6dX-QEB_IaLmYEuvxqbPYQ5wWJ71qiYlHkzZJO--fbIpx1Hs3d9IGUnUPyuCbO41n5aVhihOsc6m8OZQck1pGhwmFxEk8X5x5f2qnmsZn39M8EI9smOn_CDMFSZsUJNhbKprwElZk9xhnVkn8lz8YmdOHkaiQ-wBz7ljzWvDK0fm20RPwePFJhfN0QhM3JlW-Bdm2lGWQxpzoAvLBS8UGzy4u3kpmpnto8IPHdZfBg',
    },
    {
      name: 'Austin Butler',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAFgQit6sCnNFTeymgpUikujfhbkl0vxWsSROeQrPQ1c7uZasC5a907g8W5voYWJcLUMlFPN8cCiGYSoaHrIvROYQ4QbJRaEg1aoOl_K0ifYU4rG4rf2ZOcSEF-JD9QQ_RGoNIS5hFpcxGBk9vyykA6zs8Q93T3_TJud3t9K4GjpCsQ6Nm6LwNraOyJQ9nsQi4QlmM3j4yKdA-2Joou2ofAX2jkOs6zXndZm2oaJmHPRHPN6cw3lg0jixGHr9TUP3MrzbFAVFeyuQ',
    },
    {
      name: 'Florence Pugh',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD93-oFtC9xsmj5xvHz5lhZV8siaB-01mK52kwMseHmRDuScrxSQrSGfhMUd2586gMa-gvwHCPerJ-9gBnEx__-vzaAUD9sQuLE9hqA1YuZ7VIixtxCo-9nt_P8amSUcSJqYdkP3edd8cb3vEKe85LXBKG-gzzoVjVQnc5rwu5L3UbFOjgDdCkkcm_KlE0SKnbuIfr2MyFcHRuzJ7PgevI0maCiv3z9ml3JTbGiBqpCfJjXL7s9IIdn3IgfZ1sCQep48H7lrZzNZQ',
    },
  ],
};

const MOCK_SHOWTIMES = [
  { id: 45, time: '14:30', format: 'IMAX 4K', status: 'available' },
  { id: 46, time: '18:00', format: 'IMAX 4K', status: 'available' },
  { id: 47, time: '21:15', format: 'IMAX 4K', status: 'available' },
  { id: 48, time: '15:00', format: 'Dolby Cinema', status: 'sold_out' },
  { id: 49, time: '19:30', format: 'Dolby Cinema', status: 'sold_out' },
  { id: 50, time: '22:45', format: 'Dolby Cinema', status: 'sold_out' },
  { id: 51, time: '10:00', format: 'Standard', status: 'available' },
  { id: 52, time: '13:15', format: 'Standard', status: 'available' },
  { id: 53, time: '16:45', format: 'Standard', status: 'available' },
  { id: 54, time: '20:00', format: 'Standard', status: 'available' },
  { id: 55, time: '23:15', format: 'Standard', status: 'available' },
];

export default function MovieDetailsPage({ params }) {
  const { id } = use(params);
  const [movie, setMovie] = useState(MOCK_MOVIE);
  const [showtimes, setShowtimes] = useState(MOCK_SHOWTIMES);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate next 7 days for the date selector
  useEffect(() => {
    const list = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push({
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
        day: d.getDate(),
        month: months[d.getMonth()],
        fullDate: d.toISOString().split('T')[0],
      });
    }
    setDates(list);
  }, []);

  useEffect(() => {
    if (!id || dates.length === 0) return;

    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch movie details
        const movieRes = await api.getMovie(id);
        if (movieRes.data && movieRes.data.movie) {
          setMovie({
            ...MOCK_MOVIE,
            ...movieRes.data.movie,
          });
        }

        // Fetch showtimes
        const selectedDate = dates[selectedDateIndex].fullDate;
        const showsRes = await api.getShows(id, selectedDate);
        if (showsRes.data && showsRes.data.shows && showsRes.data.shows.length > 0) {
          const mapped = showsRes.data.shows.map((show) => {
            const time = new Date(show.start_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
            return {
              id: show.id,
              time,
              format: show.screen_name || 'Standard',
              status: 'available',
            };
          });
          setShowtimes(mapped);
        } else {
          // If no shows, fallback to mocks
          setShowtimes(MOCK_SHOWTIMES);
        }
      } catch (err) {
        console.warn('API error, falling back to mock details:', err);
        setShowtimes(MOCK_SHOWTIMES);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, selectedDateIndex, dates]);

  const imaxShows = showtimes.filter((s) => s.format.includes('IMAX'));
  const dolbyShows = showtimes.filter((s) => s.format.includes('Dolby') || s.format.includes('VIP'));
  const standardShows = showtimes.filter((s) => !s.format.includes('IMAX') && !s.format.includes('Dolby') && !s.format.includes('VIP'));

  return (
    <main className="pt-0">
      {/* Hero Header Section */}
      <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden -mt-20 z-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent z-10"></div>
          <img
            className="w-full h-full object-cover scale-105 blur-sm brightness-50"
            src={movie.backdrop || MOCK_MOVIE.backdrop}
            alt="Backdrop"
          />
        </div>

        <div className="relative z-20 h-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-end pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-end">
            {/* Poster Card */}
            <div className="hidden md:block md:col-span-3">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={movie.poster || MOCK_MOVIE.poster}
                  alt={movie.title}
                />
              </div>
            </div>

            {/* Details Column */}
            <div className="md:col-span-9 space-y-stack-md">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full glass-panel text-label-sm text-primary uppercase tracking-wider font-semibold">
                  {movie.genre}
                </span>
                <span className="px-3 py-1 rounded-full glass-panel text-label-sm text-secondary uppercase tracking-wider font-semibold">
                  IMAX Experience
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface max-w-2xl leading-none font-bold uppercase">
                {movie.title}
              </h1>
              <div className="flex items-center gap-stack-md text-label-md text-on-surface-variant font-semibold">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-on-surface font-bold">{movie.rating || '9.0'}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span>{movie.duration_mins} mins</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span>{movie.release_date}</span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                {movie.description}
              </p>
              <div className="flex flex-wrap gap-stack-md pt-stack-sm items-center">
                <div className="flex -space-x-3">
                  {MOCK_MOVIE.cast.map((actor, idx) => (
                    <img
                      key={idx}
                      className="w-12 h-12 rounded-full border-2 border-background object-cover"
                      src={actor.avatar}
                      alt={actor.name}
                      title={actor.name}
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-background glass-panel flex items-center justify-center text-label-sm text-on-surface font-bold">
                    +12
                  </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg space-y-stack-lg">
        {/* Date Picker Slider */}
        <div className="space-y-stack-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            Select Date
          </h3>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 scroll-smooth">
            {dates.map((date, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDateIndex(idx)}
                className={`flex-shrink-0 w-24 h-32 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                  selectedDateIndex === idx
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                    : 'glass-panel border-white/5 hover:border-primary/50 text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className={`text-label-sm uppercase font-semibold ${selectedDateIndex === idx ? 'opacity-80' : ''}`}>
                  {date.label}
                </span>
                <span className="text-headline-md font-bold">{date.day}</span>
                <span className="text-label-sm uppercase font-semibold">{date.month}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Showtimes Grid */}
        <div className="space-y-stack-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary">theater_comedy</span>
              Available Showtimes
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-10 text-on-surface-variant">Loading showtimes...</div>
          ) : (
            <div className="grid grid-cols-1 gap-gutter">
              {/* IMAX 4K Category */}
              {imaxShows.length > 0 && (
                <div className="glass-panel rounded-3xl p-stack-md space-y-stack-sm border-l-4 border-l-secondary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-stack-sm">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/30 rounded text-label-md font-bold uppercase">
                        IMAX 4K
                      </span>
                      <span className="text-label-sm text-on-surface-variant hidden sm:inline">
                        Exceptional sound & picture
                      </span>
                    </div>
                    <span className="text-label-md text-secondary font-bold">Premium Experience</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {imaxShows.map((show) => (
                      <Link
                        key={show.id}
                        href={`/shows/${show.id}/seats`}
                        className="px-8 py-4 rounded-xl border border-white/10 hover:border-primary text-headline-sm font-bold text-on-surface transition-all active:scale-95 action-glow bg-white/5"
                      >
                        {show.time}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Dolby Cinema Category */}
              {dolbyShows.length > 0 && (
                <div className="glass-panel rounded-3xl p-stack-md space-y-stack-sm border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-stack-sm">
                      <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded text-label-md font-bold uppercase">
                        Dolby Cinema
                      </span>
                      <span className="text-label-sm text-on-surface-variant hidden sm:inline">
                        Atmospheric spatial audio
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {dolbyShows.map((show) => (
                      <Link
                        key={show.id}
                        href={`/shows/${show.id}/seats`}
                        className="px-8 py-4 rounded-xl border border-white/10 hover:border-primary text-headline-sm font-bold text-on-surface transition-all active:scale-95 action-glow bg-white/5"
                      >
                        {show.time}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Category */}
              {standardShows.length > 0 && (
                <div className="glass-panel rounded-3xl p-stack-md space-y-stack-sm border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-stack-sm">
                      <span className="px-3 py-1 bg-on-surface-variant/10 text-on-surface-variant border border-on-surface-variant/30 rounded text-label-md font-bold uppercase">
                        Standard
                      </span>
                      <span className="text-label-sm text-on-surface-variant hidden sm:inline">
                        Comfortable seating
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {standardShows.map((show) => (
                      <Link
                        key={show.id}
                        href={`/shows/${show.id}/seats`}
                        className="px-8 py-4 rounded-xl border border-white/10 hover:border-primary text-headline-sm font-bold text-on-surface transition-all active:scale-95 action-glow bg-white/5"
                      >
                        {show.time}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {showtimes.length === 0 && (
                <div className="text-center py-10 text-on-surface-variant">No showtimes available for this date.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
