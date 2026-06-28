'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import useAuthStore from '@/store/useAuthStore';

export default function ChangePasswordPage() {
  const user = useAuthStore((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const allMet = hasMinLength && hasNumber && hasSpecial && isMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to change your password.');
      return;
    }
    if (!allMet) {
      setError('Please meet all password requirements before updating.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await api.changePassword(currentPassword, newPassword, confirmPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-12 px-margin-mobile md:px-margin-desktop min-h-[80vh] flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full relative z-10">

        {/* Breadcrumb / Back Link */}
        <div className="mb-stack-md">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group w-fit"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="font-label-md text-label-md">Back to Dashboard</span>
          </Link>
        </div>

        <header className="mb-stack-lg">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">
            Security Settings
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Manage your account security and password preferences.
          </p>
        </header>

        {/* Change Password Card */}
        <div className="glass-panel p-stack-md md:p-stack-lg rounded-2xl glow-red">
          <h2 className="font-headline-md text-headline-md text-primary mb-stack-md">
            Change Password
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-error-container/20 border border-error-container text-error rounded-xl text-label-md flex items-center gap-2 animate-pulse">
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-tertiary-container/20 border border-tertiary-container text-tertiary rounded-xl text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-stack-md">

            {/* Current Password */}
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="current-password">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  id="current-password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-outline-variant rounded-xl px-4 py-4 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">
                    {showCurrent ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="new-password">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  id="new-password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-outline-variant rounded-xl px-4 py-4 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">
                    {showNew ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirm-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-outline-variant rounded-xl px-4 py-4 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-outline"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">
                    {showConfirm ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Requirements Grid */}
            <div className="bg-surface-container-low p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`flex items-center gap-2 transition-colors ${hasMinLength ? 'text-tertiary' : 'text-outline'}`}>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: hasMinLength ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {hasMinLength ? 'check_circle' : 'circle'}
                </span>
                <span className="font-label-sm text-label-sm">At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${hasNumber ? 'text-tertiary' : 'text-outline'}`}>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: hasNumber ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {hasNumber ? 'check_circle' : 'circle'}
                </span>
                <span className="font-label-sm text-label-sm">One number (0-9)</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${hasSpecial ? 'text-tertiary' : 'text-outline'}`}>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: hasSpecial ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {hasSpecial ? 'check_circle' : 'circle'}
                </span>
                <span className="font-label-sm text-label-sm">One special character</span>
              </div>
              <div className={`flex items-center gap-2 transition-colors ${isMatch ? 'text-tertiary' : 'text-outline'}`}>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isMatch ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isMatch ? 'check_circle' : 'circle'}
                </span>
                <span className="font-label-sm text-label-sm">Passwords must match</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !allMet}
                className="flex-1 bg-primary-container disabled:bg-primary-container/30 disabled:text-on-surface-variant/40 disabled:cursor-not-allowed hover:bg-inverse-primary text-on-primary-container font-label-md text-label-md py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-on-primary-container" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <span>Update Password</span>
              </button>
              <Link
                href="/dashboard"
                className="px-8 border border-outline-variant text-on-surface-variant hover:bg-white/5 font-label-md text-label-md py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                Cancel
              </Link>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
