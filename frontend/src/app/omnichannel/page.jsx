'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OmnichannelPage from '../../views/OmnichannelPage';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function OmnichannelRoute() {
  return (
    <AppLayout activeTab="omnichannel">
      <ErrorBoundary>
        <OmnichannelPage />
      </ErrorBoundary>
    </AppLayout>
  );
}
