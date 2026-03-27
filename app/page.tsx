"use client";

import { useState } from "react";
import { useWebHaptics } from "web-haptics/react";

type DemoPattern = {
  id: string;
  name: string;
  useCase: string;
  description: string;
  feeling: string;
  recommended: boolean;
  pattern: Array<{ duration: number; delay?: number; intensity?: number }>;
  defaultIntensity: number;
  accentClassName: string;
};

const demoPatterns: DemoPattern[] = [
  {
    id: "login-soft",
    name: "Login Soft",
    useCase: "Login",
    description: "A clean, light confirmation that feels successful without demanding attention.",
    feeling: "Polite and trustworthy",
    recommended: true,
    pattern: [
      { duration: 18, intensity: 0.35 },
      { delay: 44, duration: 24, intensity: 0.55 },
    ],
    defaultIntensity: 0.45,
    accentClassName: "from-[var(--accent-ocean)] to-[var(--accent-sky)]",
  },
  {
    id: "login-crisp",
    name: "Login Crisp",
    useCase: "Login",
    description: "A slightly sharper login acknowledgment if you want a stronger sense of completion.",
    feeling: "Fast and confident",
    recommended: false,
    pattern: [
      { duration: 22, intensity: 0.45 },
      { delay: 38, duration: 28, intensity: 0.8 },
    ],
    defaultIntensity: 0.55,
    accentClassName: "from-[var(--accent-slate)] to-[var(--accent-cloud)]",
  },
  {
    id: "tracking-start",
    name: "Tracking Start",
    useCase: "Start tracking",
    description: "A positive launch pulse that feels energetic without turning into an error-style buzz.",
    feeling: "Ready to move",
    recommended: true,
    pattern: [
      { duration: 24, intensity: 0.45 },
      { delay: 52, duration: 34, intensity: 0.95 },
    ],
    defaultIntensity: 0.75,
    accentClassName: "from-[var(--accent-coral)] to-[var(--accent-gold)]",
  },
  {
    id: "tracking-start-heavy",
    name: "Tracking Start Heavy",
    useCase: "Start tracking",
    description: "A more assertive start cue for cases where the user should clearly feel that recording began.",
    feeling: "Punchy and obvious",
    recommended: false,
    pattern: [
      { duration: 30, intensity: 0.65 },
      { delay: 46, duration: 42, intensity: 1 },
    ],
    defaultIntensity: 0.85,
    accentClassName: "from-[var(--accent-amber)] to-[var(--accent-gold)]",
  },
  {
    id: "tracking-pause",
    name: "Tracking Pause",
    useCase: "Pause tracking",
    description: "A restrained pause signal that feels like a gentle hold rather than a stop or failure.",
    feeling: "Controlled and calm",
    recommended: true,
    pattern: [
      { duration: 20, intensity: 0.45 },
      { delay: 78, duration: 18, intensity: 0.25 },
    ],
    defaultIntensity: 0.5,
    accentClassName: "from-[var(--accent-mint)] to-[var(--accent-jade)]",
  },
  {
    id: "tracking-resume",
    name: "Tracking Resume",
    useCase: "Resume tracking",
    description: "A short nudge that feels lighter than start, useful when work resumes after a pause.",
    feeling: "Back in motion",
    recommended: false,
    pattern: [
      { duration: 16, intensity: 0.35 },
      { delay: 34, duration: 22, intensity: 0.65 },
    ],
    defaultIntensity: 0.55,
    accentClassName: "from-[var(--accent-jade)] to-[var(--accent-ocean)]",
  },
  {
    id: "tracking-stop",
    name: "Tracking Stop",
    useCase: "Stop tracking",
    description: "A firm ending pattern that communicates closure without feeling like a warning or an error.",
    feeling: "Deliberate and final",
    recommended: true,
    pattern: [
      { duration: 30, intensity: 0.75 },
      { delay: 72, duration: 26, intensity: 0.45 },
    ],
    defaultIntensity: 0.7,
    accentClassName: "from-[var(--accent-rose)] to-[var(--accent-coral)]",
  },
];

const primaryFlow = ["login-soft", "tracking-start", "tracking-pause", "tracking-stop"];

