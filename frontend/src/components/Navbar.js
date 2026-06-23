'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function Navbar() {
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container/80 backdrop-blur-xl border-b border-white/10 shadow-2xl h-20">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-stack-md">
          <Link href="/" className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tighter font-extrabold uppercase">
            CinePass
          </Link>
          <div className="hidden md:flex items-center gap-gutter ml-10">
            <Link
              href="/"
              className={`font-body-md text-body-md transition-colors ${pathname === '/' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >
              Movies
            </Link>
            <Link
              href="/dashboard"
              className={`font-body-md text-body-md transition-colors ${pathname === '/dashboard' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >
              My Tickets
            </Link>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md" href="#">
              Cinemas
            </a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md" href="#">
              Offers
            </a>
          </div>
        </div>
        <div className="flex items-center gap-stack-md">
          {isLoggedIn ? (
            <>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all p-2 hover:bg-white/5 rounded-full">
                notifications
              </button>
              <Link href="/dashboard" className="w-10 h-10 rounded-full border border-white/10 overflow-hidden cursor-pointer active:scale-95 duration-150 transition-all block">
                <img
                  className="w-full h-full object-cover"
                  alt="Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIujvT5yuDEM7cObHXiN3oN9voe5dz67_sb5Nqu3ykCqaoMamzB-hxcMe4EanKvWrhZJdeuMkuqYQEXsQw7htSYkwf4YRQtE_pUgtzqvNaHVqU22oIJ5M5lW4pkffmwge76jMIZiYGCfh_7rLZwo4Df56mybh9PbQspq2eY93TNvckZf_BuDNccaaxpDgkjO__VCbaVXaAQXybt7rMk6lgZh2AK_e-El6AqR1yBrZh01U8xmVTRn1R9EX8Zd4QHtJJoDwgsEip9w"
                />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-primary hover:bg-inverse-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 text-label-sm font-label-sm text-center"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
