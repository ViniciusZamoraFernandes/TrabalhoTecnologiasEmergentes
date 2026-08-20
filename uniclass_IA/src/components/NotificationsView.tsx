import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Search,
  ChevronDown,
  FileText,
  Send,
  Plus,
  Trash2,
  Check,
  Users,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    classes,
    sendNotificationToClass,
    markNotificationAsRead,
    professorProfile,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewScope, setViewScope] = useState<'todos' | 'excluidos'>('todos');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [filterExcludeSystem, setFilterExcludeSystem] = useState(false);
  const [filterWithAttachment, setFilterWithAttachment] = useState(false);
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);

  // Form de novo comunicado
  const [targetClassId, setTargetClassId] = useState(classes[0]?.id || '');
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredNotifications = notifications.filter((item) => {
    if (viewScope === 'excluidos') return false; // Demo

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.attachmentName && item.attachmentName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterUnreadOnly && item.read) return false;
    if (filterExcludeSystem && item.isSystem) return false;
    if (filterWithAttachment && !item.attachmentName) return false;

    return true;
  });

  const handleToggleSelectAll = () => {
    if (selectedNotificationIds.length === filteredNotifications.length) {
      setSelectedNotificationIds([]);
    } else {
      setSelectedNotificationIds(filteredNotifications.map((n) => n.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedNotificationIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim() || !targetClassId) return;

    sendNotificationToClass({
      title: newTitle.trim(),
      message: newMessage.trim(),
      targetClassId,
    });

    setNewTitle('');
    setNewMessage('');
    setShowSendModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Tela com Título e Botão de Enviar Comunicado (RF-71, RF-72) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Notificações
        </h1>

        <button
          onClick={() => setShowSendModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0B253A] hover:bg-[#133856] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Novo Comunicado (RF-72)</span>
        </button>
      </div>

      {/* Barra de Pesquisa e Alternador Todos os Avisos / Excluídos */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Campo de Busca */}
        <div className="relative flex-1 w-full max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquise por nome"
            className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-full border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B253A] transition-colors"
          />
        </div>

        {/* Alternador Pílula: Todos os Avisos / Excluídos */}
        <div className="flex items-center p-1 rounded-full bg-[#0B253A] text-white text-xs font-semibold self-end md:self-auto shrink-0 shadow-xs">
          <button
            onClick={() => setViewScope('todos')}
            className={`px-5 py-1.5 rounded-full transition-all ${
              viewScope === 'todos'
                ? 'bg-white text-[#0B253A] shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Todos os Avisos
          </button>
          <button
            onClick={() => setViewScope('excluidos')}
            className={`px-5 py-1.5 rounded-full transition-all ${
              viewScope === 'excluidos'
                ? 'bg-white text-[#0B253A] shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Excluídos
          </button>
        </div>
      </div>

      {/* Filtros em Pílulas */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button className="px-4 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs">
          <span>Data</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
          className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-all shadow-2xs ${
            filterUnreadOnly
              ? 'bg-[#0B253A] text-white border-[#0B253A]'
              : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          Não Lido
        </button>

        <button
          onClick={() => setFilterExcludeSystem(!filterExcludeSystem)}
          className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-all shadow-2xs ${
            filterExcludeSystem
              ? 'bg-[#0B253A] text-white border-[#0B253A]'
              : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          Excluir Avisos de Sistema
        </button>

        <button
          onClick={() => setFilterWithAttachment(!filterWithAttachment)}
          className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-all shadow-2xs ${
            filterWithAttachment
              ? 'bg-[#0B253A] text-white border-[#0B253A]'
              : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          Com anexo
        </button>
      </div>

      {/* Caixa de Selecionar Tudo */}
      <div className="flex items-center gap-2 py-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
          <input
            type="checkbox"
            id="selectAll"
            checked={
              filteredNotifications.length > 0 &&
              selectedNotificationIds.length === filteredNotifications.length
            }
            onChange={handleToggleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-[#0B253A] focus:ring-[#0B253A] cursor-pointer"
          />
          <label htmlFor="selectAll" className="cursor-pointer">
            Selecionar Tudo
          </label>
        </div>

        {selectedNotificationIds.length > 0 && (
          <span className="text-xs font-medium text-slate-500">
            {selectedNotificationIds.length} selecionadas
          </span>
        )}
      </div>

      {/* Lista de Cards de Notificações (Fiel ao Protótipo) */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Nenhuma notificação encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isSelected = selectedNotificationIds.includes(notif.id);

            return (
              <div
                key={notif.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-4 sm:p-5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(notif.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#0B253A] focus:ring-[#0B253A] cursor-pointer"
                      />
                      <span>{notif.timeAgo || notif.date}</span>
                    </div>

                    {/* Tag de Anexo PDF se houver */}
                    {notif.attachmentName && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                        <span className="px-1 bg-[#D90429] text-white rounded text-[9px] font-extrabold">
                          PDF
                        </span>
                        <span>{notif.attachmentName}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {notif.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Envio de Comunicado (RF-72) */}
      {showSendModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#0B253A]" />
                <span>Enviar Comunicado para os Alunos (RF-72)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Transmita orientações, avisos ou atividades para a turma selecionada.
              </p>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0B253A]" />
                  <span>Turma Destinatária</span>
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B253A]"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.gradeLevel}) • {c.totalStudents} alunos
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título do Comunicado
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex.: Orientações para a Prova Mensal de Matemática"
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B253A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mensagem / Conteúdo
                </label>
                <textarea
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva a mensagem clara com os detalhes e prazos para os alunos..."
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B253A] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#0B253A] hover:bg-[#133856] text-white flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Notificação</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
