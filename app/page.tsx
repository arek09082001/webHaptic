"use client";

import { useState } from "react";
import { useWebHaptics } from "web-haptics/react";

type DemoPattern = {
  id: string;
  name: string;
  description: string;
  pattern: Array<{ duration: number; delay?: number; intensity?: number }>;
  accentClassName: string;
};

const demoPatterns: DemoPattern[] = [
  {
    id: "crisp",
    name: "Crisp Tap",
    description: "A quick confirmation pulse with a sharper second tap.",
    pattern: [
      { duration: 24, intensity: 0.35 },
      { delay: 42, duration: 32, intensity: 0.9 },
    ],
    accentClassName: "from-[var(--accent-ocean)] to-[var(--accent-sky)]",
  },
  {
    id: "surge",
    name: "Surge Pulse",
    description: "A longer two-step pattern for a more dramatic button response.",
    pattern: [
      { duration: 30 },
      { delay: 60, duration: 40, intensity: 1 },
    ],
    accentClassName: "from-[var(--accent-coral)] to-[var(--accent-gold)]",
  },
];

export default function HomePage() {
  const [debugAudio, setDebugAudio] = useState(true);
  const [intensities, setIntensities] = useState<Record<string, number>>({
    crisp: 0.45,
    surge: 0.8,
  });

  const { trigger, isSupported } = useWebHaptics({ debug: debugAudio });

  const playPattern = (patternId: string, pattern: DemoPattern["pattern"]) => {
    const intensity = intensities[patternId] ?? 0.5;
    void trigger(pattern, { intensity });
  };

  return (
    <main className="min-h-screen bg-(--page-background) text-(--text-primary)">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-(--panel-background) px-6 py-8 shadow-[0_30px_80px_rgba(5,12,20,0.28)] backdrop-blur sm:px-8 sm:py-10">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex w-fit rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-(--text-secondary)">
                Web Haptics Demo
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Test two tactile button patterns directly in the browser.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-(--text-secondary) sm:text-lg">
                  This page is reduced to a single purpose: trigger two different haptic responses and tune their intensity live while you debug the feel on device.
                </p>
              </div>
            </div>

            <div className="grid gap-4 self-start rounded-3xl border border-white/10 bg-black/15 p-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-(--text-muted)">Vibration API</p>
                <p className="mt-2 text-xl font-semibold">
                  {isSupported ? "Supported on this device" : "Not supported here"}
                </p>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
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

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {demoPatterns.map((item) => {
            const intensity = intensities[item.id] ?? 0.5;

            return (
              <article
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-(--card-background) p-6 shadow-[0_18px_45px_rgba(4,10,18,0.18)]"
                key={item.id}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${item.accentClassName}`} />
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-[-0.03em]">{item.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{item.description}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-(--text-muted)">
                        {Math.round(intensity * 100)}%
                      </span>
                    </div>
                    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/15 p-4 font-mono text-xs leading-6 text-(--text-muted)">
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
                    className={`inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r px-4 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-white/50 ${item.accentClassName}`}
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