import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  ShieldCheck,
  CreditCard,
  Building,
  ArrowLeftRight,
} from 'lucide-react';

export const AdminFinancialView: React.FC = () => {
  const {
    adminFinancialRecords,
    adminTransactions,
    setCurrentRole,
    setActiveTab,
    activeTab,
  } = useApp();

  const [searchStudent, setSearchStudent] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'situacao' | 'transacoes'>(
    activeTab === 'admin_transacoes' ? 'transacoes' : 'situacao'
  );

  const filteredFinancials = adminFinancialRecords.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      rec.registration.toLowerCase().includes(searchStudent.toLowerCase()) ||
      rec.className.toLowerCase().includes(searchStudent.toLowerCase());

    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = adminTransactions.filter((trx) => {
    return (
      trx.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      trx.transactionCode.toLowerCase().includes(searchStudent.toLowerCase()) ||
      trx.registration.toLowerCase().includes(searchStudent.toLowerCase())
    );
  });

  // Métricas financeiras
  const totalStudents = adminFinancialRecords.length;
  const inGoodStandingCount = adminFinancialRecords.filter((r) => r.status === 'Em Dia').length;
  const overdueCount = adminFinancialRecords.filter((r) => r.status === 'Em Atraso').length;
  const pendingCount = adminFinancialRecords.filter((r) => r.status === 'Pendente').length;
  const totalOverdueAmount = adminFinancialRecords.reduce((acc, curr) => acc + curr.totalOverdueAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner de Aviso de Área Restrita ao Administrador */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-amber-900">
              Área Exclusiva da Administração Escolar (RF-74 & RF-75)
            </h3>
            <p className="text-xs text-amber-800">
              Este módulo é estritamente separado do perfil do Professor e contém a gestão financeira de mensalidades e transações.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentRole('professor');
            setActiveTab('dashboard');
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Voltar ao Portal do Professor</span>
        </button>
      </div>

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Módulo Administrativo
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Tesouraria & Finanças</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-amber-600" />
            <span>Gestão Financeira dos Alunos</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulte a situação das mensalidades (RF-74) e o histórico de transações de pagamento (RF-75).
          </p>
        </div>

        {/* Alternador de Sub-Abas */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveAdminSubTab('situacao')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminSubTab === 'situacao'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>Situação Financeira (RF-74)</span>
          </button>
          <button
            onClick={() => setActiveAdminSubTab('transacoes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminSubTab === 'transacoes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4 text-indigo-600" />
            <span>Transações (RF-75)</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas Financeiras */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Alunos em Dia</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{inGoodStandingCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sem pendências</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Mensalidades em Aberto</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">A vencer no mês</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Alunos em Atraso</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{overdueCount}</p>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">Cobrança ativa</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total em Atraso</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            R$ {totalOverdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Débitos acumulados</p>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="Buscar por aluno, matrícula, turma ou código de transação..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {activeAdminSubTab === 'situacao' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 bg-slate-50 text-slate-700 w-full sm:w-auto"
            >
              <option value="all">Todos os Status</option>
              <option value="Em Dia">Em Dia</option>
              <option value="Pendente">Pendente</option>
              <option value="Em Atraso">Em Atraso</option>
            </select>
          </div>
        )}
      </div>

      {/* CONTEÚDO RF-74: SITUAÇÃO FINANCEIRA DOS ALUNOS */}
      {activeAdminSubTab === 'situacao' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Situação de Mensalidades por Aluno (RF-74)</span>
            </h3>
            <span className="text-xs text-slate-500">{filteredFinancials.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Aluno / Matrícula</th>
                  <th className="py-3 px-4">Turma</th>
                  <th className="py-3 px-4">Responsável Financeiro</th>
                  <th className="py-3 px-3 text-right">Mensalidade</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Meses Pendentes/Atraso</th>
                  <th className="py-3 px-4 text-right">Valor em Atraso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFinancials.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{rec.studentName}</p>
                      <p className="text-[11px] text-slate-400">Mat: {rec.registration}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{rec.className}</td>
                    <td className="py-3.5 px-4 text-slate-600">{rec.responsibleName}</td>
                    <td className="py-3.5 px-3 text-right font-semibold text-slate-900">
                      R$ {rec.monthlyFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          rec.status === 'Em Dia'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'Pendente'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {rec.unpaidMonths.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {rec.unpaidMonths.map((m) => (
                            <span
                              key={m}
                              className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold text-[10px]"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-medium">Nenhum</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {rec.totalOverdueAmount > 0 ? (
                        <span className="text-rose-600">
                          R$ {rec.totalOverdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-emerald-600">R$ 0,00</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO RF-75: TRANSAÇÕES DE PAGAMENTO REALIZADAS PELOS ALUNOS */}
      {activeAdminSubTab === 'transacoes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-600" />
              <span>Transações de Pagamento Registradas (RF-75)</span>
            </h3>
            <span className="text-xs text-slate-500">{filteredTransactions.length} transações</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">ID da Transação</th>
                  <th className="py-3 px-4">Aluno Relacionado</th>
                  <th className="py-3 px-4">Turma</th>
                  <th className="py-3 px-3">Forma de Pagamento</th>
                  <th className="py-3 px-3 text-right">Valor</th>
                  <th className="py-3 px-4">Data e Hora</th>
                  <th className="py-3 px-4 text-center">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {trx.transactionCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{trx.studentName}</p>
                      <p className="text-[11px] text-slate-400">Mat: {trx.registration}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{trx.className}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">{trx.paymentMethod}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                      R$ {trx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{trx.date}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          trx.status === 'Concluído'
                            ? 'bg-emerald-100 text-emerald-800'
                            : trx.status === 'Processando'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
