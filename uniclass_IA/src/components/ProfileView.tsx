import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  ShieldCheck,
  Mail,
  Phone,
  BookOpen,
  Award,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { professorProfile, updateProfessorProfile, changePassword } = useApp();

  const [activeTab, setActiveTab] = useState<'dados' | 'senha'>('dados');

  // Formulário de Edição de Contato
  const [phone, setPhone] = useState(professorProfile.phone);
  const [email, setEmail] = useState(professorProfile.email);

  // Formulário de Senha (RF-58)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfessorProfile({ phone, email });
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        success: false,
        message: 'A nova senha e a confirmação de senha não coincidem.',
      });
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    setPasswordStatus(res);

    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              RF-57 & RF-58
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Cadastro do Docente</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-indigo-600" />
            <span>Meu Perfil e Segurança</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulte seus dados funcionais cadastrados e altere sua senha de acesso ao sistema.
          </p>
        </div>

        {/* Alternador de Abas */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('dados')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dados'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Dados Pessoais (RF-57)</span>
          </button>
          <button
            onClick={() => setActiveTab('senha')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'senha'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>Alterar Senha (RF-58)</span>
          </button>
        </div>
      </div>

      {activeTab === 'dados' ? (
        /* VISUALIZAÇÃO DE INFORMAÇÕES PESSOAIS (RF-57) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Principal do Professor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center space-y-4">
            <img
              src={professorProfile.avatarUrl}
              alt={professorProfile.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-50 shadow-md"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{professorProfile.name}</h2>
              <p className="text-xs font-semibold text-indigo-700 mt-0.5">{professorProfile.title}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                Matrícula: {professorProfile.registration}
              </span>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 text-left space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Departamento:</span>
                <p className="font-semibold text-slate-800">{professorProfile.department}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Disciplinas Ministradas:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {professorProfile.subjects.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-semibold text-[11px]"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dados Funcionais Detalhados e Atualização de Contato */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Informações Cadastrais Oficiais</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium">Nome Completo:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{professorProfile.name}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium">CPF:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{professorProfile.cpf}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium">Matrícula Funcional:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{professorProfile.registration}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium">Vínculo:</span>
                  <p className="font-bold text-emerald-700 mt-0.5">Docente Efetivo - 40h</p>
                </div>
              </div>

              {/* Formulário de Atualização de Contato */}
              <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700">Contatos Institucionais</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>E-mail Institucional</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Telefone / WhatsApp</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Contatos</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* ALTERAÇÃO DE SENHA NO PERFIL (RF-58) */
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-600" />
              <span>Alteração de Senha de Acesso (RF-58)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Para sua segurança, escolha uma senha forte contendo no mínimo 6 caracteres.
            </p>
          </div>

          {passwordStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                passwordStatus.success
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {passwordStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Digite sua senha atual (Padrão de teste: prof123)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Digite a nova senha (mínimo 6 caracteres)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repita a nova senha"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Atualizar Senha</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
