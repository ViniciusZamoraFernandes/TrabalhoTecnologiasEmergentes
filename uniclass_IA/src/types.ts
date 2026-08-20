export type UserRole = 'professor' | 'admin';

export interface ProfessorProfile {
  id: string;
  name: string;
  email: string;
  cpf: string;
  registration: string; // Matrícula
  department: string;
  title: string; // Ex: Professor de Ensino Fundamental e Médio
  phone: string;
  avatarUrl: string;
  subjects: string[];
}

export interface Student {
  id: string;
  name: string;
  registration: string; // Matrícula
  classId: string;
  className: string;
  avatarUrl: string;
  email: string;
  phone: string;
  responsibleName: string;
  overallAttendanceRate: number; // Porcentagem
}

export interface ClassGroup {
  id: string;
  name: string; // Ex: "Turma 8º A"
  code: string; // Ex: "8EF-A"
  gradeLevel: string; // "ENSINO FUNDAMENTAL II . MATUTINO"
  room: string; // Ex: "Sala 102 - Bloco A"
  subject: string; // "Matemática"
  totalStudents: number;
  scheduleDescription: string; // "Hoje , 8:30"
  imageUrl?: string;
  color: string;
}

export interface ClassScheduleItem {
  id: string;
  classId: string;
  className: string;
  subject: string;
  dayOfWeek: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado';
  startTime: string; // "07:30"
  endTime: string;   // "08:20"
  room: string;
  isToday: boolean;
  order: number;
}

export type AttendanceStatus = 'presente' | 'ausente' | 'justificado';

export interface StudentAttendanceRecord {
  studentId: string;
  studentName: string;
  registration: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSheet {
  id: string;
  classId: string;
  className: string;
  subject: string;
  date: string; // YYYY-MM-DD
  scheduleTime: string; // "08:00 - 08:50"
  classTopic: string; // Descrição da aula / Conteúdo ministrado (RF-69)
  observations?: string;
  records: StudentAttendanceRecord[];
  savedAt: string;
  isFinished: boolean;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  registration: string;
  scores: {
    av1: number | null; // Prova 1
    av2: number | null; // Prova 2 / Trabalho
    simulado: number | null; // Atividades / Simulado
    recuperacao?: number | null;
  };
  finalAverage?: number | null;
  status: 'Aprovado' | 'Em Recuperação' | 'Reprovado' | 'Cursando';
}

export interface ClassGrades {
  classId: string;
  className: string;
  subject: string;
  academicPeriod: string; // "1º Bimestre 2026"
  weightConfig: {
    av1Weight: number;
    av2Weight: number;
    simuladoWeight: number;
    minimumPassingGrade: number;
  };
  grades: GradeItem[];
  lastUpdated: string;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  type: 'letivo' | 'prova' | 'feriado' | 'recesso' | 'conselho' | 'reuniao';
  description: string;
  isImportant: boolean;
}

export interface TeacherAvailabilityForm {
  id: string;
  teacherId: string;
  academicSemester: string; // "2026.2"
  maxClassesPerDay: number;
  preferredShifts: ('Manhã' | 'Tarde' | 'Noite')[];
  dayPreferences: {
    dayOfWeek: string;
    available: boolean;
    shift: ('Manhã' | 'Tarde' | 'Noite')[];
    notes: string;
  }[];
  generalObservations: string;
  submittedAt: string | null;
}

export interface AcademicNotification {
  id: string;
  title: string;
  message: string;
  sender: string;
  recipientType: 'professor' | 'turma' | 'geral';
  targetClassId?: string;
  targetClassName?: string;
  date: string; // ISO / formatada
  timeAgo: string; // "Há 20 minutos", "Há 52 minutos"
  read: boolean;
  isSystem?: boolean;
  attachmentName?: string;
  category: 'institucional' | 'academico' | 'urgente' | 'aviso_turma';
}

export interface PendingTask {
  id: string;
  type: 'chamada_pendente' | 'nota_pendente' | 'plano_aula';
  title: string;
  subtitle: string;
  classId: string;
  deadline: string;
  actionRoute: string;
  actionLabel: string;
  urgency: 'alta' | 'media' | 'baixa';
}

// Modelos Administrativos (Exclusivos do Administrador)
export interface StudentFinancialRecord {
  id: string;
  studentId: string;
  studentName: string;
  registration: string;
  className: string;
  responsibleName: string;
  monthlyFee: number;
  status: 'Em Dia' | 'Pendente' | 'Em Atraso';
  unpaidMonths: string[];
  totalOverdueAmount: number;
}

export interface FinancialTransaction {
  id: string;
  transactionCode: string; // Ex: "TRX-2026-8941"
  studentId: string;
  studentName: string;
  registration: string;
  className: string;
  amount: number;
  paymentMethod: 'Boleto Bancário' | 'PIX' | 'Cartão de Crédito';
  date: string;
  status: 'Concluído' | 'Processando' | 'Estornado' | 'Falha';
}
