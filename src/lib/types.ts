export type MediaType = 'image' | 'video' | 'audio';

export type AnalysisStatus = 'pending' | 'analyzing' | 'completed' | 'failed';

export interface ManipulationIndicator {
  label: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
}

/** Shape returned by a real Python Flask backend. Kept permissive for forward-compat. */
export interface AnalysisResult {
  authenticity: 'authentic' | 'manipulated' | 'inconclusive';
  confidence: number; // 0-100
  summary: string;
  indicators: ManipulationIndicator[];
  model_version?: string;
  [key: string]: unknown;
}

export interface AnalysisRecord {
  id: string;
  filename: string;
  media_type: MediaType;
  file_size: number;
  mime_type: string | null;
  status: AnalysisStatus;
  result: AnalysisResult | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisInsert {
  filename: string;
  media_type: MediaType;
  file_size: number;
  mime_type: string | null;
  status: AnalysisStatus;
}
