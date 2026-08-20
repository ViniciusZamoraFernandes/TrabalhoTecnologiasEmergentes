import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AcademicCalendarEvent } from '../types';
import {
  Calendar,
  CalendarDays,
  Tag,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { calendarEvents } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'lista' | 'mensal'>('lista');

  const filteredEvents = calendarEvents.filter((ev) => {
    if (selectedCategory === 'all') return true;
    return ev.type === selectedCategory;
  });

  const getEventBadge = (type: AcademicCalendarEvent['type']) => {
    switch (type) {
      case 'prova':
        return { label: 'Avaliações / Provas', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'conselho':
        return { label: 'Conselho de Classe', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'letivo':
        return { label: 'Dia Letivo / Evento', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'feriado':
        return { label: 'Feriado Nacional', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'recesso':
        return { label: 'Recesso Escolar', bg: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'reuniao':
        return { label: 'Reunião Pedagógica', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      default:
        return { label: 'Evento', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              RF-61
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Ano Letivo 2026</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-indigo-600" />
            <span>Calendário Acadêmico</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulte as datas de avaliações, conselhos de classe, recessos, feriados e reuniões pedagógicas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('lista')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'lista'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Lista de Eventos
          </button>
          <button
            onClick={() => setViewMode('mensal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mensal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mês de Agosto/2026
          </button>
        </div>
      </div>

      {/* Filtros de Categorias */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Filtrar:
        </span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todos os Eventos ({calendarEvents.length})
        </button>
        <button
          onClick={() => setSelectedCategory('prova')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'prova'
              ? 'bg-rose-600 text-white'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          Provas & Avaliações
        </button>
        <button
          onClick={() => setSelectedCategory('conselho')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'conselho'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          Conselho de Classe
        </button>
        <button
          onClick={() => setSelectedCategory('feriado')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'feriado'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          Feriados & Recessos
        </button>
      </div>

      {/* Exibição em Lista de Eventos */}
      {viewMode === 'lista' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((event) => {
              const badge = getEventBadge(event.type);

              return (
                <div
                  key={event.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {event.isImportant && (
                        <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Importante
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{event.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-indigo-600" />
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {event.endDate && (
                        <span>
                          {' '}até {new Date(event.endDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Visualização em Grade Mensal (Agosto 2026) */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Agosto de 2026</h3>
            <span className="text-xs font-medium text-slate-500">2º Semestre Letivo</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Dias de Agosto 2026 (1º de agosto foi sábado) */}
            <div className="p-3 bg-slate-50 rounded-xl text-slate-300 text-xs"></div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-300 text-xs"></div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-300 text-xs"></div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-300 text-xs"></div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-300 text-xs"></div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-300 text-xs"></div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">1</div>

            <div className="p-3 bg-slate-50 rounded-xl text-slate-400 text-xs">2</div>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900">
              3 <span className="block text-[9px] font-normal">Início Aulas</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">4</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">5</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">6</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">7</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">8</div>

            <div className="p-3 bg-slate-50 rounded-xl text-slate-400 text-xs">9</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">10</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">11</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">12</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">13</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">14</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">15</div>

            <div className="p-3 bg-slate-50 rounded-xl text-slate-400 text-xs">16</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">17</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">18</div>
            {/* Hoje - 19 */}
            <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs">
              19 <span className="block text-[9px] font-medium">Hoje</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">20</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">21</div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">22</div>

            <div className="p-3 bg-slate-50 rounded-xl text-slate-400 text-xs">23</div>
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold">
              24 <span className="block text-[9px] font-normal">AV1</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold">
              25 <span className="block text-[9px] font-normal">AV1</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold">
              26 <span className="block text-[9px] font-normal">AV1</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold">
              27 <span className="block text-[9px] font-normal">AV1</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold">
              28 <span className="block text-[9px] font-normal">AV1</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-bold">29</div>
          </div>
        </div>
      )}
    </div>
  );
};
