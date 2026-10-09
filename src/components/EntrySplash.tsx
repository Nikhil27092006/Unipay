import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function EntrySplash({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);

  const containerRef   = useRef<HTMLDivElement>(null);
  const bgAuraRef      = useRef<HTMLDivElement>(null);
  const ring1Ref       = useRef<HTMLDivElement>(null);
  const ring2Ref       = useRef<HTMLDivElement>(null);

  // SVG parts
  const walletBodyRef  = useRef<SVGGElement>(null);
  const walletFlapRef  = useRef<SVGGElement>(null);
  const personLeftRef  = useRef<SVGGElement>(null);
  const personCenterRef= useRef<SVGGElement>(null);
  const personRightRef = useRef<SVGGElement>(null);
  const shineRef       = useRef<SVGRectElement>(null);

  // Text
  const brandRef  = useRef<HTMLDivElement>(null);
  const tagRef    = useRef<HTMLDivElement>(null);
  const progressRef= useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Particles
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const exitAndHide = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.03,
      duration: 0.55,
      ease: 'power3.inOut',
      delay: 0.3,
      onComplete: () => {
        setVisible(false);
        onComplete?.();
      },
    });
  };

  useEffect(() => {
    if (!visible) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: exitAndHide });
      tlRef.current = tl;

      // ── Initial hidden states ──────────────────────────────────
      gsap.set([ring1Ref.current, ring2Ref.current], { scale: 0, opacity: 0 });
      gsap.set(bgAuraRef.current,    { opacity: 0, scale: 0.5 });
      gsap.set(walletBodyRef.current,  { y: 120, opacity: 0, scale: 0.7 });
      gsap.set(walletFlapRef.current,  { y: 120, opacity: 0, scale: 0.7 });
      gsap.set(personLeftRef.current,  { y: 60,  opacity: 0, scale: 0 });
      gsap.set(personCenterRef.current,{ y: 80,  opacity: 0, scale: 0 });
      gsap.set(personRightRef.current, { y: 60,  opacity: 0, scale: 0 });
      gsap.set(shineRef.current,       { x: -260, opacity: 0 });
      gsap.set(brandRef.current,  { opacity: 0, y: 28, scale: 0.92 });
      gsap.set(tagRef.current,    { opacity: 0, y: 14 });
      gsap.set(loaderRef.current, { opacity: 0 });
      gsap.set(particleRefs.current, { scale: 0, opacity: 0 });

      // ── 0.0s  Ambient aura blooms ─────────────────────────────
      tl.to(bgAuraRef.current, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0);

      // ── 0.1s  Pulse ring 1 expands and fades ─────────────────
      tl.to(ring1Ref.current, { opacity: 0.6, scale: 1, duration: 0.4, ease: 'power3.out' }, 0.1)
        .to(ring1Ref.current, { opacity: 0,   scale: 2.5, duration: 1.0, ease: 'power2.out' }, 0.45);

      // ── 0.25s Pulse ring 2 (delayed) ─────────────────────────
      tl.to(ring2Ref.current, { opacity: 0.4, scale: 1, duration: 0.4, ease: 'power3.out' }, 0.3)
        .to(ring2Ref.current, { opacity: 0,   scale: 2.8, duration: 1.2, ease: 'power2.out' }, 0.65);

      // ── 0.2s  WALLET BODY slides up from below with spring ────
      tl.to(walletBodyRef.current, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.75,
        ease: 'back.out(1.6)',
      }, 0.2);

      // ── 0.35s WALLET FLAP follows slightly delayed ────────────
      tl.to(walletFlapRef.current, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.65,
        ease: 'back.out(1.4)',
      }, 0.35);

      // ── 0.75s LEFT PERSON (teal) pops up from wallet ─────────
      tl.to(personLeftRef.current, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.55,
        ease: 'back.out(2.2)',
      }, 0.75);

      // ── 0.95s CENTER PERSON (blue) — tallest, most prominent ─
      tl.to(personCenterRef.current, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.60,
        ease: 'back.out(2.4)',
      }, 0.95);

      // ── 1.10s RIGHT PERSON (purple) pops up last ─────────────
      tl.to(personRightRef.current, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.55,
        ease: 'back.out(2.2)',
      }, 1.10);

      // ── 1.35s Shimmer sweep across entire SVG ─────────────────
      tl.to(shineRef.current, {
        x: 280, opacity: 1,
        duration: 0.75,
        ease: 'power2.inOut',
      }, 1.35)
      .to(shineRef.current, { opacity: 0, duration: 0.2 }, 2.0);

      // ── 1.30s Floating idle bounce ────────────────────────────
      tl.to([walletBodyRef.current, walletFlapRef.current,
              personLeftRef.current, personCenterRef.current, personRightRef.current], {
        y: '-=8',
        duration: 0.9,
        repeat: 1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.04,
      }, 1.65);

      // ── 1.25s Particles burst ─────────────────────────────────
      tl.to(particleRefs.current, {
        scale: 1, opacity: 0.85,
        duration: 0.5,
        stagger: 0.07,
        ease: 'back.out(2)',
      }, 1.25);

      // ── 1.55s Brand name "CoWallet" enters ───────────────────
      tl.to(brandRef.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65,
        ease: 'back.out(1.5)',
      }, 1.55);

      // ── 1.85s Tagline fades in ────────────────────────────────
      tl.to(tagRef.current, {
        opacity: 1, y: 0,
        duration: 0.55,
        ease: 'power3.out',
      }, 1.85);


      // ── 2.10s Loader bar appears ──────────────────────────────
      tl.to(loaderRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, 2.1);

      // Hold for 0.9s extra before exit
      tl.to({}, { duration: 0.9 });

    }, containerRef);

    return () => { ctx.revert(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Listen for replay event
  useEffect(() => {
    const replay = () => setVisible(true);
    window.addEventListener('cowallet-replay-splash', replay);
    return () => window.removeEventListener('cowallet-replay-splash', replay);
  }, []);

  if (!visible) return null;

  const particleData = [
    { top: '20%', left: '12%',  size: 9,  color: '#38BDF8' },
    { top: '15%', right: '15%', size: 11, color: '#818CF8' },
    { top: '38%', left: '7%',   size: 7,  color: '#34D399' },
    { top: '38%', right: '8%',  size: 8,  color: '#A78BFA' },
    { top: '60%', left: '10%',  size: 8,  color: '#F472B6' },
    { top: '62%', right: '11%', size: 7,  color: '#60A5FA' },
    { top: '25%', left: '35%',  size: 5,  color: '#2563EB' },
    { top: '22%', right: '36%', size: 5,  color: '#9333EA' },
    { top: '55%', left: '27%',  size: 6,  color: '#06B6D4' },
    { top: '50%', right: '28%', size: 6,  color: '#EC4899' },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'linear-gradient(165deg, #F0F6FF 0%, #FAF5FF 50%, #F0FBFF 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Background ambient aura ── */}
      <div ref={bgAuraRef} style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, rgba(124,58,237,0.07) 40%, rgba(6,182,212,0.04) 65%, transparent 100%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      {/* ── Pulse rings ── */}
      <div ref={ring1Ref} style={{
        position: 'absolute',
        width: 260, height: 260, borderRadius: '50%',
        border: '2px solid rgba(37,99,235,0.35)',
        boxShadow: '0 0 40px rgba(37,99,235,0.18)',
        pointerEvents: 'none',
        transformOrigin: 'center',
      }} />
      <div ref={ring2Ref} style={{
        position: 'absolute',
        width: 320, height: 320, borderRadius: '50%',
        border: '1.5px solid rgba(124,58,237,0.25)',
        boxShadow: '0 0 30px rgba(124,58,237,0.1)',
        pointerEvents: 'none',
        transformOrigin: 'center',
      }} />

      {/* ── Floating particles ── */}
      {particleData.map((p, i) => (
        <div
          key={i}
          ref={el => { particleRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            ...(p.top && { top: p.top }),
            ...('left' in p && { left: (p as any).left }),
            ...('right' in p && { right: (p as any).right }),
            boxShadow: `0 0 ${p.size * 2}px ${p.color}88`,
            pointerEvents: 'none',
          }}
        />
      ))}


      {/* ── Main content wrapper ── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 2,
        paddingBottom: 20,
      }}>

        {/*
          ─────────────────────────────────────────────────
          ANIMATED SVG LOGO
          Layout (top-down):
            personLeft  personCenter  personRight
                   [ wallet body + flap ]
          ─────────────────────────────────────────────────
        */}
        <svg
          width="240" height="240"
          viewBox="0 0 240 240"
          style={{ overflow: 'visible', marginBottom: 8 }}
        >
          <defs>
            {/* Wallet body gradient – deep navy-blue */}
            <linearGradient id="walletGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1A3A8F" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Wallet accent stripe */}
            <linearGradient id="walletAccent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Flap/clasp gradient */}
            <linearGradient id="flapGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>

            {/* Left person – teal/green */}
            <linearGradient id="personLGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>

            {/* Center person – royal blue */}
            <linearGradient id="personCGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Right person – purple/violet */}
            <linearGradient id="personRGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>

            {/* Shimmer gradient */}
            <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="50%"  stopColor="white" stopOpacity="0.55" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* Drop shadow filter */}
            <filter id="walletShadow" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1D4ED8" floodOpacity="0.3" />
            </filter>
            <filter id="personShadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.18" />
            </filter>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Clip for shimmer */}
            <clipPath id="logoClip">
              <rect x="20" y="110" width="200" height="120" rx="22" />
            </clipPath>
          </defs>

          {/*
            ── WALLET BODY (slides up from below) ──────────────
            Draws at y≈120–225. Centred on x=120.
            Wide rounded rectangle.
          */}
          <g ref={walletBodyRef} filter="url(#walletShadow)">
            {/* Main wallet rectangle */}
            <rect
              x="20" y="118" width="200" height="110"
              rx="22" ry="22"
              fill="url(#walletGrad)"
            />
            {/* Highlight top stripe */}
            <rect
              x="20" y="118" width="200" height="30"
              rx="22" ry="22"
              fill="url(#walletAccent)"
              opacity="0.4"
            />
            {/* Inner card slot lines */}
            <rect x="36" y="148" width="110" height="8" rx="4" fill="white" opacity="0.12" />
            <rect x="36" y="162" width="80"  height="6" rx="3" fill="white" opacity="0.08" />
            <rect x="36" y="174" width="95"  height="6" rx="3" fill="white" opacity="0.08" />
            {/* Bottom chip/logo bar */}
            <rect x="36" y="192" width="50" height="24" rx="6" fill="white" opacity="0.14" />
            <rect x="94" y="196" width="30" height="6"  rx="3" fill="white" opacity="0.1" />
            <rect x="94" y="206" width="22" height="4"  rx="2" fill="white" opacity="0.08" />
          </g>

          {/*
            ── WALLET FLAP & CLASP (follows body) ──────────────
            The right-side flap / clasp tab.
          */}
          <g ref={walletFlapRef} filter="url(#walletShadow)">
            {/* Rounded tab on the right */}
            <rect
              x="185" y="150" width="48" height="48"
              rx="14" ry="14"
              fill="url(#flapGrad)"
            />
            {/* Clasp circle */}
            <circle cx="209" cy="174" r="10" fill="white" opacity="0.95" />
            <circle cx="209" cy="174" r="6"  fill="url(#flapGrad)" />
          </g>

          {/*
            ── LEFT PERSON (teal, shorter, behind center) ───────
            Head circle + body (teardrop) shape.
            Positioned at x≈76, pops up from wallet top edge (y≈118).
          */}
          <g ref={personLeftRef} filter="url(#personShadow)">
            {/* Head */}
            <circle cx="76" cy="82" r="20" fill="url(#personLGrad)" />
            {/* Body */}
            <path
              d="M48,118 Q48,98 76,98 Q104,98 104,118 Z"
              fill="url(#personLGrad)"
            />
          </g>

          {/*
            ── CENTER PERSON (blue, tallest, front/center) ──────
            x≈120.
          */}
          <g ref={personCenterRef} filter="url(#personShadow)">
            {/* Head */}
            <circle cx="120" cy="68" r="26" fill="url(#personCGrad)" />
            {/* Body */}
            <path
              d="M84,118 Q84,94 120,94 Q156,94 156,118 Z"
              fill="url(#personCGrad)"
            />
          </g>

          {/*
            ── RIGHT PERSON (purple, shorter, behind center) ────
            x≈164.
          */}
          <g ref={personRightRef} filter="url(#personShadow)">
            {/* Head */}
            <circle cx="166" cy="82" r="20" fill="url(#personRGrad)" />
            {/* Body */}
            <path
              d="M138,118 Q138,98 166,98 Q194,98 194,118 Z"
              fill="url(#personRGrad)"
            />
          </g>

          {/*
            ── SHIMMER sweep across the whole logo ──────────────
            Clipped to wallet area.
          */}
          <g clipPath="url(#logoClip)">
            <rect
              ref={shineRef}
              x="-80" y="110" width="80" height="130"
              fill="url(#shimmer)"
              style={{ mixBlendMode: 'overlay' }}
            />
          </g>
        </svg>

        {/* ── Brand "CoWallet" ── */}
        <div ref={brandRef} style={{
          display: 'flex', alignItems: 'baseline', gap: 0,
          marginBottom: 8,
          lineHeight: 1,
        }}>
          <span style={{
            fontSize: 42, fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-1.5px',
          }}>Co</span>
          <span style={{
            fontSize: 42, fontWeight: 900,
            background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 40%, #60A5FA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1.5px',
          }}>Wallet</span>
        </div>

        {/* ── Tagline ── */}
        <p ref={tagRef} style={{
          fontSize: 14.5, fontWeight: 500,
          color: '#64748B',
          letterSpacing: '0.03em',
          margin: '0 0 22px 0',
        }}>
          Collective Funds. Clearer Futures.
        </p>

      </div>

      {/* ── Loading bar ── */}
      <div ref={loaderRef} style={{
        position: 'absolute', bottom: 32,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 150, height: 3, borderRadius: 3,
          background: '#E2E8F0', overflow: 'hidden',
        }}>
          <div
            ref={progressRef}
            style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(90deg, #2563EB, #7C3AED, #06B6D4)',
              borderRadius: 3,
              animation: 'cowalletLoad 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
            }}
          />
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 700,
          color: '#94A3B8', letterSpacing: '0.1em',
        }}>LOADING SECURE WORKSPACE</span>
      </div>

      <style>{`
        @keyframes cowalletLoad {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(-15%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}
