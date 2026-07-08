export type CrmStatus = "GOOD_LEAD_FOLLOW_UP" | "DID_NOT_CONNECT" | "BAD_LEAD" | "SALE_DONE" | "";

export type DataSource =
  | "leads_on_demand"
  | "meridian_tower"
  | "eden_park"
  | "varah_swamy"
  | "sarjapur_plots"
  | "";

export interface CsvRow {
  [key: string]: string | undefined;
}

export interface CsvParseResult {
  headers: string[];
  rows: CsvRow[];
  totalRows: number;
}

export interface MappedRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: CrmStatus;
  crm_note: string;
  data_source: DataSource;
  possession_time: string;
  description: string;
}

export interface BatchInput {
  headers: string[];
  rows: CsvRow[];
  batchIndex: number;
}

export interface BatchResult {
  batchIndex: number;
  records: MappedRecord[];
  skipped: SkippedRecord[];
}

export interface SkippedRecord {
  index: number;
  reason: string;
  originalData: CsvRow;
}

export interface ProcessingStats {
  total: number;
  imported: number;
  skipped: number;
  accuracy: number;
  processingTimeMs: number;
}

export const VALID_CRM_STATUSES: readonly CrmStatus[] = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
] as const;

export const VALID_DATA_SOURCES: readonly DataSource[] = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
] as const;
