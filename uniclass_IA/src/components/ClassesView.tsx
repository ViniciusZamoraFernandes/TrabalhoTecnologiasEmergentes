import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Search,
  Users,
  Clock,
  MapPin,
  ClipboardCheck,
  Award,
  ArrowRight,
  BookOpen,
  Filter,
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { classes, searchClasses, getStudentsByClass, quickStartAttendance, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('all');

  const filteredClasses = searchClasses(searchQuery).filter((c) => {
    if (selectedGradeFilter === 'all') return true;
    return c.gradeLevel.toLowerCase().includes(selectedGradeFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Tela de Turmas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              RF-64 & RF-66
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Docência Ativa</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-600" />
            <span>Minhas Turmas e Disciplinas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulte todas as turmas em que você leciona, acesse a chamada ou lance notas rapidamente.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start md:self-auto">
          <span>Total de Turmas:</span>
          <strong className="text-indigo-700 font-bold">{classes.length}</strong>
        </div>
      </div>

      {/* Barra de Pesquisa de Turmas (RF-66) e Filtros */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar turma por nome, código (ex.: 9EF-A), disciplina ou sala..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedGradeFilter}
            onChange={(e) => setSelectedGradeFilter(e.target.value)}
            className="px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 w-full sm:w-auto"
          >
            <option value="all">Todos os Níveis</option>
            <option value="fundamental">Ensino Fundamental II</option>
            <option value="médio">Ensino Médio</option>
          </select>
        </div>
      </div>

      {/* Grid de Cards das Turmas (RF-64) */}
      {filteredClasses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">Nenhuma turma encontrada</p>
          <p className="text-xs text-slate-500 mt-1">Tente ajustar os termos da barra de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((item) => {
            const studentsInThisClass = getStudentsByClass(item.id);

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-900 text-white">
                      {item.code}
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.gradeLevel}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3 tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{item.subject}</span>
                  </p>

                  <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.scheduleDescription}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{studentsInThisClass.length} alunos cadastrados</span>
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas por Turma */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => quickStartAttendance(item.id)}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Chamada</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notas')}
                    className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Notas</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
