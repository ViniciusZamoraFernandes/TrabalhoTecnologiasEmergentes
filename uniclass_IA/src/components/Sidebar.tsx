import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Home,
  GraduationCap,
  ListChecks,
  FileText,
  Settings,
  LogOut,
  Calendar,
  Award,
  DollarSign,
  Receipt,
  Users,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, unreadCount, logout } = useApp();

  if (currentRole === 'admin') {
    return (
      <aside className="w-64 bg-[#0B253A] text-white rounded-3xl p-4 flex flex-col justify-between shadow-xl shrink-0 h-[calc(100vh-6.5rem)] sticky top-20">
        <div className="space-y-4">
          <div className="px-3 py-2 border-b border-white/10">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Painel Restrito
            </span>
            <span className="text-sm font-bold text-white">Administrador</span>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('admin_financeiro')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'admin_financeiro'
                  ? 'bg-white text-[#0B253A] shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Situação Financeira</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_transacoes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'admin_transacoes'
                  ? 'bg-white text-[#0B253A] shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Transações Alunos</span>
            </button>
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-[#D90429] hover:bg-[#b50322] text-white shadow-md transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    );
  }

  // Sidebar do Professor (Fiel ao Protótipo das Imagens)
  return (
    <aside className="w-60 bg-[#0B253A] text-white rounded-3xl p-4 flex flex-col justify-between shadow-xl shrink-0 min-h-[580px] sticky top-20">
      {/* Itens Principais do Menu */}
      <div className="space-y-2">
        <nav className="space-y-2">
          {/* Notificações */}
          <button
            onClick={() => setActiveTab('notificacoes')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all relative ${
              activeTab === 'notificacoes'
                ? 'bg-white text-[#0B253A] shadow-md'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notificações</span>
            {unreadCount > 0 && (
              <span className="ml-auto w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#0B253A]" />
            )}
          </button>

          {/* Tela Inicial */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#0B253A] shadow-md'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Tela Inicial</span>
          </button>

          {/* Turmas */}
          <button
            onClick={() => setActiveTab('turmas')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'turmas'
                ? 'bg-white text-[#0B253A] shadow-md'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Turmas</span>
          </button>

          {/* Chamada (Prioridade Máxima) */}
          <button
            onClick={() => setActiveTab('chamada')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'chamada'
                ? 'bg-white text-[#0B253A] shadow-md'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>Chamada</span>
          </button>

          {/* Documentos / Notas / Alunos / Calendário */}
          <button
            onClick={() => setActiveTab('alunos')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'alunos' || activeTab === 'notas' || activeTab === 'calendario'
                ? 'bg-white text-[#0B253A] shadow-md'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documentos</span>
          </button>
        </nav>
      </div>

      {/* Seção Inferior: Configurações e Sair */}
      <div className="space-y-3 pt-4">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'perfil' || activeTab === 'disponibilidade'
              ? 'bg-white/20 text-white'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-[#D90429] hover:bg-[#b50322] text-white shadow-md transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};
