// src/types/errorLog.ts - 错误日志系统类型

export type ErrorLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export type ErrorStatus = 'pending' | 'processing' | 'resolved' | 'ignored';

export type ResolutionStrategy = 'quickFix' | 'properFix' | 'ignore' | 'delegate';

export interface ErrorLog {
  id: string;
  level: ErrorLevel;
  source: string;
  message: string;
  age: number;
  status: ErrorStatus;
  resolution?: ErrorResolution;
}

export interface ErrorResolution {
  strategy: ResolutionStrategy;
  cost: number;
  techDebtDelta: number;
  npsDelta: number;
  resolvedAt: number;
}

export interface ErrorLogTemplate {
  id: string;
  level: ErrorLevel;
  source: string;
  messages: string[];
  minSprint: number;
  weight: number;
}