export default function HomePage() {
  const [debugAudio, setDebugAudio] = useState(true);
  const [intensities, setIntensities] = useState<Record<string, number>>(
    Object.fromEntries(demoPatterns.map((pattern) => [pattern.id, pattern.defaultIntensity]))
  );

  const { trigger, isSupported } = useWebHaptics({ debug: debugAudio });

  const playPattern = (patternId: string, pattern: DemoPattern["pattern"]) => {
    const intensity = intensities[patternId] ?? 0.5;
    void trigger(pattern, { intensity });
  };

  const flowPatterns = primaryFlow
    .map((id) => demoPatterns.find((pattern) => pattern.id === id))
    .filter((pattern): pattern is DemoPattern => Boolean(pattern));

  return (
    <main className="min-h-screen bg-(--page-background) text-(--text-primary)">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-(--panel-background) px-5 py-6 shadow-[0_30px_80px_rgba(5,12,20,0.28)] backdrop-blur sm:px-7 sm:py-8 lg:px-8 lg:py-10">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            <div className="space-y-6">
              <span className="inline-flex w-fit rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-(--text-secondary)">
                Web Haptics Demo For Mobile Testing
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Tune the right haptic feedback for login, start, pause, and stop.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-(--text-secondary) sm:text-lg">
                  This board is built for phone testing. Try the core time-recording flow first, then compare the extended examples below until the app feels right in the hand instead of just looking right on screen.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-(--text-secondary) sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-(--text-muted)">Best on device</p>
                  <p className="mt-2 leading-6">Use a real phone to compare actual vibration strength. Desktop audio is only a proxy.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-(--text-muted)">Recommended flow</p>
                  <p className="mt-2 leading-6">Start with Login Soft, Tracking Start, Tracking Pause, and Tracking Stop.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-(--text-muted)">Slider purpose</p>
                  <p className="mt-2 leading-6">Keep the pattern shape, then nudge intensity until it feels natural during repeated use.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 self-start rounded-3xl border border-white/10 bg-black/15 p-4 sm:grid-cols-2 lg:grid-cols-1 lg:p-5">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:p-5">
                <p className="text-sm font-medium text-(--text-muted)">Vibration API</p>
                <p className="mt-2 text-xl font-semibold">
                  {isSupported ? "Supported on this device" : "Not supported here"}
                </p>
                <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
                  iOS and Android can feel different even with the same pattern, so compare on the real hardware you care about.
                </p>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:p-5">
                <div>
                  <p className="text-sm font-medium text-(--text-muted)">Desktop debug audio</p>
                  <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
                    Keeps the demo testable when vibration hardware is unavailable.
                  </p>
                </div>
                <span className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-white/12 p-1 transition">
                  <input
                    checked={debugAudio}
                    className="peer sr-only"
                    onChange={(event) => setDebugAudio(event.target.checked)}
                    type="checkbox"
                  />
                  <span className="absolute inset-1 rounded-full bg-white/8 peer-checked:bg-white/15" />
                  <span className="relative h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
                </span>
              </label>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--text-muted)">Core Workflow</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Tap through the real time-recording journey</h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {flowPatterns.map((item) => {
              const intensity = intensities[item.id] ?? item.defaultIntensity;

              return (
                <button
                  className={`group relative min-h-[9rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-(--card-background) p-5 text-left shadow-[0_18px_45px_rgba(4,10,18,0.18)] transition active:scale-[0.99] ${item.accentClassName}`}
                  key={item.id}
                  onClick={() => playPattern(item.id, item.pattern)}
                  type="button"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-white/12 to-transparent opacity-70" />
                  <div className="relative flex h-full flex-col justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-950/65">{item.useCase}</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-950/75">{item.feeling}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium text-slate-950/75">
                      <span>{Math.round(intensity * 100)}% intensity</span>
                      <span>Tap to test</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {demoPatterns.map((item) => {
            const intensity = intensities[item.id] ?? item.defaultIntensity;

            return (
              <article
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-(--card-background) p-5 shadow-[0_18px_45px_rgba(4,10,18,0.18)] sm:p-6"
                key={item.id}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${item.accentClassName}`} />
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
                            {item.useCase}
                          </span>
                          {item.recommended ? (
                            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                              Recommended
                            </span>
                          ) : null}
                        </div>
                        <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{item.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{item.description}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-(--text-muted)">
                        {Math.round(intensity * 100)}%
                      </span>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-(--text-muted)">
                      {item.feeling}
                    </div>
                    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/15 p-4 font-mono text-[11px] leading-6 text-(--text-muted) sm:text-xs">
{`trigger(${JSON.stringify(item.pattern, null, 2)}, {
  intensity: ${intensity.toFixed(2)}
})`}
                    </pre>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-(--text-secondary)">
                      <span>Intensity</span>
                      <span>{intensity.toFixed(2)}</span>
                    </div>
                    <input
                      aria-label={`${item.name} intensity`}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
                      max="1"
                      min="0"
                      onChange={(event) => {
                        const nextValue = Number(event.target.value);
                        setIntensities((current) => ({ ...current, [item.id]: nextValue }));
                      }}
                      step="0.05"
                      type="range"
                      value={intensity}
                    />
                    <div className="flex justify-between text-xs uppercase tracking-[0.18em] text-(--text-muted)">
                      <span>0.00</span>
                      <span>1.00</span>
                    </div>
                  </div>

                  <button
                    className={`inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-linear-to-r px-4 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-white/50 ${item.accentClassName}`}
                    onClick={() => playPattern(item.id, item.pattern)}
                    type="button"
                  >
                    Trigger {item.name}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}