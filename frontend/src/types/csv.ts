export interface CsvRow {
  [key: string]: string | undefined;
}

export interface CsvParseResult {
  headers: string[];
  rows: CsvRow[];
  totalRows: number;
  file: File;
  fileName: string;
  fileSize: number;
}

export type CrmStatus = "GOOD_LEAD_FOLLOW_UP" | "DID_NOT_CONNECT" | "BAD_LEAD" | "SALE_DONE" | "";

export type DataSource =
  | "leads_on_demand"
  | "meridian_tower"
  | "eden_park"
  | "varah_swamy"
  | "sarjapur_plots"
  | "";

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

export interface ImportResult {
  success: MappedRecord[];
  skipped: SkippedRecord[];
  stats: ImportStats;
}

export interface SkippedRecord {
  index: number;
  reason: string;
  originalData: CsvRow;
}

export interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  accuracy: number;
  processingTimeMs: number;
}
