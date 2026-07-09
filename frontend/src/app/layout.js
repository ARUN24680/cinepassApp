import { Montserrat, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

import Providers from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "CinePass | Experience the Red Carpet Digital",
  description: "Book movie tickets and reserve seats in real time.",
};

 

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} dark`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body-md text-body-md overflow-x-hidden min-h-screen flex flex-col pb-16 md:pb-0">
        <Providers>
          <SmoothScroll>
            <Navbar />
            <div className="flex-grow mt-16">
              {children}
            </div>
            <Footer />

          {/* Mobile Bottom NavBar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel z-50 flex items-center justify-around px-4 border-t-0 rounded-t-2xl">
            <Link href="/" className="flex flex-col items-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              <span className="text-[10px] font-bold">Home</span>
            </Link>
            <Link href="/" className="flex flex-col items-center text-on-surface-variant">
              <span className="material-symbols-outlined">movie</span>
              <span className="text-[10px]">Movies</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center text-on-surface-variant">
              <span className="material-symbols-outlined">confirmation_number</span>
              <span className="text-[10px]">Tickets</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center text-on-surface-variant">
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px]">Profile</span>
            </Link>
          </div>
        </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
