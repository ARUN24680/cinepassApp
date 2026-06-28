'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMoviesQuery } from '@/hooks/useMovies';

const MOCK_COMING_SOON = [
  {
    id: 5,
    title: 'The Void Project',
    release: 'MAY 24',
    genre: 'Sci-Fi / Horror',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwlyRYBVcbrystgtBoWfHxuxfHtgFat-iAXqzdL27uQsrM_jExnAKcTBvEsZXK9uOFqbRwzOJ1cj9vP1wCWIpiYbpRd7lAJHUscey02KnHPEMzJwZbDmNRdtpgnj_pA0ZW3LzwF55ywN-p9t-ZBGTFeqd2W4b0C9rYiVjBvY_QYJP9yOGebVW12qH7piiEoJNvKYTMz5k05E4IqOMH8qWH9MzhiA0kZFpnui8ic10ZdQ3TlCTESgmUAK024paehwKs-pqiDwPVew',
  },
  {
    id: 6,
    title: "Flora's Secret",
    release: 'JUN 12',
    genre: 'Animation / Adventure',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC22DHbfn0DRvzXuil8COvH_clYQZtLUqGHGKbXuXdhaPjSBPPCZTu92UJnMLk6AwhdMZtDyXVIrRB7Jmr3XpM1TnbrrxsVk31HA8kWxaHMUKN9sxEN22s0ZiZdOpHfEIhdT1lHRSXDHoE2iqmnZcQRIsjbQaNJofoAv1feFRRuLLWHP7aZ6WaoaiqoTK_lVdh0Pg2LY6tNUwsQYsQS4B8r7nsyEUC0J8yARl8WQ-wrezdRJ4wqFrXucv7sYueP3-Lu_gvZH6pLKg',
  },
  {
    id: 7,
    title: 'Silent Witness',
    release: 'JUL 05',
    genre: 'Crime / Mystery',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD49B2BqQ_UbsETjphrednQD0hUBg-pYMIE11i8EKe4yoJHZ5G9C6VDGP3yNa-GfQLChik4gagnof_26QE_8bwH0vFs0KvgdPlP_R8lEXervPXBA1UDFpbwnsI0HJKR9wwYbdZ8I4M8Qi5iHg_6iLCszX9F1Q9Zwbds6ij7u994pO0rQJq0b3yBBsSuaNDzjcHajM1oqRs77KTx1xYj4SlK2PbRIYPYtbqAzfBdVFd0wfFkV4hfJ2366WNvyATStQUvOvO19wky9g',
  },
  {
    id: 8,
    title: 'Iron Empire',
    release: 'JUL 19',
    genre: 'History / Action',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbrPCd6hJ10dMwoLsA_z_C2KZ6mu4Z4pASrMQoyoTR9pOkXw0wGXcI8IowbBl0d_P15_1WvdTCP91_8HeWuwDA3ekl5AWd27Nq3xOIMfNO8kgC1u_JZTD-6qWVAflEH976HPcGd91dbQYlg6tStAMXyu2SFsYc_fhx13TOpGlAU9L2gyP2zVfHBCvGUqAo0hTde9vf8tgMQ7jlL0csFbMo_VMO5a0OdbylNWdCOLEwhD9kVu7dH5we31c62wA5__Wy-FWE3zd9Hg',
  },
  {
    id: 9,
    title: 'Midnight Balcony',
    release: 'AUG 02',
    genre: 'Romance / Drama',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlyvDgMCuCh7dsICe4dDWKb9jbIOVGb1ez_ICy8PPCnpMh_DjrpQyF1E5krADEB6H_HY5EN96ytqjr7EOQzYrbi5s0rvFPW18xf8RIjhiPL-EhKXR2PCch_iVGaPTmi-9i6WwT7gqD_9dSofGbVEHt5yPdwgfW4eaOWGrvi0zqNhxf-E85FWWr1A7Sj_MDKO2yAGdohGaFElYgPFEOMi72dxP0GSOKA6OTBs4rH0DHsbS5T2f1WQc-VC2dXdDLckhe06DrSD-m1Q',
  },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search string updates to prevent spamming queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: apiMovies, isLoading } = useMoviesQuery(debouncedSearch);

  // Fallback to mock data if API results are empty or query fails
  const movies = (apiMovies && apiMovies.length > 0) && apiMovies


  return (
    <div>
      {/* Hero Section */}
      <header className="relative w-full h-[870px] flex items-end overflow-hidden -mt-20 z-0">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDq69LaTt2Y9RtlX40capwHEXvP0XCUdhhV083enS6pO6kbNZJB8BZt4-RLa8OgRPU5rrCi7v3KWdnxkj5JZimRzUB7bXLkwgC4dIkuZSDEhjpm-nRo52YR1XnxeBeO6J6PLgx7bk8vDlbkNNeNC_v7PiZfvwANBmthGPeJusHeuvBC-4IMjoh7L0D00MqJ9aLpBE0fzwSotv_rdmObzYFSP1YGyl4rZs9gfVybjaPC10Dsd3Squjn4QifPYQt8QMn9rF39NkBRcQ')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-60" />
        </div>

        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-stack-lg">
          <div className="max-w-2xl space-y-stack-sm">
            <div className="flex gap-2">
              <span className="glass-panel px-3 py-1 rounded-full text-label-sm font-label-sm text-secondary uppercase tracking-widest border-secondary/30">
                IMAX 3D Experience
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface uppercase leading-tight font-extrabold">
              Dune: Part Two
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-stack-md">
              Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.
            </p>
            <div className="flex flex-wrap gap-stack-md pt-4">
              <Link
                href="/movies/1"
                className="bg-inverse-primary text-on-surface font-label-md text-label-md px-8 py-4 rounded-xl flex items-center gap-2 action-glow transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-inverse-primary/20"
              >
                <span className="material-symbols-outlined">confirmation_number</span>
                Book Now
              </Link>
              <button className="glass-panel text-on-surface font-label-md text-label-md px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all border-white/20 active:scale-95">
                <span className="material-symbols-outlined">play_circle</span>
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="relative z-20 -mt-10 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-2 rounded-2xl flex items-center shadow-2xl group transition-all duration-300 focus-within:border-inverse-primary/50">
            <span className="material-symbols-outlined px-4 text-on-surface-variant group-focus-within:text-inverse-primary">
              search
            </span>
            <input
              className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-on-surface font-body-md py-4 placeholder:text-on-surface-variant/50"
              placeholder="Search for movies, cinemas, or events..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md px-6 py-3 rounded-xl transition-all hidden sm:block">
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-lg space-y-stack-lg pb-stack-lg">
        {/* Now Showing */}
        <section>
          <div className="flex justify-between items-end mb-stack-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Now Showing</h2>
              <p className="text-on-surface-variant font-body-md">Experience the magic on the big screen today.</p>
            </div>
            <a className="text-primary font-label-md hover:underline flex items-center gap-1" href="#">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-on-surface-variant">Loading movies...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="group relative rounded-2xl overflow-hidden glass-panel flex flex-col transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={movie.image}
                      alt={movie.title}
                    />
                    {movie.title.includes('Dune') && (
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="bg-inverse-primary/90 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white uppercase">
                          Trending
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 movie-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link
                        href={`/movies/${movie.id}`}
                        className="bg-white text-black font-label-md px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex flex-col flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                        {movie.title}
                      </h3>
                      <span className="text-secondary font-bold text-label-sm">{movie.rating} ★</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] text-on-surface-variant border border-white/10 px-2 py-0.5 rounded uppercase">
                        {movie.genre}
                      </span>
                      <span className="text-[10px] text-on-surface-variant border border-white/10 px-2 py-0.5 rounded uppercase">
                        {movie.duration_mins} min
                      </span>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Link
                        href={`/movies/${movie.id}`}
                        className="block w-full text-center bg-surface-container-high hover:bg-inverse-primary hover:text-on-surface text-on-surface-variant py-3 rounded-xl transition-all duration-300 font-label-md active:scale-95"
                      >
                        Book Tickets
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Coming Soon */}
        <section>
          <div className="flex justify-between items-end mb-stack-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Coming Soon</h2>
              <p className="text-on-surface-variant font-body-md">Mark your calendars for these blockbusters.</p>
            </div>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
            {MOCK_COMING_SOON.map((movie) => (
              <div key={movie.id} className="flex-none w-48 md:w-56 group cursor-pointer">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass-panel mb-3">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={movie.image}
                    alt={movie.title}
                  />
                  <div className="absolute top-2 right-2 glass-panel px-2 py-1 rounded text-[10px] font-bold text-secondary">
                    {movie.release}
                  </div>
                </div>
                <h4 className="font-label-md text-label-md text-on-surface truncate group-hover:text-primary transition-colors font-semibold">
                  {movie.title}
                </h4>
                <p className="text-[12px] text-on-surface-variant">{movie.genre}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Loyalty Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter pt-stack-md">
          <div className="md:col-span-2 glass-panel rounded-3xl p-margin-desktop relative overflow-hidden flex flex-col justify-center min-h-[300px]">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[180px] text-primary">confirmation_number</span>
            </div>
            <div className="relative z-10 space-y-stack-sm">
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface uppercase font-extrabold">
                Join the Red Carpet Elite
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-md">
                Get early access to tickets, exclusive premieres, and earn points on every booking with CinePass Platinum.
              </p>
              <div className="pt-4 flex gap-stack-sm">
                <button className="bg-primary text-on-primary font-label-md px-8 py-3 rounded-xl hover:scale-105 transition-all">
                  Sign Up Free
                </button>
                <button className="text-on-surface-variant font-label-md px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="bg-secondary-container rounded-3xl p-margin-mobile flex flex-col items-center justify-center text-center space-y-stack-sm group cursor-pointer overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="material-symbols-outlined text-[64px] text-on-secondary-container">card_membership</span>
            <h3 className="font-headline-sm text-on-secondary-container font-semibold">Gift Cards</h3>
            <p className="text-on-secondary-container/80 font-body-md">The perfect gift for every movie lover.</p>
            <button className="bg-on-secondary-container text-white px-6 py-2 rounded-full font-label-md hover:scale-105 transition-all">
              Buy Now
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
