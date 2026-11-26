import { useEffect, useState } from 'react';
import {
  ShieldCheck, ShieldAlert, ShieldQuestion, Loader2, AlertTriangle, ArrowLeft, RotateCcw,
  Image, Video, AudioLines, CheckCircle2, XCircle, Info, FileWarning,
} from 'lucide-react';
import type { AnalysisRecord, AnalysisResult, MediaType, ManipulationIndicator } from '@/lib/types';
import { useAnalysis } from '@/lib/analysis-context';
import { createSignal, navigate } from '@/components/router';
import { Card, Badge, SectionTitle } from '@/components/ui';
import { formatBytes, formatDate } from '@/lib/media';

const MEDIA_ICON: Record<MediaType, typeof Image> = { image: Image, video: Video, audio: AudioLines };

export default function ResultsPage() {
  const { current, loadRecord } = useAnalysis();
  const { params } = createSignal();
  const [record, setRecord] = useState<AnalysisRecord | null>(current);
  const [loading, setLoading] = useState(false);

  // If we arrived via history with an id, load it.
  useEffect(() => {
    if (current && !params.id) { setRecord(current); return; }
    if (params.id) {
      setLoading(true);
      loadRecord(params.id).then((r) => { setRecord(r); setLoading(false); });
    }
  }, [params.id, current, loadRecord]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-electric-300" />
      </div>
    );
  }

  if (!record) {
    return <EmptyState />;
  }

  const result = record.result;
  const isCompleted = record.status === 'completed' && result;
  const isFailed = record.status === 'failed';
  const isPending = !isCompleted && !isFailed;

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-electric-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      {/* Header */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-electric-400/30 bg-electric-500/10">
              {(() => { const Icon = MEDIA_ICON[record.media_type]; return <Icon className="h-7 w-7 text-electric-300" />; })()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{record.filename}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {formatBytes(record.file_size)} · {record.media_type} · analyzed {formatDate(record.created_at)}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-2 rounded-lg border border-navy-600 bg-navy-800/60 px-4 py-2 text-sm font-medium text-slate-200 hover:border-electric-400/40 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" /> New Analysis
          </button>
        </div>
      </Card>

      {isPending && <PendingState record={record} />}
      {isFailed && <FailedState record={record} />}
      {isCompleted && <CompletedState record={record} result={result!} />}

      {/* Persistent warning */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm text-amber-200/90">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        <p>
          <span className="font-semibold">Important:</span> AI predictions are not absolute proof of authenticity or
          manipulation. They are a signal to aid human judgment. Always corroborate with additional evidence before
          making consequential decisions.
        </p>
      </div>
    </div>
  );
}

function PendingState({ record }: { record: AnalysisRecord }) {
  return (
    <Card className="border-electric-400/30 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-electric-400/30 bg-electric-500/10">
        <ShieldQuestion className="h-8 w-8 text-electric-300" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">Analysis recorded — AI detection not yet active</h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-400">
        Your media has been saved to history, but no Python Flask analysis backend is currently connected.
        This is a <span className="font-semibold text-electric-200">demo of the verification interface</span> — no
        authenticity score or manipulation indicators will be produced until a backend is configured.
      </p>
      <div className="mx-auto mt-6 max-w-md rounded-lg border border-navy-700 bg-navy-850 p-4 text-left text-xs text-slate-400">
        <p className="font-mono text-electric-200">To enable real analysis:</p>
        <p className="mt-2">Set <code className="rounded bg-navy-800 px-1.5 py-0.5 font-mono">VITE_ANALYSIS_API_URL</code> to your Flask server URL, accepting a multipart file upload at <code className="font-mono">/analyze</code> and returning JSON matching the expected result schema.</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <Badge tone="info">{record.media_type}</Badge>
        <Badge tone="neutral">Status: {record.status}</Badge>
        <button onClick={() => navigate('history')} className="rounded-lg border border-navy-600 px-4 py-2 text-slate-200 hover:border-electric-400/40 hover:text-white">View History</button>
      </div>
    </Card>
  );
}

function FailedState({ record }: { record: AnalysisRecord }) {
  return (
    <Card className="border-rose-500/30 bg-rose-500/5 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10">
        <FileWarning className="h-8 w-8 text-rose-300" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">Analysis failed</h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-400">
        The backend could not complete this analysis. The record has been saved to history with the error below.
      </p>
      {record.error_message && (
        <p className="mx-auto mt-4 max-w-md rounded-lg border border-rose-500/20 bg-navy-900/70 p-3 font-mono text-xs text-rose-200">
          {record.error_message}
        </p>
      )}
    </Card>
  );
}

function CompletedState({ record, result }: { record: AnalysisRecord; result: AnalysisResult }) {
  const tone = result.authenticity === 'authentic' ? 'success' : result.authenticity === 'manipulated' ? 'danger' : 'warning';
  const Icon = result.authenticity === 'authentic' ? ShieldCheck : result.authenticity === 'manipulated' ? ShieldAlert : ShieldQuestion;
  const label = result.authenticity === 'authentic' ? 'Likely Authentic' : result.authenticity === 'manipulated' ? 'Likely Manipulated' : 'Inconclusive';

  return (
    <div className="space-y-6">
      {/* Verdict + confidence */}
      <Card className="overflow-hidden p-6">
        <div className="grid gap-6 md:grid-cols-[1fr,auto] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-300">Authenticity Assessment</p>
            <div className="mt-3 flex items-center gap-3">
              <Icon className={`h-9 w-9 ${tone === 'success' ? 'text-emerald-300' : tone === 'danger' ? 'text-rose-300' : 'text-amber-300'}`} />
              <h2 className="text-2xl font-bold text-white">{label}</h2>
              <Badge tone={tone}>{result.authenticity}</Badge>
            </div>
            <p className="mt-3 max-w-xl text-sm text-slate-400">{result.summary}</p>
          </div>
          <ConfidenceMeter value={result.confidence} />
        </div>
      </Card>

      {/* Meta grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetaCard label="Media type" value={<Badge tone="info">{record.media_type}</Badge>} />
        <MetaCard label="File size" value={<span className="text-slate-200">{formatBytes(record.file_size)}</span>} />
        <MetaCard label="Model" value={<span className="text-slate-200">{result.model_version ?? '—'}</span>} />
      </div>

      {/* Indicators */}
      <Card className="p-6">
        <SectionTitle kicker="Manipulation Indicators" title="What the analysis found" subtitle="Each indicator is a signal, not proof. Review them in context." />
        <div className="mt-5 space-y-3">
          {result.indicators.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
              <CheckCircle2 className="h-5 w-5" /> No notable manipulation indicators were detected.
            </div>
          ) : (
            result.indicators.map((ind, i) => <IndicatorRow key={i} ind={ind} />)
          )}
        </div>
      </Card>
    </div>
  );
}

