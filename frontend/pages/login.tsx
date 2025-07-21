import React from 'react';
import LoginForm from '../src/components/auth/LoginForm';
import { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  return (
    <>
      <Toaster position="top-right" />
      <LoginForm />
    </>
  );
} 