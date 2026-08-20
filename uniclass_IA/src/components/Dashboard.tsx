import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    professorProfile,
    classes,
    notifications,
    quickStartAttendance,
    setActiveTab,
  } = useApp();

  const [activeSlide, setActiveSlide] = useState(0);

  const bannerSlides = [
    {
      badge: 'Aviso',
      title: 'Volta as Aulas 2026',
      description:
        'Atenção Professores! Revise suas turmas, conteúdos e planejamentos para deixar tudo pronto para o inicio do semestre.',
      date: '27 de setembro de 2026',
      imageUrl:
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
    },
    {
      badge: 'Pedagógico',
      title: 'Lançamento de Notas do 2º Bimestre',
      description:
        'O sistema já está aberto para lançamento de notas e faltas das turmas do Ensino Fundamental e Médio.',
      date: 'Até 25 de julho de 2026',
      imageUrl:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  const currentSlide = bannerSlides[activeSlide];

  return (
    <div className="space-y-6 pb-12">
      {/* Barra de Saudação Superior e Data */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Olá, Prof. {professorProfile.name}!
          </h1>
        </div>

        <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center font-bold text-slate-800 text-sm sm:text-base">
          Terça 15/07
        </div>
      </div>

      {/* Hero Banner Carousel (Volta às Aulas 2026) */}
      <div className="relative rounded-3xl overflow-hidden shadow-md min-h-[220px] sm:min-h-[260px] flex flex-col justify-between p-6 sm:p-8 text-white bg-slate-900">
        {/* Imagem de Fundo com Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-60"
          style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />

        {/* Conteúdo do Banner */}
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E63946] text-white shadow-xs">
            {currentSlide.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {currentSlide.description}
          </p>
          <p className="text-xs font-semibold text-slate-300 pt-1">
            {currentSlide.date}
          </p>
        </div>

        {/* Controles de Navegação do Carousel */}
        <div className="relative z-10 flex items-center justify-between pt-4">
          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1))}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicadores de Paginação */}
          <div className="flex items-center gap-1.5">
            {bannerSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1))}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Principal: Notificações (Esquerda) e Suas Turmas (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA DA ESQUERDA: NOTIFICAÇÕES (RF-71, RF-73) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Bell className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">Notificações</h2>
            </div>

            <div className="space-y-3">
              {/* Notificação 1: Frequência Pendente */}
              <div
                onClick={() => setActiveTab('chamada')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Frequência pendente</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>Há 20 minutos</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Olá, professor(a). A frequência da aula de hoje ainda não foi registrada...
                </p>
              </div>

              {/* Notificação 2: Nova atividade entregue */}
              <div
                onClick={() => setActiveTab('notificacoes')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Nova atividade entregue</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>Há 52 minutos</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Olá, professor(a). Há novas atividades enviadas pelos alunos da Turma 8º A...
                </p>
              </div>

              {/* Notificação 3: Nova atividade entregue */}
              <div
                onClick={() => setActiveTab('notificacoes')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Nova atividade entregue</h3>
                  <span className="text-[11px] text-slate-400">Há 21 horas</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Olá, professor(a). Há novas atividades enviadas pelos alunos...
                </p>
              </div>

              {/* Notificação 4: Nova atividade entregue */}
              <div
                onClick={() => setActiveTab('notificacoes')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Nova atividade entregue</h3>
                  <span className="text-[11px] text-slate-400">Há 2 dias</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Olá, professor(a). Há novas atividades enviadas pelos alunos...
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 text-right">
            <button
              onClick={() => setActiveTab('notificacoes')}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 inline-flex items-center gap-1"
            >
              <span>Ver mais</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COLUNA DA DIREITA: SUAS TURMAS (RF-59, RF-60, RF-64) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Suas Turmas</h2>
              <button
                onClick={() => setActiveTab('turmas')}
                className="text-xs font-bold text-slate-700 hover:text-slate-950 inline-flex items-center gap-1"
              >
                <span>Ver Todas</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid Horizontal de Cards de Turmas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-rose-500 overflow-hidden bg-white shadow-sm flex flex-col justify-between"
                >
                  {/* Foto da Turma */}
                  <div className="h-32 bg-slate-200 relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informações da Turma */}
                  <div className="p-4 space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      {item.gradeLevel}
                    </p>
                    <h3 className="text-lg font-bold text-[#E63946]">{item.name}</h3>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-1">
                      <span>{item.totalStudents} alunos</span>
                      <span>{item.scheduleDescription}</span>
                    </div>

                    {/* Botão de Chamada com Acesso Direto (RF-60) */}
                    <div className="pt-2">
                      <button
                        onClick={() => quickStartAttendance(item.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0B253A] hover:bg-[#133856] text-white text-xs font-extrabold tracking-wider uppercase transition-colors shadow-xs"
                      >
                        FAZER CHAMADA
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end text-xs text-slate-400">
            <button
              onClick={() => setActiveTab('turmas')}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
