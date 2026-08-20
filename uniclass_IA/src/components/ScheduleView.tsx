import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Calendar,
  MapPin,
  ClipboardCheck,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { schedule, quickStartAttendance } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('Segunda-feira');

  const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];

  const classesForSelectedDay = schedule
    .filter((s) => s.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              RF-65
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Grade Semanal</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-600" />
            <span>Horário Semanal de Aulas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulte a distribuição de suas aulas ao longo da semana e acesse a chamada diretamente.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start md:self-auto">
          <span>Carga Horária Semanal:</span>
          <strong className="text-indigo-700 font-bold">{schedule.length} horas-aula</strong>
        </div>
      </div>

      {/* Seletor de Dia da Semana */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {daysOfWeek.map((day) => {
          const isToday = day === 'Segunda-feira'; // Dia padrão demonstrativo
          const isSelected = selectedDay === day;
          const classCount = schedule.filter((s) => s.dayOfWeek === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{day}</span>
                {isToday && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                    } animate-ping`}
                  />
                )}
              </div>
              <span className={`text-[10px] font-normal ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {classCount} aulas agendadas
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista de Aulas do Dia Selecionado */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Aulas de {selectedDay}</span>
            {selectedDay === 'Segunda-feira' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Dia de Hoje
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-500">{classesForSelectedDay.length} aulas</span>
        </div>

        {classesForSelectedDay.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Nenhuma aula cadastrada para {selectedDay}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classesForSelectedDay.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-indigo-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {item.startTime} - {item.endTime}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Aula {idx + 1}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">{item.className}</h3>
                  <p className="text-xs font-semibold text-indigo-700 mt-0.5">{item.subject}</p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.room}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => quickStartAttendance(item.classId)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Fazer Chamada desta Turma</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grade Semanal Completa em Formato de Tabela Resumida */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Visão Geral da Grade Horária
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Horário</th>
                <th className="py-2.5 px-3">Segunda</th>
                <th className="py-2.5 px-3">Terça</th>
                <th className="py-2.5 px-3">Quarta</th>
                <th className="py-2.5 px-3">Quinta</th>
                <th className="py-2.5 px-3">Sexta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-bold text-slate-700">07:30 - 09:10</td>
                <td className="py-3 px-3 bg-indigo-50/50 text-indigo-900 font-medium rounded">
                  9º Ano A (Matemática)
                </td>
                <td className="py-3 px-3 bg-rose-50/50 text-rose-900 font-medium rounded">
                  3º Ano A (Pré-ENEM)
                </td>
                <td className="py-3 px-3 bg-indigo-50/50 text-indigo-900 font-medium rounded">
                  9º Ano A (Matemática)
                </td>
                <td className="py-3 px-3 bg-rose-50/50 text-rose-900 font-medium rounded">
                  3º Ano A (Pré-ENEM)
                </td>
                <td className="py-3 px-3 text-slate-400 italic">-</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-bold text-slate-700">09:30 - 11:10</td>
                <td className="py-3 px-3 bg-indigo-50/50 text-indigo-900 font-medium rounded">
                  1º Ano A (Matemática)
                </td>
                <td className="py-3 px-3 bg-blue-50/50 text-blue-900 font-medium rounded">
                  9º Ano B (Matemática)
                </td>
                <td className="py-3 px-3 text-slate-400 italic">-</td>
                <td className="py-3 px-3 bg-blue-50/50 text-blue-900 font-medium rounded">
                  9º Ano B (Matemática)
                </td>
                <td className="py-3 px-3 bg-indigo-50/50 text-indigo-900 font-medium rounded">
                  1º Ano A (Matemática)
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-bold text-slate-700">11:20 - 13:00</td>
                <td className="py-3 px-3 bg-amber-50/50 text-amber-900 font-medium rounded">
                  2º Ano C (Geometria)
                </td>
                <td className="py-3 px-3 text-slate-400 italic">-</td>
                <td className="py-3 px-3 bg-amber-50/50 text-amber-900 font-medium rounded">
                  2º Ano C (Geometria)
                </td>
                <td className="py-3 px-3 text-slate-400 italic">-</td>
                <td className="py-3 px-3 bg-amber-50/50 text-amber-900 font-medium rounded">
                  2º Ano C (Geometria)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
