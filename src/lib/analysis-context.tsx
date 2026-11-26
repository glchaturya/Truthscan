import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AnalysisRecord, MediaType } from '@/lib/types';
import { detectMediaType } from '@/lib/media';
import { ANALYSIS_API_URL, supabase } from '@/lib/supabase';

interface PendingUpload {
  file: File;
  mediaType: MediaType;
  previewUrl: string | null;
}

interface AnalysisContextValue {
  /** The upload the user just staged (not yet analyzed). */
  pending: PendingUpload | null;
  setPending: (file: File | null) => void;
  /** The most recent analysis record (from Supabase or in-memory). */
  current: AnalysisRecord | null;
  setCurrent: (rec: AnalysisRecord | null) => void;
  /** Run analysis against the configured Flask backend, persisting a record. */
  analyze: (file: File, mediaType: MediaType) => Promise<AnalysisRecord>;
  /** Load a past record by id. */
  loadRecord: (id: string) => Promise<AnalysisRecord | null>;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [pending, setPendingState] = useState<PendingUpload | null>(null);
  const [current, setCurrent] = useState<AnalysisRecord | null>(null);

  const setPending = useCallback((file: File | null) => {
    setPendingState((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      if (!file) return null;
      const mediaType = detectMediaType(file);
      if (!mediaType) return null;
      const previewUrl = mediaType === 'image' || mediaType === 'video' ? URL.createObjectURL(file) : null;
      return { file, mediaType, previewUrl };
    });
  }, []);

  const analyze = useCallback(async (file: File, mediaType: MediaType): Promise<AnalysisRecord> => {
    // 1. Create a pending record in Supabase so it shows in history.
    const insert = {
      filename: file.name,
      media_type: mediaType,
      file_size: file.size,
      mime_type: file.type || null,
      status: 'analyzing' as const,
    };
    const { data: rec, error } = await supabase
      .from('analyses')
      .insert(insert)
      .select()
      .single();
    if (error || !rec) throw new Error('Could not save analysis record.');

    const record = rec as AnalysisRecord;
    setCurrent(record);

    // 2. If no backend is configured, return the record as-is (pending analysis).
    //    The Results page will show a clear "demo UI — connect backend" state.
    if (!ANALYSIS_API_URL) {
      const updated = await supabase
        .from('analyses')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', record.id)
        .select()
        .single();
      const fresh = (updated.data as AnalysisRecord) ?? record;
      setCurrent(fresh);
      return fresh;
    }

    // 3. POST the file to the Flask backend. The backend shape is defined in types.ts.
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('media_type', mediaType);
      const res = await fetch(`${ANALYSIS_API_URL}/analyze`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Backend returned ${res.status}`);
      const result = await res.json();
      const updated = await supabase
        .from('analyses')
        .update({ status: 'completed', result, updated_at: new Date().toISOString() })
        .eq('id', record.id)
        .select()
        .single();
      const fresh = (updated.data as AnalysisRecord) ?? { ...record, status: 'completed', result };
      setCurrent(fresh);
      return fresh;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed.';
      const updated = await supabase
        .from('analyses')
        .update({ status: 'failed', error_message: msg, updated_at: new Date().toISOString() })
        .eq('id', record.id)
        .select()
        .single();
      const fresh = (updated.data as AnalysisRecord) ?? { ...record, status: 'failed', error_message: msg };
      setCurrent(fresh);
      return fresh;
    }
  }, []);

  const loadRecord = useCallback(async (id: string): Promise<AnalysisRecord | null> => {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    setCurrent(data as AnalysisRecord);
    return data as AnalysisRecord;
  }, []);

  return (
    <AnalysisContext.Provider value={{ pending, setPending, current, setCurrent, analyze, loadRecord }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
}
