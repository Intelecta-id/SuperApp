import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ApiProvider } from './contexts/ApiContext';
import { ChatProvider } from './contexts/ChatContext';
import AppLayout from './components/layout/AppLayout';

import DashboardPage from './pages/DashboardPage';
import OmnichannelPage from './pages/OmnichannelPage';
import ClientsPage from './pages/ClientsPage';
import ProjectsPage from './pages/ProjectsPage';
import FinancialPage from './pages/FinancialPage';
import TeamPage from './pages/TeamPage';
import HelpdeskPage from './pages/HelpdeskPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

import ErrorBoundary from './components/common/ErrorBoundary';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(tab) => setActiveTab(tab)}
            onQuickCreate={() => setActiveTab('projects')}
          />
        );
      case 'omnichannel':
        return <OmnichannelPage />;
      case 'clients':
        return <ClientsPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'financial':
        return <FinancialPage />;
      case 'team':
        return <TeamPage />;
      case 'helpdesk':
        return <HelpdeskPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <ErrorBoundary key={activeTab}>
        {renderActivePage()}
      </ErrorBoundary>
    </AppLayout>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ApiProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </ApiProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
