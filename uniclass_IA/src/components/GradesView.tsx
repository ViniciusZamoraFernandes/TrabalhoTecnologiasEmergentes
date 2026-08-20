import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ClassGrades, GradeItem } from '../types';
import {
  Award,
  Save,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Calculator,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const GradesView: React.FC = () => {
  const { classes, classGrades, saveClassGrades, getStudentsByClass } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2º Bimestre 2026');
  const [currentGradesList, setCurrentGradesList] = useState<GradeItem[]>([]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const studentsInClass = getStudentsByClass(selectedClassId);

  // Carrega notas da turma ou inicializa para os alunos existentes
  useEffect(() => {
    if (!selectedClassId) return;

    const existing = classGrades[selectedClassId];
    if (existing && existing.grades.length > 0) {
      setCurrentGradesList(existing.grades);
    } else {
      // Cria registros em branco
      const initial: GradeItem[] = studentsInClass.map((student) => ({
        id: `grd-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        registration: student.registration,
        scores: {
          av1: null,
          av2: null,
          simulado: null,
          recuperacao: null,
        },
        finalAverage: null,
        status: 'Cursando',
      }));
      setCurrentGradesList(initial);
    }
  }, [selectedClassId, classGrades, studentsInClass]);

  // Função para recalcular média ponderada: (AV1*4 + AV2*4 + Simulado*2)/10
  const calculateAverage = (av1: number | null, av2: number | null, simulado: number | null, rec?: number | null) => {
    if (av1 === null && av2 === null && simulado === null) return { avg: null, status: 'Cursando' as const };

    const val1 = av1 ?? 0;
    const val2 = av2 ?? 0;
    const valSim = simulado ?? 0;

    let baseAvg = (val1 * 4 + val2 * 4 + valSim * 2) / 10;
    baseAvg = Math.round(baseAvg * 10) / 10;

    if (rec !== null && rec !== undefined && rec > baseAvg) {
      baseAvg = Math.round(((baseAvg + rec) / 2) * 10) / 10;
    }

    let status: 'Aprovado' | 'Em Recuperação' | 'Reprovado' | 'Cursando' = 'Cursando';
    if (av1 !== null && av2 !== null) {
      if (baseAvg >= 6.0) {
        status = 'Aprovado';
      } else if (baseAvg >= 4.0) {
        status = 'Em Recuperação';
      } else {
        status = 'Reprovado';
      }
    }

    return { avg: baseAvg, status };
  };

  const handleScoreChange = (
    studentId: string,
    field: 'av1' | 'av2' | 'simulado' | 'recuperacao',
    valueStr: string
  ) => {
    const numericValue = valueStr === '' ? null : Math.min(10, Math.max(0, parseFloat(valueStr)));

    setCurrentGradesList((prev) =>
      prev.map((item) => {
        if (item.studentId !== studentId) return item;

        const updatedScores = {
          ...item.scores,
          [field]: isNaN(numericValue as number) ? null : numericValue,
        };

        const { avg, status } = calculateAverage(
          updatedScores.av1,
          updatedScores.av2,
          updatedScores.simulado,
          updatedScores.recuperacao
        );

        return {
          ...item,
          scores: updatedScores,
          finalAverage: avg,
          status,
        };
      })
    );
  };

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    const payload: ClassGrades = {
      classId: selectedClass.id,
      className: selectedClass.name,
      subject: selectedClass.subject,
      academicPeriod: selectedPeriod,
      weightConfig: {
        av1Weight: 4,
        av2Weight: 4,
        simuladoWeight: 2,
        minimumPassingGrade: 6.0,
      },
      grades: currentGradesList,
      lastUpdated: new Date().toISOString(),
    };

    saveClassGrades(selectedClass.id, payload);
  };

  // Estatísticas da Turma
  const scoredCount = currentGradesList.filter((g) => g.finalAverage !== null).length;
  const approvedCount = currentGradesList.filter((g) => g.status === 'Aprovado').length;
  const recoveryCount = currentGradesList.filter((g) => g.status === 'Em Recuperação').length;
  const failedCount = currentGradesList.filter((g) => g.status === 'Reprovado').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              RF-67
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Lançamento de Avaliações</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Award className="w-7 h-7 text-indigo-600" />
            <span>Lançamento de Notas e Avaliações</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lance as notas das avaliações bimestrais com cálculo automático de média e situação do aluno.
          </p>
        </div>

        <button
          onClick={handleSaveGrades}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Notas da Turma</span>
        </button>
      </div>

      {/* Parâmetros de Seleção e Pesos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Turma */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Turma Selecionada</span>
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.subject})
              </option>
            ))}
          </select>
        </div>

        {/* Período Letivo */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bimestre / Etapa</span>
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1º Bimestre 2026">1º Bimestre 2026 (Encerrado)</option>
            <option value="2º Bimestre 2026">2º Bimestre 2026 (Vigente)</option>
            <option value="3º Bimestre 2026">3º Bimestre 2026 (Futuro)</option>
            <option value="4º Bimestre 2026">4º Bimestre 2026 (Futuro)</option>
          </select>
        </div>

        {/* Regra de Cálculo */}
        <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 flex flex-col justify-center text-xs text-indigo-900">
          <p className="font-bold flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Fórmula de Cálculo da Média</span>
          </p>
          <p className="text-[11px] text-slate-600 mt-1">
            Média = <strong className="text-indigo-800">(AV1 × 4 + AV2 × 4 + Simulado × 2) / 10</strong>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Média Mínima para Aprovação: 6.0</p>
        </div>
      </div>

      {/* Tabela de Lançamento de Notas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {selectedClass?.name} • {selectedPeriod}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {approvedCount} Aprovados
            </span>
            <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {recoveryCount} Recuperação
            </span>
            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              {failedCount} Reprovados
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Aluno / Matrícula</th>
                <th className="py-3 px-3 text-center w-24">AV1 (Peso 4)</th>
                <th className="py-3 px-3 text-center w-24">AV2 (Peso 4)</th>
                <th className="py-3 px-3 text-center w-24">Simulado (Peso 2)</th>
                <th className="py-3 px-3 text-center w-24">Recup.</th>
                <th className="py-3 px-4 text-center w-24">Média Final</th>
                <th className="py-3 px-4 text-center w-32">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentGradesList.map((item, index) => (
                <tr key={item.studentId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{item.studentName}</p>
                    <p className="text-[11px] text-slate-400">Mat: {item.registration}</p>
                  </td>

                  {/* AV1 */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={item.scores.av1 ?? ''}
                      onChange={(e) => handleScoreChange(item.studentId, 'av1', e.target.value)}
                      placeholder="0.0"
                      className="w-16 px-2 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </td>

                  {/* AV2 */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={item.scores.av2 ?? ''}
                      onChange={(e) => handleScoreChange(item.studentId, 'av2', e.target.value)}
                      placeholder="0.0"
                      className="w-16 px-2 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </td>

                  {/* Simulado */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={item.scores.simulado ?? ''}
                      onChange={(e) => handleScoreChange(item.studentId, 'simulado', e.target.value)}
                      placeholder="0.0"
                      className="w-16 px-2 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </td>

                  {/* Recuperação */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={item.scores.recuperacao ?? ''}
                      onChange={(e) => handleScoreChange(item.studentId, 'recuperacao', e.target.value)}
                      placeholder="-"
                      className="w-16 px-2 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
                    />
                  </td>

                  {/* Média */}
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-bold text-slate-900">
                      {item.finalAverage !== null ? item.finalAverage.toFixed(1) : '-'}
                    </span>
                  </td>

                  {/* Situação */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'Aprovado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Em Recuperação'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Reprovado'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé com botão de salvar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Lembre-se de salvar suas alterações para persistir as notas no diário eletrônico.
          </p>
          <button
            onClick={handleSaveGrades}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Notas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
