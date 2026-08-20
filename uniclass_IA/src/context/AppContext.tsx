import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ProfessorProfile,
  ClassGroup,
  Student,
  ClassScheduleItem,
  AttendanceSheet,
  ClassGrades,
  AcademicCalendarEvent,
  TeacherAvailabilityForm,
  AcademicNotification,
  PendingTask,
  StudentFinancialRecord,
  FinancialTransaction,
} from '../types';
import {
  INITIAL_PROFESSOR,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_SCHEDULE,
  INITIAL_ATTENDANCE_SHEETS,
  INITIAL_CLASS_GRADES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_TEACHER_AVAILABILITY,
  INITIAL_NOTIFICATIONS,
  INITIAL_PENDING_TASKS,
  INITIAL_ADMIN_FINANCIAL_RECORDS,
  INITIAL_ADMIN_TRANSACTIONS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Autenticação e Perfis (RF-63)
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role?: UserRole) => boolean;
  logout: () => void;

  // Navegação
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClassForAttendance: string | null;
  setSelectedClassForAttendance: (classId: string | null) => void;
  quickStartAttendance: (classId: string) => void;

  // Perfil do Professor (RF-57, RF-58)
  professorProfile: ProfessorProfile;
  updateProfessorProfile: (profile: Partial<ProfessorProfile>) => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };

  // Turmas e Alunos (RF-64, RF-66, RF-70)
  classes: ClassGroup[];
  students: Student[];
  searchClasses: (query: string) => ClassGroup[];
  getStudentsByClass: (classId: string) => Student[];

  // Horários e Aulas do Dia (RF-59, RF-65)
  schedule: ClassScheduleItem[];
  getTodayClasses: () => ClassScheduleItem[];

  // Chamada (RF-60, RF-68, RF-69)
  attendanceSheets: AttendanceSheet[];
  saveAttendanceSheet: (sheet: Omit<AttendanceSheet, 'id' | 'savedAt'> & { id?: string }) => void;
  getAttendanceByClassAndDate: (classId: string, date: string) => AttendanceSheet | undefined;

  // Notas e Avaliações (RF-67)
  classGrades: Record<string, ClassGrades>;
  saveClassGrades: (classId: string, updatedGrades: ClassGrades) => void;

  // Calendário Acadêmico (RF-61)
  calendarEvents: AcademicCalendarEvent[];

  // Disponibilidade e Preferências (RF-62)
  teacherAvailability: TeacherAvailabilityForm;
  saveTeacherAvailability: (form: TeacherAvailabilityForm) => void;

  // Notificações e Comunicados (RF-71, RF-72)
  notifications: AcademicNotification[];
  sendNotificationToClass: (data: { title: string; message: string; targetClassId: string }) => void;
  markNotificationAsRead: (id: string) => void;

  // Pendências (RF-73)
  pendingTasks: PendingTask[];
  dismissPendingTask: (taskId: string) => void;

  // Administração Exclusiva (RF-74, RF-75)
  adminFinancialRecords: StudentFinancialRecord[];
  adminTransactions: FinancialTransaction[];

  // Feedback / Toasts
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização de estados com sessionStorage/localStorage fallback
  const [currentRole, setCurrentRole] = useState<UserRole>('professor');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState<string | null>(null);

  const [professorProfile, setProfessorProfile] = useState<ProfessorProfile>(() => {
    const saved = localStorage.getItem('app_prof_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFESSOR;
  });

  const [passwordHash, setPasswordHash] = useState<string>('prof123');

  const [classes] = useState<ClassGroup[]>(INITIAL_CLASSES);
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  const [schedule] = useState<ClassScheduleItem[]>(INITIAL_SCHEDULE);

  const [attendanceSheets, setAttendanceSheets] = useState<AttendanceSheet[]>(() => {
    const saved = localStorage.getItem('app_attendance_sheets');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_SHEETS;
  });

  const [classGrades, setClassGrades] = useState<Record<string, ClassGrades>>(() => {
    const saved = localStorage.getItem('app_class_grades');
    return saved ? JSON.parse(saved) : INITIAL_CLASS_GRADES;
  });

  const [calendarEvents] = useState<AcademicCalendarEvent[]>(INITIAL_CALENDAR_EVENTS);

  const [teacherAvailability, setTeacherAvailability] = useState<TeacherAvailabilityForm>(() => {
    const saved = localStorage.getItem('app_teacher_availability');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_AVAILABILITY;
  });

  const [notifications, setNotifications] = useState<AcademicNotification[]>(() => {
    const saved = localStorage.getItem('app_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>(() => {
    const saved = localStorage.getItem('app_pending_tasks');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_TASKS;
  });

  const [adminFinancialRecords] = useState<StudentFinancialRecord[]>(INITIAL_ADMIN_FINANCIAL_RECORDS);
  const [adminTransactions] = useState<FinancialTransaction[]>(INITIAL_ADMIN_TRANSACTIONS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Salvar no localStorage para manter durante a sessão
  useEffect(() => {
    localStorage.setItem('app_prof_profile', JSON.stringify(professorProfile));
  }, [professorProfile]);

  useEffect(() => {
    localStorage.setItem('app_attendance_sheets', JSON.stringify(attendanceSheets));
  }, [attendanceSheets]);

  useEffect(() => {
    localStorage.setItem('app_class_grades', JSON.stringify(classGrades));
  }, [classGrades]);

  useEffect(() => {
    localStorage.setItem('app_teacher_availability', JSON.stringify(teacherAvailability));
  }, [teacherAvailability]);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('app_pending_tasks', JSON.stringify(pendingTasks));
  }, [pendingTasks]);

  // Toast Helper
  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login (RF-63)
  const login = (email: string, pass: string, role: UserRole = 'professor'): boolean => {
    if (role === 'professor') {
      if (email.trim().toLowerCase() === professorProfile.email.toLowerCase() && pass === passwordHash) {
        setIsAuthenticated(true);
        setCurrentRole('professor');
        showToast({
          type: 'success',
          title: 'Login efetuado com sucesso',
          message: `Bem-vindo de volta, ${professorProfile.name}!`,
        });
        return true;
      }
      // Demo fallback aceita qualquer login de professor de teste
      if (pass.length >= 4) {
        setIsAuthenticated(true);
        setCurrentRole('professor');
        showToast({
          type: 'success',
          title: 'Login efetuado',
          message: `Sessão iniciada como ${professorProfile.name}.`,
        });
        return true;
      }
    } else if (role === 'admin') {
      setIsAuthenticated(true);
      setCurrentRole('admin');
      showToast({
        type: 'info',
        title: 'Modo Administrador',
        message: 'Acesso concedido ao módulo administrativo e financeiro.',
      });
      return true;
    }
    showToast({
      type: 'error',
      title: 'Falha no login',
      message: 'Credenciais inválidas. Verifique o e-mail e a senha informados.',
    });
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast({
      type: 'info',
      title: 'Sessão encerrada',
      message: 'Você saiu do sistema.',
    });
  };

  // Perfil e Senha (RF-57, RF-58)
  const updateProfessorProfile = (updated: Partial<ProfessorProfile>) => {
    setProfessorProfile((prev) => ({ ...prev, ...updated }));
    showToast({
      type: 'success',
      title: 'Perfil atualizado',
      message: 'Suas informações cadastrais foram salvas com sucesso.',
    });
  };

  const changePassword = (currentPass: string, newPass: string) => {
    if (currentPass !== passwordHash) {
      showToast({
        type: 'error',
        title: 'Senha incorreta',
        message: 'A senha atual informada está incorreta.',
      });
      return { success: false, message: 'A senha atual informada não confere.' };
    }
    if (newPass.length < 6) {
      showToast({
        type: 'warning',
        title: 'Senha muito curta',
        message: 'A nova senha deve possuir no mínimo 6 caracteres.',
      });
      return { success: false, message: 'A nova senha deve possuir no mínimo 6 caracteres.' };
    }
    setPasswordHash(newPass);
    showToast({
      type: 'success',
      title: 'Senha alterada com sucesso',
      message: 'Sua nova senha de acesso foi registrada com segurança.',
    });
    return { success: true, message: 'Senha atualizada com sucesso!' };
  };

  // Busca e Filtros de Turmas (RF-64, RF-66)
  const searchClasses = (query: string): ClassGroup[] => {
    if (!query.trim()) return classes;
    const lower = query.toLowerCase();
    return classes.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower) ||
        c.subject.toLowerCase().includes(lower) ||
        c.room.toLowerCase().includes(lower) ||
        c.gradeLevel.toLowerCase().includes(lower)
    );
  };

  const getStudentsByClass = (classId: string): Student[] => {
    return students.filter((s) => s.classId === classId);
  };

  // Aulas do dia ordenadas (RF-59)
  const getTodayClasses = (): ClassScheduleItem[] => {
    return schedule
      .filter((s) => s.isToday)
      .sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
  };

  // Atalho de chamada rápida a partir do Dashboard ou Turmas (RF-60)
  const quickStartAttendance = (classId: string) => {
    setSelectedClassForAttendance(classId);
    setActiveTab('chamada');
  };

  // Chamada (RF-68, RF-69)
  const saveAttendanceSheet = (sheetData: Omit<AttendanceSheet, 'id' | 'savedAt'> & { id?: string }) => {
    const id = sheetData.id || `att-${Date.now()}`;
    const newSheet: AttendanceSheet = {
      ...sheetData,
      id,
      savedAt: new Date().toISOString(),
      isFinished: true,
    };

    setAttendanceSheets((prev) => {
      const existingIdx = prev.findIndex(
        (s) => (sheetData.id && s.id === sheetData.id) || (s.classId === sheetData.classId && s.date === sheetData.date)
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newSheet;
        return copy;
      }
      return [newSheet, ...prev];
    });

    // Remove ou atualiza pendência de chamada se existir para esta turma
    setPendingTasks((prev) => prev.filter((task) => !(task.type === 'chamada_pendente' && task.classId === sheetData.classId)));

    showToast({
      type: 'success',
      title: 'Chamada registrada com sucesso!',
      message: `A chamada da turma ${sheetData.className} foi salva com a descrição e status dos alunos.`,
    });
  };

  const getAttendanceByClassAndDate = (classId: string, date: string): AttendanceSheet | undefined => {
    return attendanceSheets.find((s) => s.classId === classId && s.date === date);
  };

  // Notas (RF-67)
  const saveClassGrades = (classId: string, updatedGrades: ClassGrades) => {
    setClassGrades((prev) => ({
      ...prev,
      [classId]: {
        ...updatedGrades,
        lastUpdated: new Date().toISOString(),
      },
    }));

    // Se salvou notas do 9º B, remove tarefa pendente
    setPendingTasks((prev) => prev.filter((task) => !(task.type === 'nota_pendente' && task.classId === classId)));

    showToast({
      type: 'success',
      title: 'Notas salvas com sucesso',
      message: `Lançamento de notas da turma ${updatedGrades.className} foi atualizado.`,
    });
  };

  // Disponibilidade e Preferências (RF-62)
  const saveTeacherAvailability = (form: TeacherAvailabilityForm) => {
    const updated = {
      ...form,
      submittedAt: new Date().toISOString(),
    };
    setTeacherAvailability(updated);
    showToast({
      type: 'success',
      title: 'Disponibilidade enviada',
      message: 'Suas preferências de horários foram encaminhadas à Coordenação Pedagógica.',
    });
  };

  // Notificações (RF-71, RF-72)
  const sendNotificationToClass = ({
    title,
    message,
    targetClassId,
  }: {
    title: string;
    message: string;
    targetClassId: string;
  }) => {
    const targetClass = classes.find((c) => c.id === targetClassId);
    const newNotif: AcademicNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      sender: professorProfile.name,
      recipientType: 'turma',
      targetClassId,
      targetClassName: targetClass?.name || 'Turma selecionada',
      date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      timeAgo: 'Agora mesmo',
      read: true,
      category: 'aviso_turma',
    };

    setNotifications((prev) => [newNotif, ...prev]);

    showToast({
      type: 'success',
      title: 'Notificação enviada',
      message: `Comunicado transmitido para os alunos de ${targetClass?.name}.`,
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismissPendingTask = (taskId: string) => {
    setPendingTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast({
      type: 'info',
      title: 'Pendência arquivada',
      message: 'Item removido da lista prioritária.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        selectedClassForAttendance,
        setSelectedClassForAttendance,
        quickStartAttendance,
        professorProfile,
        updateProfessorProfile,
        changePassword,
        classes,
        students,
        searchClasses,
        getStudentsByClass,
        schedule,
        getTodayClasses,
        attendanceSheets,
        saveAttendanceSheet,
        getAttendanceByClassAndDate,
        classGrades,
        saveClassGrades,
        calendarEvents,
        teacherAvailability,
        saveTeacherAvailability,
        notifications,
        sendNotificationToClass,
        markNotificationAsRead,
        pendingTasks,
        dismissPendingTask,
        adminFinancialRecords,
        adminTransactions,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
