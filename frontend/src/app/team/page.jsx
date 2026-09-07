'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import TeamPage from '../../views/TeamPage';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function TeamRoute() {
  return (
    <AppLayout activeTab="team">
      <ErrorBoundary>
        <TeamPage />
      </ErrorBoundary>
    </AppLayout>
  );
}
