import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AttendanceView } from './components/AttendanceView';
import { ClassesView } from './components/ClassesView';
import { StudentsView } from './components/StudentsView';
import { GradesView } from './components/GradesView';
import { ScheduleView } from './components/ScheduleView';
import { CalendarView } from './components/CalendarView';
import { AvailabilityView } from './components/AvailabilityView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { AdminFinancialView } from './components/AdminFinancialView';
import { AuthScreen } from './components/AuthScreen';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'chamada':
        return <AttendanceView />;
      case 'turmas':
        return <ClassesView />;
      case 'alunos':
        return <StudentsView />;
      case 'notas':
        return <GradesView />;
      case 'horario':
        return <ScheduleView />;
      case 'calendario':
        return <CalendarView />;
      case 'disponibilidade':
        return <AvailabilityView />;
      case 'notificacoes':
        return <NotificationsView />;
      case 'perfil':
        return <ProfileView />;
      case 'admin_financeiro':
      case 'admin_transacoes':
        return <AdminFinancialView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header />

      <div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
