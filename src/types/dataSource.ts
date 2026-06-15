// src/types/dataSource.ts - 字段对齐系统类型

export type FieldType = 'STRING' | 'INT' | 'FLOAT' | 'JSON' | 'TIMESTAMP' | 'BOOLEAN' | 'VARCHAR';

export type IntegrationStatus = 'unconnected' | 'connected' | 'aligned';

export type AlignmentStrategy = 'manualMap' | 'middleware' | 'forceCast' | 'defer';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  semantic: string;
  sample: string;
  canonicalName?: string;
}

export interface DataSource {
  id: string;
  name: string;
  fields: Field[];
  reliability: number;
  integrationStatus: IntegrationStatus;
}

export interface AlignmentConflict {
  id: string;
  fieldA: Field & { sourceId: string; sourceName: string };
  fieldB: Field & { sourceId: string; sourceName: string };
  semanticMatch: number;
  status: 'pending' | 'resolved';
  resolution?: AlignmentResolution;
}

export interface AlignmentResolution {
  strategy: AlignmentStrategy;
  cost: number;
  techDebtDelta: number;
  npsDelta: number;
}