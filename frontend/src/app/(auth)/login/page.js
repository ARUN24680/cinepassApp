'use client';

import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

function LoginContent() {
  return <AuthForm initialMode="login" />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-on-surface-variant font-semibold">Loading auth...</div>}>
      <LoginContent />
    </Suspense>
  );
}
