'use client';

import { use, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '@/utils/api';

// Initialize Stripe (uses fallback mock key if not set in environment)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TRq8tCNgGKeXn7JyeI8sBjHEUVbAoxneAo9LPxqkvq18AcVdaVfPA2sMZLa6iaBJ2KPNAzqHaLscmsCUqNkEDW800JorlKaX1'
);

function StripeCheckoutForm({ bookingId, clientSecret, totalPrice, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        onError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess(result.paymentIntent.id);
        }
      }
    } catch (err) {
      onError(err.message || 'Payment confirmation failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-stack-md" id="payment-form">
      <div className="space-y-stack-sm">
        <label className="font-label-md text-on-surface-variant font-semibold">Cardholder Name</label>
        <input
          required
          className="w-full h-14 px-4 rounded-xl stripe-input text-on-surface focus:outline-none placeholder:text-outline-variant bg-[#1e100e] border border-[#5b403e] focus:border-primary-container"
          placeholder="John Wick"
          type="text"
        />
      </div>

      <div className="space-y-stack-sm">
        <label className="font-label-md text-on-surface-variant font-semibold">Card Details</label>
        <div className="p-4 rounded-xl bg-[#1e100e] border border-[#5b403e] focus-within:border-primary-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#f9dcd9',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': {
                    color: '#ab8986',
                  },
                },
                invalid: {
                  color: '#ffb4ab',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="pt-stack-md">
        <button
          disabled={processing || !stripe}
          className="w-full h-16 bg-primary-container hover:bg-inverse-primary text-on-primary-container font-display-lg text-headline-sm rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 font-bold"
          type="submit"
        >
          {processing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)} Now`}
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </form>
  );
}

import { Suspense } from 'react';

function CheckoutContent({ params }) {
  const { bookingId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('secret');
  const showId = searchParams.get('show_id');
  const movieId = searchParams.get('movie_id');

  const [movieTitle, setMovieTitle] = useState('Dune: Part Two');
  const [totalPrice, setTotalPrice] = useState(32.0);
  const [seats, setSeats] = useState(['Row C - 4', 'Row C - 5']);
  const [timeLeft, setTimeLeft] = useState(599); // 10 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mockProcessing, setMockProcessing] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMockSubmit = (e) => {
    e.preventDefault();
    setMockProcessing(true);
    setError('');

    setTimeout(() => {
      setMockProcessing(false);
      setPaymentSuccess(true);
      // Redirect to dashboard with success status
      setTimeout(() => {
        router.push(`/dashboard?booking_id=${bookingId}&status=confirmed`);
      }, 1500);
    }, 2000);
  };

  // Determine if we should render mock form or real Stripe Elements
  const isMockPayment = !clientSecret || clientSecret.startsWith('pi_mock_');

  return (
    <main className="pt-12 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Timer Banner */}
      <div className="mb-stack-md flex justify-center">
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 border-primary-container/30">
          <span className="material-symbols-outlined text-primary-container animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            timer
          </span>
          <span className="font-headline-sm text-headline-sm text-primary-container font-bold">
            {isExpired ? 'Lock Expired' : `${formatTimer()} left to pay`}
          </span>
        </div>
      </div>

      {isExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center space-y-6">
            <span className="material-symbols-outlined text-error text-[64px]">warning</span>
            <h2 className="text-headline-md font-bold text-on-surface">Reservation Expired</h2>
            <p className="text-on-surface-variant">Your seat lock has expired. Please go back to select seats again.</p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Go to Movies
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Booking Summary Card */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <section className="glass-panel p-stack-md rounded-2xl h-full flex flex-col">
            <h2 className="font-headline-md text-headline-md mb-stack-md flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary">confirmation_number</span>
              Booking Summary
            </h2>
            <div className="relative rounded-xl overflow-hidden mb-stack-md aspect-video group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8d8lKP8mlmrmfvDZCc2GSOacEpPcsGpzgiu6JucQ6epmx2w_5UENtNt4OuoSeeFTqdBx1P8JJz4y4JXrgY2C2KdCOtZBfWOsU7Z_clfnf2crKsTA3g7sy4f0mL0ArP-JkxicQy1vavvbzSJXLxGdODuPKgbwn465qUj-h2ZcGbrtv7c17okHqsw0QhWqhqiRHqx8Bng5n-h8zNkobb8D9g2RlLwWYJwl0eQBhG87E_KxCsLuQnnF-fTvC477FbjUbE9Vlfj210A"
                alt="Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="font-headline-md text-headline-md text-white font-bold">{movieTitle}</p>
                <p className="font-label-md text-label-md text-primary font-semibold">IMAX Experience</p>
              </div>
            </div>
            <div className="space-y-4 flex-grow font-medium">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-on-surface-variant font-label-md">Date & Time</span>
                <span className="font-label-md text-on-surface">Today • 19:30</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-on-surface-variant font-label-md">Theater</span>
                <span className="font-label-md text-on-surface">Screen 01 (IMAX)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-on-surface-variant font-label-md">Seats</span>
                <div className="flex gap-2">
                  {seats.map((seat, idx) => (
                    <span key={idx} className="bg-primary/20 text-primary px-3 py-1 rounded-lg font-label-md">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-stack-md pt-stack-md border-t border-white/10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-on-surface-variant text-label-sm uppercase tracking-widest mb-1">Total Payable</p>
                  <p className="font-display-lg text-display-lg-mobile md:text-headline-md text-primary font-bold">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <span className="text-on-surface-variant text-label-sm italic">Incl. all taxes</span>
              </div>
            </div>
          </section>
        </div>

        {/* Payment Card */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <section className="glass-panel p-stack-md md:p-stack-lg rounded-3xl action-glow">
            <div className="flex justify-between items-center mb-stack-md">
              <h2 className="font-headline-md text-headline-md font-bold">Payment Details</h2>
              <span className="text-outline text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">security</span> Secured
              </span>
            </div>

            {error && <div className="text-error text-label-sm mb-4 bg-error/10 p-2 rounded">{error}</div>}

            {paymentSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <span className="material-symbols-outlined text-[64px] text-tertiary-container animate-bounce">
                  check_circle
                </span>
                <h3 className="text-headline-sm font-bold text-on-surface">Payment Successful!</h3>
                <p className="text-on-surface-variant">Generating your tickets and redirecting...</p>
              </div>
            ) : isMockPayment ? (
              /* Mock Form UI */
              <form onSubmit={handleMockSubmit} className="space-y-stack-md" id="payment-form">
                <div className="space-y-stack-sm">
                  <label className="font-label-md text-on-surface-variant font-semibold">Cardholder Name</label>
                  <input
                    required
                    className="w-full h-14 px-4 rounded-xl stripe-input text-on-surface focus:outline-none placeholder:text-outline-variant bg-[#1e100e] border border-[#5b403e] focus:border-primary-container"
                    placeholder="John Wick"
                    type="text"
                  />
                </div>
                <div className="space-y-stack-sm">
                  <label className="font-label-md text-on-surface-variant font-semibold">Card Information (Demo)</label>
                  <div className="relative">
                    <input
                      required
                      className="w-full h-14 pl-12 pr-4 rounded-t-xl stripe-input text-on-surface focus:outline-none placeholder:text-outline-variant bg-[#1e100e] border border-[#5b403e]"
                      placeholder="4242 4242 4242 4242"
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      credit_card
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <input
                      required
                      className="w-full h-14 px-4 rounded-bl-xl stripe-input text-on-surface border-t-0 border-r-0 focus:outline-none placeholder:text-outline-variant bg-[#1e100e] border border-[#5b403e]"
                      placeholder="MM / YY"
                      type="text"
                    />
                    <input
                      required
                      className="w-full h-14 px-4 rounded-br-xl stripe-input border-t-0 text-on-surface focus:outline-none placeholder:text-outline-variant bg-[#1e100e] border border-[#5b403e]"
                      placeholder="CVC"
                      type="text"
                    />
                  </div>
                </div>
                <div className="space-y-stack-sm">
                  <label className="font-label-md text-on-surface-variant font-semibold">Billing ZIP Code</label>
                  <input
                    required
                    className="w-full h-14 px-4 rounded-xl stripe-input text-on-surface focus:outline-none placeholder:text-outline-variant bg-[#1e100e] border border-[#5b403e] focus:border-primary-container"
                    placeholder="90210"
                    type="text"
                  />
                </div>
                <div className="pt-stack-md">
                  <button
                    disabled={mockProcessing}
                    className="w-full h-16 bg-primary-container hover:bg-inverse-primary text-on-primary-container font-display-lg text-headline-sm rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 font-bold"
                    type="submit"
                  >
                    {mockProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)} Now (Demo Mode)`}
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Real Stripe Form */
              <Elements stripe={stripePromise}>
                <StripeCheckoutForm
                  bookingId={bookingId}
                  clientSecret={clientSecret}
                  totalPrice={totalPrice}
                  onSuccess={(paymentIntentId) => {
                    setPaymentSuccess(true);
                    setTimeout(() => {
                      router.push(`/dashboard?booking_id=${bookingId}&status=confirmed`);
                    }, 1500);
                  }}
                  onError={(msg) => setError(msg)}
                />
              </Elements>
            )}

            <div className="mt-stack-md flex flex-col items-center gap-4">
              <Link
                className="text-on-surface-variant hover:text-primary transition-colors font-label-md flex items-center gap-2 group font-semibold"
                href={showId && movieId ? `/shows/${showId}/movies/${movieId}/seats` : '/'}
              >
                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                  arrow_back
                </span>
                Go Back to Seating
              </Link>
              <div className="flex items-center gap-2 text-outline-variant text-label-sm font-semibold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                Secured by Stripe SSL Encryption
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage({ params }) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-on-surface-variant font-semibold">Loading checkout details...</div>}>
      <CheckoutContent params={params} />
    </Suspense>
  );
}
