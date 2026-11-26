import { AlertTriangle, Brain, Eye, Mic, Film, ShieldQuestion, Target, Lock, Scale, ArrowRight } from 'lucide-react';
import { navigate } from '@/components/router';
import { Card, SectionTitle, Badge } from '@/components/ui';

export default function AboutPage() {
  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle
        kicker="About TRUTHSCAN"
        title="Understanding deepfakes and verification"
        subtitle="What deepfake technology is, why TRUTHSCAN exists, and the honest limits of what it can tell you."
      />

      {/* What is a deepfake */}
      <Card className="mt-8 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-electric-400/30 bg-electric-500/10">
            <Brain className="h-6 w-6 text-electric-300" />
          </div>
          <h2 className="text-xl font-bold text-white">What is a deepfake?</h2>
        </div>
        <p className="mt-4 text-slate-300">
          A <span className="font-semibold text-white">deepfake</span> is media — an image, video, or audio
          recording — synthesized or altered using machine learning to depict something that didn't happen, or
          someone saying or doing something they never did. The most common techniques include:
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <TechniqueCard icon={Eye} title="Face swap / reenactment" desc="Replacing one person's face with another's, or puppeting facial expressions from a source video." />
          <TechniqueCard icon={Film} title="Inpainting / editing" desc="Removing, adding, or altering regions of a frame so the original content is hidden or changed." />
          <TechniqueCard icon={Mic} title="Voice cloning" desc="Generating synthetic speech that imitates a target speaker's timbre and cadence from a short sample." />
        </div>
        <p className="mt-5 text-sm text-slate-400">
          As these tools become cheaper and more accessible, fabricated media can spread misinformation, enable
          fraud, and erode trust. Verification systems aim to push back by surfacing the artifacts these methods leave behind.
        </p>
      </Card>

      {/* Purpose */}
      <Card className="mt-6 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-electric-400/30 bg-electric-500/10">
            <Target className="h-6 w-6 text-electric-300" />
          </div>
          <h2 className="text-xl font-bold text-white">Why TRUTHSCAN exists</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Pillar icon={Lock} title="Assist, not replace" desc="TRUTHSCAN is a second pair of eyes. It flags potential manipulation so a human can investigate further — it does not issue verdicts on its own." />
          <Pillar icon={Eye} title="Transparency first" desc="Every assessment comes with the indicators that drove it and a confidence score, so you can see the reasoning, not just a label." />
        </div>
      </Card>

      {/* How it works (high level) */}
      <Card className="mt-6 p-6">
        <h2 className="text-xl font-bold text-white">How analysis works</h2>
        <ol className="mt-4 space-y-3 text-slate-300">
          {[
            'You upload an image, video, or audio file through the dashboard.',
            'The file is sent to a Python Flask analysis backend, which runs detection models tailored to that media type.',
            'The backend returns an authenticity assessment, a confidence score, and a list of manipulation indicators.',
            'Results are displayed on the Results page and stored in your History for later review.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric-500/15 font-mono text-xs font-semibold text-electric-200">{i + 1}</span>
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* Limitations */}
      <Card className="mt-6 border-amber-500/25 bg-amber-500/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10">
            <ShieldQuestion className="h-6 w-6 text-amber-300" />
          </div>
          <h2 className="text-xl font-bold text-white">Limitations you should know</h2>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-amber-100/90">
          {[
            'AI predictions are probabilistic, not certain. A "likely authentic" or "likely manipulated" result can be wrong.',
            'Detection models lag behind generation techniques. Highly sophisticated fakes may pass undetected.',
            'Heavy compression, resizing, or low-quality uploads can mask the very artifacts detection relies on.',
            'A clean result is not proof of authenticity — only that no manipulation indicators were found at this time.',
            'TRUTHSCAN must never be the sole basis for legal, journalistic, or other consequential decisions.',
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Responsible use */}
      <Card className="mt-6 p-6">
        <div className="flex items-center gap-3">
          <Scale className="h-6 w-6 text-electric-300" />
          <h2 className="text-xl font-bold text-white">Responsible use</h2>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Use TRUTHSCAN to support your own judgment — combine its signals with source verification, context, and
          cross-referencing. Treat every result as one data point among many.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Badge tone="info">Research &amp; verification assistance</Badge>
          <Badge tone="warning">Not a legal verdict</Badge>
          <Badge tone="neutral">Human-in-the-loop</Badge>
        </div>
      </Card>

      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-electric-400/20 bg-navy-900/60 p-8 text-center glow-border">
        <h3 className="text-xl font-bold text-white">Try it on your own media</h3>
        <button
          onClick={() => navigate('dashboard')}
          className="group inline-flex items-center gap-2 rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-glow transition-all hover:bg-electric-400"
        >
          Open the Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function TechniqueCard({ icon: Icon, title, desc }: { icon: typeof Eye; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-850 p-4">
      <Icon className="h-5 w-5 text-electric-300" />
      <p className="mt-2 font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{desc}</p>
    </div>
  );
}

function Pillar({ icon: Icon, title, desc }: { icon: typeof Eye; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-850 p-4">
      <Icon className="h-5 w-5 text-electric-300" />
      <p className="mt-2 font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{desc}</p>
    </div>
  );
}
