'use client';

import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

function RegisterContent() {
  return <AuthForm initialMode="register" />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-on-surface-variant font-semibold">Loading auth...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
