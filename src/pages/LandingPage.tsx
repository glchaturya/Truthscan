import { ShieldCheck, ScanLine, Image, Video, AudioLines, AlertTriangle, ArrowRight, Lock, Eye, Activity } from 'lucide-react';
import { navigate } from '@/components/router';
import { Card, SectionTitle } from '@/components/ui';

const FEATURES = [
  {
    icon: Image,
    title: 'Image Verification',
    desc: 'Detect face swaps, inpainting, and pixel-level manipulation in photos and screenshots.',
  },
  {
    icon: Video,
    title: 'Video Analysis',
    desc: 'Flag frame inconsistencies, lip-sync mismatches, and synthetic motion in video clips.',
  },
  {
    icon: AudioLines,
    title: 'Audio Inspection',
    desc: 'Identify cloned voices, spliced speech, and synthetic audio artifacts in recordings.',
  },
];

const PIPELINE = [
  { icon: ScanLine, title: 'Upload', desc: 'Drag and drop an image, video, or audio file for inspection.' },
  { icon: Activity, title: 'Analyze', desc: 'The system inspects media for manipulation indicators.' },
  { icon: ShieldCheck, title: 'Review', desc: 'Receive an authenticity assessment with a confidence score and indicators.' },
];

export default function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-fade" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-electric-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-electric-400/30 bg-electric-500/10 px-4 py-1.5 text-xs font-medium text-electric-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-300" />
              </span>
              AI-Assisted Media Verification
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Trust What You See.
              <br />
              <span className="text-gradient">Verify What You Hear.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              TRUTHSCAN analyzes images, videos, and audio recordings to surface potential deepfakes
              and digital manipulation — giving you an evidence-based second opinion on whether
              digital media is authentic.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate('dashboard')}
                className="group inline-flex items-center gap-2 rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-glow transition-all hover:bg-electric-400 hover:shadow-glow-lg"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate('about')}
                className="rounded-lg border border-navy-600 bg-navy-800/60 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-electric-400/40 hover:text-white"
              >
                Learn How It Works
              </button>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="mx-auto mt-16 max-w-4xl animate-fade-in-up">
            <Card className="overflow-hidden p-1 glow-border">
              <div className="rounded-xl bg-navy-900/80 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-400/70" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                  </div>
                  <span className="font-mono text-xs text-slate-500">truthscan / dashboard preview</span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[Image, Video, AudioLines].map((Icon, i) => (
                    <div key={i} className="rounded-lg border border-navy-700 bg-navy-850 p-5 text-center">
                      <Icon className="mx-auto h-8 w-8 text-electric-300" />
                      <p className="mt-3 text-sm font-medium text-white">{['Image', 'Video', 'Audio'][i]} Analysis</p>
                      <p className="mt-1 text-xs text-slate-500">Ready to scan</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          kicker="What TRUTHSCAN Does"
          title="One system for every media type"
          subtitle="Deepfakes now span images, video, and audio. TRUTHSCAN brings all three under a single verification workflow."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="glow-border-hover p-6 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-electric-400/30 bg-electric-500/10">
                <f.icon className="h-6 w-6 text-electric-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* PIPELINE */}
      <section className="border-y border-navy-700/50 bg-navy-900/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="How It Works"
            title="A simple three-step verification flow"
            subtitle="From upload to assessment in minutes — with transparent indicators you can inspect yourself."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PIPELINE.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-electric-500/15">
                  <step.icon className="h-6 w-6 text-electric-300" />
                </div>
                <span className="absolute right-0 top-0 font-mono text-5xl font-bold text-navy-700">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / LIMITS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <Lock className="h-6 w-6 text-electric-300" />
            <h3 className="mt-3 font-semibold text-white">Evidence-based</h3>
            <p className="mt-2 text-sm text-slate-400">Every assessment surfaces the manipulation indicators it found so you can judge for yourself.</p>
          </Card>
          <Card className="p-6">
            <Eye className="h-6 w-6 text-electric-300" />
            <h3 className="mt-3 font-semibold text-white">Transparent</h3>
            <p className="mt-2 text-sm text-slate-400">Confidence scores and limitations are stated openly — no black-box verdicts.</p>
          </Card>
          <Card className="border-amber-500/20 bg-amber-500/5 p-6">
            <AlertTriangle className="h-6 w-6 text-amber-300" />
            <h3 className="mt-3 font-semibold text-white">Not absolute proof</h3>
            <p className="mt-2 text-sm text-slate-400">AI predictions assist verification but can be wrong. Never use them as the sole basis for consequential decisions.</p>
          </Card>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-electric-400/20 bg-navy-900/60 p-8 text-center glow-border">
          <h3 className="text-2xl font-bold text-white">Ready to verify your media?</h3>
          <p className="max-w-xl text-slate-400">Upload an image, video, or audio file and get an AI-assisted authenticity assessment.</p>
          <button
            onClick={() => navigate('dashboard')}
            className="group inline-flex items-center gap-2 rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-glow transition-all hover:bg-electric-400"
          >
            Start Analyzing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
}