function IndicatorRow({ ind }: { ind: ManipulationIndicator }) {
  const cfg = {
    low: { icon: Info, cls: 'border-electric-400/20 bg-electric-500/5 text-electric-200' },
    medium: { icon: AlertTriangle, cls: 'border-amber-500/25 bg-amber-500/5 text-amber-200' },
    high: { icon: XCircle, cls: 'border-rose-500/25 bg-rose-500/5 text-rose-200' },
  }[ind.severity];
  const Icon = cfg.icon;
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${cfg.cls}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-medium text-white">{ind.label}</p>
        <p className="mt-0.5 text-sm text-slate-400">{ind.detail}</p>
        <span className="mt-2 inline-block rounded-full bg-navy-800 px-2 py-0.5 text-xs uppercase tracking-wide text-slate-400">{ind.severity} severity</span>
      </div>
    </div>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const color = v >= 70 ? '#34d399' : v >= 40 ? '#fbbf24' : '#fb7185';
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1a2447" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(v / 100) * 264} 264`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{v}%</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-500">confidence</span>
        </div>
      </div>
      <p className="mt-2 max-w-[10rem] text-center text-xs text-slate-500">Model confidence in this assessment</p>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1.5">{value}</div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center animate-fade-in">
      <ShieldQuestion className="mx-auto h-12 w-12 text-slate-600" />
      <h1 className="mt-4 text-2xl font-bold text-white">No analysis to show</h1>
      <p className="mt-3 text-slate-400">Upload and analyze media to see results here.</p>
      <button
        onClick={() => navigate('dashboard')}
        className="mt-6 rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-navy-950 hover:bg-electric-400"
      >
        Go to Dashboard
      </button>
    </div>
  );
}


