import React from 'react';
import ProfilePage from '../src/components/profile/ProfilePage';
import { Toaster } from 'react-hot-toast';

export default function ProfilePageWrapper() {
  return (
    <>
      <Toaster position="top-right" />
      <ProfilePage />
    </>
  );
} 