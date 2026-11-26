import { useCallback, useRef, useState } from 'react';
import { Image, Video, AudioLines, UploadCloud, FileCheck2, X, Loader2, ScanLine } from 'lucide-react';
import type { MediaType } from '@/lib/types';
import { detectMediaType, formatBytes } from '@/lib/media';
import { useAnalysis } from '@/lib/analysis-context';
import { navigate } from '@/components/router';
import { Card, Badge } from '@/components/ui';
import { ANALYSIS_API_URL } from '@/lib/supabase';

const TABS: { key: MediaType; label: string; icon: typeof Image; accept: string }[] = [
  { key: 'image', label: 'Image', icon: Image, accept: 'image/*' },
  { key: 'video', label: 'Video', icon: Video, accept: 'video/*' },
  { key: 'audio', label: 'Audio', icon: AudioLines, accept: 'audio/*' },
];

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export default function DashboardPage() {
  const { pending, setPending, analyze } = useAnalysis();
  const [activeTab, setActiveTab] = useState<MediaType>(pending?.mediaType ?? 'image');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File, expected?: MediaType) => {
      setError(null);
      if (file.size > MAX_SIZE) {
        setError('File is too large. Maximum size is 100MB.');
        return;
      }
      const detected = detectMediaType(file);
      if (!detected) {
        setError('Unsupported file type. Please upload an image, video, or audio file.');
        return;
      }
      if (expected && detected !== expected) {
        setActiveTab(detected); // switch to the real type
      }
      setPending(file);
    },
    [setPending]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file, activeTab);
    },
    [handleFile, activeTab]
  );

  const onAnalyze = useCallback(async () => {
    if (!pending) return;
    setAnalyzing(true);
    setError(null);
    try {
      await analyze(pending.file, pending.mediaType);
      navigate('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while saving the analysis.');
    } finally {
      setAnalyzing(false);
    }
  }, [pending, analyze]);

  const clearFile = useCallback(() => {
    setPending(null);
    setError(null);
  }, [setPending]);

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-300">Analysis Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Verify your media</h1>
        <p className="mt-2 text-slate-400">Choose a media type, upload a file, and run an authenticity analysis.</p>
      </div>

      {/* Media type tabs */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              clearFile();
            }}
            className={`group flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'border-electric-400/50 bg-electric-500/10 text-electric-200 glow-border'
                : 'border-navy-700 bg-navy-900/60 text-slate-400 hover:border-navy-600 hover:text-white'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Drop zone / preview */}
      {!pending ? (
        <Card
          className={`relative flex flex-col items-center justify-center border-2 border-dashed p-12 text-center transition-all ${
            dragging ? 'border-electric-400 bg-electric-500/5 glow-border' : 'border-navy-700 bg-navy-900/40'
          }`}
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className="flex w-full flex-col items-center py-8"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-electric-400/30 bg-electric-500/10">
              <UploadCloud className="h-8 w-8 text-electric-300" />
            </div>
            <p className="mt-4 text-lg font-semibold text-white">Drag &amp; drop your {activeTab} file here</p>
            <p className="mt-1 text-sm text-slate-500">or click to browse — max 100MB</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-5 rounded-lg bg-electric-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-electric-400"
            >
              Browse Files
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={TABS.find((t) => t.key === activeTab)?.accept}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file, activeTab);
                e.target.value = '';
              }}
            />
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden p-6 animate-slide-up">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Preview */}
            <div className="md:w-1/2">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-navy-700 bg-navy-950">
                {pending.mediaType === 'image' && pending.previewUrl && (
                  <img src={pending.previewUrl} alt="preview" className="h-full w-full object-contain" />
                )}
                {pending.mediaType === 'video' && pending.previewUrl && (
                  <video src={pending.previewUrl} controls className="h-full w-full object-contain" />
                )}
                {pending.mediaType === 'audio' && (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <AudioLines className="h-12 w-12 text-electric-300" />
                    <span className="text-sm">Audio file ready</span>
                  </div>
                )}
              </div>
            </div>

            {/* File info */}
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-electric-300" />
                  <span className="font-medium text-white">{pending.file.name}</span>
                </div>
                <button onClick={clearFile} className="rounded-md p-1.5 text-slate-400 hover:bg-navy-700 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info label="Media type" value={<Badge tone="info">{pending.mediaType}</Badge>} />
                <Info label="Size" value={<span className="text-slate-200">{formatBytes(pending.file.size)}</span>} />
                <Info label="Format" value={<span className="text-slate-200">{pending.file.type || 'unknown'}</span>} />
                <Info label="Status" value={<Badge tone="neutral">Ready to analyze</Badge>} />
              </div>

              {error && (
                <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>
              )}

              <div className="mt-auto pt-6">
                <button
                  onClick={onAnalyze}
                  disabled={analyzing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-glow transition-all hover:bg-electric-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {analyzing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving analysis…</>
                  ) : (
                    <><ScanLine className="h-4 w-4" /> Analyze Media</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Backend readiness notice */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-navy-700 bg-navy-900/50 p-4 text-sm">
        {ANALYSIS_API_URL ? (
          <>
            <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            <p className="text-slate-400">
              Analysis backend is connected. Uploaded files will be sent for AI inspection and results stored to your history.
            </p>
          </>
        ) : (
          <>
            <ScanLine className="mt-0.5 h-4 w-4 shrink-0 text-electric-300" />
            <p className="text-slate-400">
              <span className="font-semibold text-electric-200">Demo mode:</span> the analysis flow is fully built and ready,
              but no Python Flask backend is connected yet. Running analysis will create a record and take you to the results
              page, where you'll see a clear notice that AI detection is not yet active. Connect a backend via{' '}
              <code className="rounded bg-navy-800 px-1.5 py-0.5 font-mono text-xs text-electric-200">VITE_ANALYSIS_API_URL</code>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-850 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1">{value}</div>
    </div>
  );
}
