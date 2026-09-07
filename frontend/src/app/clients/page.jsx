'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import ClientsPage from '../../views/ClientsPage';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function ClientsRoute() {
  return (
    <AppLayout activeTab="clients">
      <ErrorBoundary>
        <ClientsPage />
      </ErrorBoundary>
    </AppLayout>
  );
}
