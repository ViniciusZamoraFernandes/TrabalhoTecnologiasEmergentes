import React from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, ArrowLeftRight, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { professorProfile, currentRole, setCurrentRole, setActiveTab, logout } = useApp();

  return (
    <header className="w-full bg-[#B91C1C] text-white shadow-md z-30 sticky top-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logotipo UniClass */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-95 transition-opacity font-sans"
          >
            UniClass
          </button>
        </div>

        {/* Perfil do Usuário e Alternador de Papel */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Alternador de Perfil (Para demonstrar isolamento com Admin) */}
          <div className="hidden sm:flex items-center bg-black/20 rounded-full p-1 border border-white/10 text-xs">
            <button
              onClick={() => {
                setCurrentRole('professor');
                setActiveTab('dashboard');
              }}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                currentRole === 'professor'
                  ? 'bg-white text-[#B91C1C] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Professor
            </button>
            <button
              onClick={() => {
                setCurrentRole('admin');
                setActiveTab('admin_financeiro');
              }}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Nome e Avatar do Usuário */}
          <button
            onClick={() => setActiveTab('perfil')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            title="Meu Perfil"
          >
            <span className="text-sm font-semibold tracking-wide hidden sm:inline-block">
              {currentRole === 'professor' ? professorProfile.name : 'Administrador'}
            </span>
            <div className="w-9 h-9 rounded-full bg-white text-[#B91C1C] flex items-center justify-center font-bold shadow-sm ring-2 ring-white/30">
              <User className="w-5 h-5 fill-current" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
