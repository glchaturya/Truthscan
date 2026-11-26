import { useEffect, useState } from 'react';
import {
  History as HistoryIcon, Image, Video, AudioLines, ShieldCheck, ShieldAlert, ShieldQuestion,
  Loader2, Trash2, ArrowRight, FileWarning, Inbox,
} from 'lucide-react';
import type { AnalysisRecord, MediaType } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/components/router';
import { Card, Badge, SectionTitle } from '@/components/ui';
import { formatBytes, formatDate } from '@/lib/media';
import { useAnalysis } from '@/lib/analysis-context';

const MEDIA_ICON: Record<MediaType, typeof Image> = { image: Image, video: Video, audio: AudioLines };

function verdictBadge(rec: AnalysisRecord) {
  if (rec.status === 'failed') return <Badge tone="danger"><FileWarning className="h-3 w-3" /> Failed</Badge>;
  if (rec.status === 'pending' || rec.status === 'analyzing') return <Badge tone="neutral"><ShieldQuestion className="h-3 w-3" /> Demo</Badge>;
  const a = rec.result?.authenticity;
  if (a === 'authentic') return <Badge tone="success"><ShieldCheck className="h-3 w-3" /> Authentic</Badge>;
  if (a === 'manipulated') return <Badge tone="danger"><ShieldAlert className="h-3 w-3" /> Manipulated</Badge>;
  return <Badge tone="warning"><ShieldQuestion className="h-3 w-3" /> Inconclusive</Badge>;
}

export default function HistoryPage() {
  const { setCurrent } = useAnalysis();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRecords((data as AnalysisRecord[]) ?? []);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    await supabase.from('analyses').delete().eq('id', id);
    setRecords((r) => r.filter((x) => x.id !== id));
  };

  const open = (rec: AnalysisRecord) => {
    setCurrent(rec);
    navigate('results', { id: rec.id });
  };

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle
        kicker="History"
        title="Previously analyzed media"
        subtitle="Every analysis is stored here with its date, media type, and result. Click any item to revisit the full report."
      />

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-electric-300" />
        </div>
      ) : error ? (
        <Card className="mt-8 border-rose-500/30 bg-rose-500/5 p-6 text-rose-200">
          Couldn't load history: {error}
        </Card>
      ) : records.length === 0 ? (
        <Card className="mt-8 flex flex-col items-center justify-center p-12 text-center">
          <Inbox className="h-10 w-10 text-slate-600" />
          <p className="mt-3 font-semibold text-white">No analyses yet</p>
          <p className="mt-1 text-sm text-slate-500">Once you analyze media, it will appear here.</p>
          <button onClick={() => navigate('dashboard')} className="mt-5 rounded-lg bg-electric-500 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:bg-electric-400">
            Start Analyzing
          </button>
        </Card>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-navy-700/70">
          {/* table head */}
          <div className="hidden grid-cols-[1.6fr,1fr,1fr,1.2fr,auto] gap-4 border-b border-navy-700 bg-navy-900/70 px-5 py-3 text-xs uppercase tracking-wide text-slate-500 md:grid">
            <span>File</span>
            <span>Type</span>
            <span>Date</span>
            <span>Result</span>
            <span className="text-right">Actions</span>
          </div>

          {records.map((rec) => {
            const Icon = MEDIA_ICON[rec.media_type];
            return (
              <div
                key={rec.id}
                className="grid grid-cols-1 gap-3 border-b border-navy-700/50 px-5 py-4 transition-colors last:border-0 hover:bg-navy-850/60 md:grid-cols-[1.6fr,1fr,1fr,1.2fr,auto] md:items-center md:gap-4"
              >
                <button onClick={() => open(rec)} className="flex items-center gap-3 text-left">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-electric-400/20 bg-electric-500/10">
                    <Icon className="h-4 w-4 text-electric-300" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-white">{rec.filename}</span>
                    <span className="block text-xs text-slate-500">{formatBytes(rec.file_size)}</span>
                  </span>
                </button>

                <span className="text-sm capitalize text-slate-300">{rec.media_type}</span>
                <span className="text-sm text-slate-400">{formatDate(rec.created_at)}</span>
                <span>{verdictBadge(rec)}</span>

                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    onClick={() => open(rec)}
                    className="inline-flex items-center gap-1 rounded-md border border-navy-600 px-3 py-1.5 text-xs text-slate-200 hover:border-electric-400/40 hover:text-white"
                  >
                    Open <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => remove(rec.id)}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
                    aria-label="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && records.length > 0 && (
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <HistoryIcon className="h-3.5 w-3.5" /> {records.length} record{records.length !== 1 ? 's' : ''} stored
        </p>
      )}
    </div>
  );
}
