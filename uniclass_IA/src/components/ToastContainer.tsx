import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-700 text-emerald-50'
                : toast.type === 'error'
                ? 'bg-rose-900/90 border-rose-700 text-rose-50'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 border-amber-700 text-amber-50'
                : 'bg-slate-900/90 border-slate-700 text-slate-50'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-300" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-300" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white tracking-tight">{toast.title}</p>
              <p className="mt-0.5 text-xs opacity-90 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
