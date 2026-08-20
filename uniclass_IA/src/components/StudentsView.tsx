import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  BookOpen,
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { students, classes } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Tela de Alunos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              RF-70
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Corpo Discente</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            <span>Alunos Matriculados</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualização completa de todos os alunos registrados nas turmas em que você leciona.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start md:self-auto">
          <span>Total de Alunos:</span>
          <strong className="text-indigo-700 font-bold">{students.length}</strong>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros de Turma */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar aluno por nome, matrícula ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 w-full sm:w-auto"
          >
            <option value="all">Todas as Turmas ({students.length})</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela / Grid de Alunos (RF-70) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Exibindo {filteredStudents.length} de {students.length} alunos
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Nenhum aluno encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {student.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        Matrícula: {student.registration}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-indigo-700">{student.className}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 self-end sm:self-center">
                  {/* Frequência Geral */}
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-semibold text-slate-400">Freq. Geral</p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold ${
                        student.overallAttendanceRate >= 85
                          ? 'text-emerald-700'
                          : student.overallAttendanceRate >= 75
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {student.overallAttendanceRate >= 85 ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      {student.overallAttendanceRate}%
                    </span>
                  </div>

                  {/* Botão de Visualização Rápida */}
                  <button
                    onClick={() => setSelectedStudentDetail(student)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detalhes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Aluno */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedStudentDetail(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={selectedStudentDetail.avatarUrl}
                alt={selectedStudentDetail.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedStudentDetail.name}</h3>
                <p className="text-xs text-indigo-700 font-medium">{selectedStudentDetail.className}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Matrícula: {selectedStudentDetail.registration}
                </p>
              </div>
            </div>

            <div className="space-y-3 py-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 space-y-2">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Informações de Contato e Responsável
                </p>
                <div className="flex items-center gap-2 text-slate-600">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>Responsável: <strong>{selectedStudentDetail.responsibleName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>E-mail: {selectedStudentDetail.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Telefone: {selectedStudentDetail.phone}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 text-indigo-950 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs">Frequência Escolar Acumulada</p>
                  <p className="text-[11px] text-slate-500">Média geral nas aulas de matemática</p>
                </div>
                <span className="text-base font-bold text-indigo-700">
                  {selectedStudentDetail.overallAttendanceRate}%
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
