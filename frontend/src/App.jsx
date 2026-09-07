import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ApiProvider } from './contexts/ApiContext';
import { ChatProvider } from './contexts/ChatContext';
import AppLayout from './components/layout/AppLayout';

import DashboardPage from './views/DashboardPage';
import OmnichannelPage from './views/OmnichannelPage';
import ClientsPage from './views/ClientsPage';
import ProjectsPage from './views/ProjectsPage';
import FinancialPage from './views/FinancialPage';
import TeamPage from './views/TeamPage';
import HelpdeskPage from './views/HelpdeskPage';
import SettingsPage from './views/SettingsPage';
import LoginPage from './views/LoginPage';

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
