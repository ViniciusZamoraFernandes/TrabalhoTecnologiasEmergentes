import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAvailabilityForm } from '../types';
import {
  SlidersHorizontal,
  Save,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

export const AvailabilityView: React.FC = () => {
  const { teacherAvailability, saveTeacherAvailability } = useApp();
  const [formData, setFormData] = useState<TeacherAvailabilityForm>(teacherAvailability);

  const handleToggleDay = (dayIndex: number) => {
    setFormData((prev) => {
      const updatedDays = [...prev.dayPreferences];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        available: !updatedDays[dayIndex].available,
      };
      return { ...prev, dayPreferences: updatedDays };
    });
  };

  const handleToggleShift = (dayIndex: number, shift: 'Manhã' | 'Tarde' | 'Noite') => {
    setFormData((prev) => {
      const updatedDays = [...prev.dayPreferences];
      const currentShifts = updatedDays[dayIndex].shift;
      const exists = currentShifts.includes(shift);

      const newShifts = exists
        ? currentShifts.filter((s) => s !== shift)
        : [...currentShifts, shift];

      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        shift: newShifts,
      };
      return { ...prev, dayPreferences: updatedDays };
    });
  };

  const handleDayNotesChange = (dayIndex: number, text: string) => {
    setFormData((prev) => {
      const updatedDays = [...prev.dayPreferences];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        notes: text,
      };
      return { ...prev, dayPreferences: updatedDays };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTeacherAvailability(formData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              RF-62
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Planejamento Docente</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <SlidersHorizontal className="w-7 h-7 text-indigo-600" />
            <span>Disponibilidade e Preferências de Horário</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Defina seus dias, turnos e restrições para a elaboração da grade horária pela Coordenação.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Enviar Formulário</span>
        </button>
      </div>

      {formData.submittedAt && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Formulário Enviado com Sucesso</p>
            <p className="text-emerald-800">
              Última atualização em:{' '}
              {new Date(formData.submittedAt).toLocaleDateString('pt-BR')} às{' '}
              {new Date(formData.submittedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.
            </p>
          </div>
        </div>
      )}

      {/* Formulário Interativo */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bloco de Configurações Gerais */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Parâmetros de Carga Horária</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Período Acadêmico / Semestre
              </label>
              <input
                type="text"
                value={formData.academicSemester}
                onChange={(e) => setFormData({ ...formData, academicSemester: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Limite Máximo de Aulas por Dia
              </label>
              <select
                value={formData.maxClassesPerDay}
                onChange={(e) => setFormData({ ...formData, maxClassesPerDay: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value={3}>Até 3 aulas por dia</option>
                <option value={4}>Até 4 aulas por dia</option>
                <option value={5}>Até 5 aulas por dia</option>
                <option value={6}>Até 6 aulas por dia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grade de Dias da Semana */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Disponibilidade Dia a Dia</span>
            </h3>
            <span className="text-xs text-slate-500">Selecione turnos e observações</span>
          </div>

          <div className="space-y-3">
            {formData.dayPreferences.map((pref, idx) => (
              <div
                key={pref.dayOfWeek}
                className={`p-4 rounded-xl border transition-all ${
                  pref.available
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-slate-100/60 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`day-${idx}`}
                      checked={pref.available}
                      onChange={() => handleToggleDay(idx)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`day-${idx}`}
                      className="text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      {pref.dayOfWeek}
                    </label>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        pref.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pref.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>

                  {pref.available && (
                    <div className="flex items-center gap-2">
                      {(['Manhã', 'Tarde', 'Noite'] as const).map((shift) => {
                        const isSelected = pref.shift.includes(shift);
                        return (
                          <button
                            key={shift}
                            type="button"
                            onClick={() => handleToggleShift(idx, shift)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {shift}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {pref.available && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <input
                      type="text"
                      value={pref.notes}
                      onChange={(e) => handleDayNotesChange(idx, e.target.value)}
                      placeholder="Observação específica para este dia (ex.: preferência pelas primeiras aulas)..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Observações Gerais */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-slate-900">
            Observações Pedagógicas Gerais / Restrições Especiais
          </label>
          <textarea
            rows={3}
            value={formData.generalObservations}
            onChange={(e) => setFormData({ ...formData, generalObservations: e.target.value })}
            placeholder="Informe preferências didáticas, necessidades de deslocamento ou pós-graduação..."
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Salvar e Enviar Preferências</span>
          </button>
        </div>
      </form>
    </div>
  );
};
