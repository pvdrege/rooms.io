import React from 'react';
import RegisterForm from '../src/components/auth/RegisterForm';
import { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  return (
    <>
      <Toaster position="top-right" />
      <RegisterForm />
    </>
  );
} 