'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import FinancialPage from '../../views/FinancialPage';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function FinancialRoute() {
  return (
    <AppLayout activeTab="financial">
      <ErrorBoundary>
        <FinancialPage />
      </ErrorBoundary>
    </AppLayout>
  );
}
