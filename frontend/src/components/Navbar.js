'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function Navbar() {
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    window.location.href = '/';
  };

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
          {!mounted ? (
            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
          ) : isLoggedIn ? (
            <>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all p-2 hover:bg-white/5 rounded-full">
                notifications
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-10 h-10 rounded-full border border-white/10 overflow-hidden cursor-pointer active:scale-95 duration-150 transition-all block focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <img
                    className="w-full h-full object-cover"
                    alt="Profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIujvT5yuDEM7cObHXiN3oN9voe5dz67_sb5Nqu3ykCqaoMamzB-hxcMe4EanKvWrhZJdeuMkuqYQEXsQw7htSYkwf4YRQtE_pUgtzqvNaHVqU22oIJ5M5lW4pkffmwge76jMIZiYGCfh_7rLZwo4Df56mybh9PbQspq2eY93TNvckZf_BuDNccaaxpDgkjO__VCbaVXaAQXybt7rMk6lgZh2AK_e-El6AqR1yBrZh01U8xmVTRn1R9EX8Zd4QHtJJoDwgsEip9w"
                  />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#0F172A] py-2 shadow-2xl border border-white/10 z-50 transition-all duration-200">
                    {user && (
                      <div className="px-4 py-2.5 border-b border-white/5">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm text-on-surface font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-on-surface-variant/70 truncate">{user.email}</p>
                      </div>
                    )}
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">dashboard</span>
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/change-password"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                        Change Password
                      </Link>
                    </div>
                    <div className="border-t border-white/5 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors text-left cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
