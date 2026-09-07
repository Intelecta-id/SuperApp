'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../views/DashboardPage';
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function Home() {
  const router = useRouter();

  return (
    <AppLayout activeTab="dashboard">
      <ErrorBoundary>
        <DashboardPage
          onNavigate={(tab) => router.push(tab === 'dashboard' ? '/' : `/${tab}`)}
          onQuickCreate={() => router.push('/projects')}
        />
      </ErrorBoundary>
    </AppLayout>
  );
}
