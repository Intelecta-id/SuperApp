'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import HelpdeskPage from '../../views/HelpdeskPage';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function HelpdeskRoute() {
  return (
    <AppLayout activeTab="helpdesk">
      <ErrorBoundary>
        <HelpdeskPage />
      </ErrorBoundary>
    </AppLayout>
  );
}
