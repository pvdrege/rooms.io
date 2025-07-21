import React from 'react';
import DiscoveryPage from '../src/components/discovery/DiscoveryPage';
import { Toaster } from 'react-hot-toast';

export default function DiscoveryPageWrapper() {
  return (
    <>
      <Toaster position="top-right" />
      <DiscoveryPage />
    </>
  );
} 