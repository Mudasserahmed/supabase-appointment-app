"use client";

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,hsl(var(--primary)/0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_100%,hsl(var(--primary)/0.1),transparent)]" />

      {/* Animated gradient mesh */}
      <div className="animated-gradient-mesh absolute inset-0 opacity-40" />

      {/* Floating orbs */}
      <div className="animated-orb orb-1 absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="animated-orb orb-2 absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="animated-orb orb-3 absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="animated-orb orb-4 absolute right-1/4 top-2/3 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
      <div className="animated-orb orb-5 absolute left-1/2 top-3/4 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/8 blur-2xl" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom fade into background */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background/80 to-transparent" />
    </div>
  );
}
