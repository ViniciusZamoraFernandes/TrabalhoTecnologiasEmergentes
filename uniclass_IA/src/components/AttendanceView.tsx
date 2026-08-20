import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus, StudentAttendanceRecord, AttendanceSheet } from '../types';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  Clock,
  Calendar,
  BookOpen,
  UserCheck,
  History,
  FileText,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCheck,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    classes,
    getStudentsByClass,
    selectedClassForAttendance,
    setSelectedClassForAttendance,
    attendanceSheets,
    saveAttendanceSheet,
    getTodayClasses,
  } = useApp();

  const todayClasses = getTodayClasses();
  const defaultClassId = selectedClassForAttendance || (todayClasses.length > 0 ? todayClasses[0].classId : classes[0]?.id || '');

  const [currentClassId, setCurrentClassId] = useState<string>(defaultClassId);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState<string>('07:30 - 09:10');
  const [classTopic, setClassTopic] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendanceRecord[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'realizar' | 'historico'>('realizar');
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [lastSavedInfo, setLastSavedInfo] = useState<{ time: string; topic: string; total: number; present: number } | null>(null);
  const [viewingHistoricalSheet, setViewingHistoricalSheet] = useState<AttendanceSheet | null>(null);

  const selectedClass = classes.find((c) => c.id === currentClassId);
  const studentsInClass = getStudentsByClass(currentClassId);

  // Sincroniza turma selecionada externamente
  useEffect(() => {
    if (selectedClassForAttendance) {
      setCurrentClassId(selectedClassForAttendance);
      setSelectedClassForAttendance(null);
    }
  }, [selectedClassForAttendance, setSelectedClassForAttendance]);

  // Carrega ou inicializa a lista de presença para a turma e data selecionada
  useEffect(() => {
    if (!currentClassId) return;

    const existingSheet = attendanceSheets.find(
      (s) => s.classId === currentClassId && s.date === selectedDate
    );

    if (existingSheet) {
      setAttendanceRecords(existingSheet.records);
      setClassTopic(existingSheet.classTopic || '');
      setObservations(existingSheet.observations || '');
      setScheduleTime(existingSheet.scheduleTime || '07:30 - 09:10');
      setLastSavedInfo({
        time: existingSheet.savedAt,
        topic: existingSheet.classTopic,
        total: existingSheet.records.length,
        present: existingSheet.records.filter((r) => r.status === 'presente').length,
      });
    } else {
      // Inicializa com todos os alunos da turma como "presente" por padrão para agilizar
      const initialRecords: StudentAttendanceRecord[] = studentsInClass.map((student) => ({
        studentId: student.id,
        studentName: student.name,
        registration: student.registration,
        status: 'presente',
      }));
      setAttendanceRecords(initialRecords);
      setClassTopic('');
      setObservations('');
      setLastSavedInfo(null);
    }
  }, [currentClassId, selectedDate, attendanceSheets, studentsInClass]);

  // Atualizar status de um aluno individual
  const handleToggleStatus = (studentId: string, newStatus: AttendanceStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => (rec.studentId === studentId ? { ...rec, status: newStatus } : rec))
    );
  };

  const handleUpdateNotes = (studentId: string, notes: string) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => (rec.studentId === studentId ? { ...rec, notes } : rec))
    );
  };

  // Ações em lote
  const handleMarkAll = (status: AttendanceStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        status,
      }))
    );
  };

  // Salvar a chamada (RF-68, RF-69)
  const handleSaveAttendance = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedClass) return;

    const presentCount = attendanceRecords.filter((r) => r.status === 'presente').length;

    saveAttendanceSheet({
      classId: selectedClass.id,
      className: selectedClass.name,
      subject: selectedClass.subject,
      date: selectedDate,
      scheduleTime,
      classTopic: classTopic.trim() || 'Aula regular e resolução de exercícios da disciplina.',
      observations: observations.trim(),
      records: attendanceRecords,
      isFinished: true,
    });

    setLastSavedInfo({
      time: new Date().toISOString(),
      topic: classTopic.trim() || 'Aula regular e resolução de exercícios da disciplina.',
      total: attendanceRecords.length,
      present: presentCount,
    });
  };

  // Métricas da chamada atual
  const totalStudents = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === 'presente').length;
  const absentCount = attendanceRecords.filter((r) => r.status === 'ausente').length;
  const justifiedCount = attendanceRecords.filter((r) => r.status === 'justificado').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const filteredRecords = attendanceRecords.filter(
    (rec) =>
      rec.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      rec.registration.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Seção de Chamada */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Fluxo Principal • RF-60, RF-68, RF-69
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-indigo-600">Prioridade Máxima</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-emerald-600" />
            <span>Realização de Chamada Escolar</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lance a frequência dos alunos e registre a descrição do conteúdo ministrado na aula.
          </p>
        </div>

        {/* Alternador de Sub-Abas: Realizar Chamada vs Histórico Salvo */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            onClick={() => {
              setActiveSubTab('realizar');
              setViewingHistoricalSheet(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'realizar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-600" />
            <span>Fazer Chamada</span>
          </button>
          <button
            onClick={() => setActiveSubTab('historico')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'historico'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-indigo-600" />
            <span>Histórico ({attendanceSheets.length})</span>
          </button>
        </div>
      </div>

      {/* Banner de Confirmação de Salvamento Recente */}
      {lastSavedInfo && activeSubTab === 'realizar' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-emerald-900">
                Chamada Registrada e Salva com Sucesso!
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Conteúdo: <strong className="text-emerald-900">"{lastSavedInfo.topic}"</strong> • {lastSavedInfo.present} de {lastSavedInfo.total} alunos presentes ({Math.round((lastSavedInfo.present / lastSavedInfo.total) * 100)}% de frequência).
              </p>
            </div>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium px-2.5 py-1 rounded-lg bg-emerald-100/80 shrink-0">
            Salvo às {new Date(lastSavedInfo.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}

      {activeSubTab === 'realizar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1 & 2: Painel de Parâmetros e Lista de Alunos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bloco de Seleção de Turma, Data e Horário */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Seleção de Turma (RF-60, RF-64) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Turma / Disciplina</span>
                  </label>
                  <select
                    value={currentClassId}
                    onChange={(e) => setCurrentClassId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.subject})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data da Chamada */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Data da Aula</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Horário da Aula */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Horário</span>
                  </label>
                  <select
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="07:30 - 08:20">1º Horário: 07:30 - 08:20</option>
                    <option value="08:20 - 09:10">2º Horário: 08:20 - 09:10</option>
                    <option value="07:30 - 09:10">Aula Dupla: 07:30 - 09:10</option>
                    <option value="09:30 - 10:20">3º Horário: 09:30 - 10:20</option>
                    <option value="10:20 - 11:10">4º Horário: 10:20 - 11:10</option>
                    <option value="09:30 - 11:10">Aula Dupla: 09:30 - 11:10</option>
                    <option value="11:20 - 13:00">5º Horário: 11:20 - 13:00</option>
                  </select>
                </div>
              </div>

              {/* Informações da Sala e Grau */}
              {selectedClass && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {selectedClass.gradeLevel}
                  </span>
                  <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {selectedClass.room}
                  </span>
                  <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    Código: {selectedClass.code}
                  </span>
                  <span className="ml-auto font-semibold text-indigo-700">
                    {studentsInClass.length} alunos matriculados
                  </span>
                </div>
              )}
            </div>

            {/* Descrição da Aula / Conteúdo Ministrado (RF-69) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Descrição da Aula / Conteúdo Ministrado (RF-69)</span>
                </label>
                <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-medium">
                  Armazenado com a chamada
                </span>
              </div>
              <input
                type="text"
                value={classTopic}
                onChange={(e) => setClassTopic(e.target.value)}
                placeholder="Ex.: Introdução a equações do segundo grau, resolução de exercícios da pág. 45"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white placeholder:text-slate-400 transition-colors"
              />
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={2}
                placeholder="Observações complementares da aula ou ocorrências pedagógicas (opcional)..."
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white placeholder:text-slate-400 transition-colors resize-none"
              />
            </div>

            {/* Lista de Alunos e Marcação de Presença */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Lista de Alunos ({filteredRecords.length})
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Busca rápida */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      placeholder="Filtrar aluno..."
                      className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-44"
                    />
                  </div>

                  {/* Ações em Lote */}
                  <button
                    onClick={() => handleMarkAll('presente')}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition-colors"
                    title="Marcar todos como presentes"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Todos Presentes</span>
                  </button>

                  <button
                    onClick={() => handleMarkAll('ausente')}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Marcar todos como ausentes"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpar</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Alunos com Toggle Presente / Ausente / Justificado */}
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {filteredRecords.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    Nenhum aluno encontrado para os critérios de busca.
                  </div>
                ) : (
                  filteredRecords.map((record, index) => {
                    const studentData = studentsInClass.find((s) => s.id === record.studentId);

                    return (
                      <div
                        key={record.studentId}
                        className={`p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          record.status === 'presente'
                            ? 'hover:bg-emerald-50/30'
                            : record.status === 'ausente'
                            ? 'bg-rose-50/20 hover:bg-rose-50/40'
                            : 'bg-amber-50/20 hover:bg-amber-50/40'
                        }`}
                      >
                        {/* Identificação do Aluno */}
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-center text-xs font-bold text-slate-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <img
                            src={
                              studentData?.avatarUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                            }
                            alt={record.studentName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />

                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">
                              {record.studentName}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                              Matrícula: {record.registration} • Freq. Geral: {studentData?.overallAttendanceRate || 95}%
                            </p>
                          </div>
                        </div>

                        {/* Botões de Seleção de Presença */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {/* Presente */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(record.studentId, 'presente')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                              record.status === 'presente'
                                ? 'bg-emerald-600 text-white shadow-xs scale-102'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Presente</span>
                          </button>

                          {/* Ausente */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(record.studentId, 'ausente')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                              record.status === 'ausente'
                                ? 'bg-rose-600 text-white shadow-xs scale-102'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Ausente</span>
                          </button>

                          {/* Justificado */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(record.studentId, 'justificado')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                              record.status === 'justificado'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Justificado</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Coluna 3: Painel Lateral de Resumo e Ação de Salvar */}
          <div className="space-y-6">
            {/* Card de Resumo da Frequência em Tempo Real */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Resumo da Frequência
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Total de Alunos</span>
                  <span className="text-sm font-bold text-slate-900">{totalStudents}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Presentes
                  </span>
                  <span className="text-sm font-bold">{presentCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Ausentes (Faltas)
                  </span>
                  <span className="text-sm font-bold">{absentCount}</span>
                </div>

                {justifiedCount > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-900">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Faltas Justificadas
                    </span>
                    <span className="text-sm font-bold">{justifiedCount}</span>
                  </div>
                )}

                {/* Barra de Progresso de Frequência */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">Índice de Presença</span>
                    <span className="text-indigo-600">{attendanceRate}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        attendanceRate >= 85
                          ? 'bg-emerald-500'
                          : attendanceRate >= 70
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${attendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Botão de Ação Salvar Chamada (RF-68, RF-69) */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Registro de Chamada</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Os dados de presença e descrição ficam salvos durante a sessão.
                </p>
              </div>
            </div>

            {/* Dicas Acadêmicas / Regras Institucionais */}
            <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-4 text-xs text-indigo-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Normas de Registro de Frequência</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>O limite máximo de faltas permitido pela LDB é de 25% da carga horária.</li>
                <li>A descrição da aula é exportada automaticamente para o diário de classe oficial.</li>
                <li>Faltas com atestado entregue na secretaria podem ser marcadas como justificadas.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* ABA DE HISTÓRICO DE CHAMADAS SALVAS (RF-68, RF-69) */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Histórico de Chamadas Salvas nesta Sessão
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Total: {attendanceSheets.length} registros
              </span>
            </div>

            {attendanceSheets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhuma chamada registrada até o momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendanceSheets.map((sheet) => {
                  const presentInSheet = sheet.records.filter((r) => r.status === 'presente').length;
                  const totalInSheet = sheet.records.length;
                  const rate = totalInSheet > 0 ? Math.round((presentInSheet / totalInSheet) * 100) : 0;

                  return (
                    <div
                      key={sheet.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {sheet.subject}
                          </span>
                          <h3 className="font-bold text-sm text-slate-900 mt-1">{sheet.className}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Data: {sheet.date}</span>
                            <span>•</span>
                            <span>{sheet.scheduleTime}</span>
                          </p>
                        </div>

                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {rate}% presenças
                        </span>
                      </div>

                      {/* Descrição Registrada */}
                      <div className="p-2.5 rounded-lg bg-white border border-slate-100 text-xs">
                        <p className="font-semibold text-slate-700 flex items-center gap-1 mb-0.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Conteúdo Ministrado:</span>
                        </p>
                        <p className="text-slate-600 italic">"{sheet.classTopic}"</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          Salvo em: {new Date(sheet.savedAt).toLocaleDateString('pt-BR')} às {new Date(sheet.savedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <button
                          onClick={() => {
                            setCurrentClassId(sheet.classId);
                            setSelectedDate(sheet.date);
                            setActiveSubTab('realizar');
                          }}
                          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <span>Revisar / Editar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
