'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import ProjectsPage from '../../views/ProjectsPage';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function ProjectsRoute() {
  return (
    <AppLayout activeTab="projects">
      <ErrorBoundary>
        <ProjectsPage />
      </ErrorBoundary>
    </AppLayout>
  );
}
