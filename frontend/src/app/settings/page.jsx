'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import SettingsPage from '../../views/SettingsPage';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function SettingsRoute() {
  return (
    <AppLayout activeTab="settings">
      <ErrorBoundary>
        <SettingsPage />
      </ErrorBoundary>
    </AppLayout>
  );
}
