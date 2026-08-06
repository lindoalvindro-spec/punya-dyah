import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, Heart, Star } from 'lucide-react';

export default function GiftUnboxing({ onOpen }) {
  const containerRef = useRef(null);
  const giftBoxRef = useRef(null);
  const giftLidRef = useRef(null);
  const textRef = useRef(null);
  const auraRef = useRef(null);
  const [isOpening, setIsOpening] = useState(false);

  // Background floating ambient sparkles
  const bgParticles = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 95}%`,
    size: Math.random() * 12 + 8,
    duration: Math.random() * 5 + 4,
    delay: Math.random() * 3,
  }));

  useGSAP(() => {
    // 1. Entrance animation for Gift Box
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 }
    );

    gsap.fromTo(giftBoxRef.current,
      { scale: 0.5, y: 50, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
    );

    gsap.fromTo(textRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.3 }
    );

    // 2. Continuous floating & idle bounce for Gift Box
    gsap.to(giftBoxRef.current, {
      y: '-=12',
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, { scope: containerRef });

  const handleOpenGift = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Launch Confetti Burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#ff2a8d', '#ffd700', '#ff77bc', '#ffffff', '#e0115f'],
    });

    // GSAP Unboxing Sequence
    const tl = gsap.timeline();

    // Shake & pulse lid
    tl.to(giftBoxRef.current, {
      rotation: -10,
      duration: 0.1,
    })
    .to(giftBoxRef.current, {
      rotation: 10,
      duration: 0.1,
    })
    .to(giftBoxRef.current, {
      rotation: -8,
      duration: 0.1,
    })
    .to(giftBoxRef.current, {
      rotation: 8,
      duration: 0.1,
    })
    .to(giftBoxRef.current, {
      rotation: 0,
      scale: 1.2,
      duration: 0.25,
      ease: 'back.out(2)',
    })
    // Pop Lid upward
    .to(giftLidRef.current, {
      y: -60,
      rotation: -25,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.1')
    // Expand Glowing Light Aura Burst
    .to(auraRef.current, {
      scale: 6,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.3')
    // Fade out whole container smoothly into main page
    .to(containerRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        if (onOpen) onOpen();
      },
    }, '+=0.1');
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: 'radial-gradient(circle at 50% 45%, #3d0738 0%, #1c031b 60%, #0d010e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Floating Background Sparkles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {bgParticles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              bottom: '-20px',
              fontSize: `${p.size}px`,
              opacity: 0.5,
              filter: 'drop-shadow(0 0 6px #ff2a8d)',
              animation: `floatUp ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Light Burst Radial Aura */}
      <div
        ref={auraRef}
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 42, 141, 0.8) 40%, transparent 70%)',
          filter: 'blur(15px)',
          opacity: 0,
          scale: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* Header Instruction Text */}
      <div
        ref={textRef}
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            background: 'rgba(255, 42, 141, 0.15)',
            border: '1px solid rgba(255, 105, 180, 0.4)',
            borderRadius: '20px',
            marginBottom: '14px',
            boxShadow: '0 0 15px rgba(255, 42, 141, 0.3)',
          }}
        >
          <Sparkles size={14} color="#ffd700" />
          <span style={{ fontSize: '0.85rem', color: '#ffe0f0', fontWeight: '500' }}>Surprise Unboxing</span>
          <Sparkles size={14} color="#ffd700" />
        </div>

        <h2
          className="neon-text"
          style={{
            fontSize: '1.45rem',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.5px',
            lineHeight: '1.3',
          }}
        >
          {isOpening ? '✨ Opening your gift... ✨' : 'Tap the gift box to open it 🎁'}
        </h2>
      </div>

      {/* Interactive Gift Box Container */}
      <div
        ref={giftBoxRef}
        onClick={handleOpenGift}
        style={{
          position: 'relative',
          width: '160px',
          height: '160px',
          cursor: 'pointer',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ambient Glow behind Box */}
        <div
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,42,141,0.5) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'pulseGlow 2.2s infinite ease-in-out',
          }}
        />

        {/* Floating Cute Sticker Ornament */}
        <img
          src="/lucu 2 no bg.png"
          alt="Cute Sticker"
          style={{
            position: 'absolute',
            top: '-45px',
            right: '-30px',
            width: '60px',
            height: 'auto',
            filter: 'drop-shadow(0 0 10px #ff2a8d)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Floating Mini Stars around Gift Box */}
        <div style={{ position: 'absolute', top: '-15px', right: '-10px', pointerEvents: 'none' }}>
          <Star size={18} color="#ffd700" fill="#ffd700" style={{ filter: 'drop-shadow(0 0 8px #ffd700)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '-10px', left: '-15px', pointerEvents: 'none' }}>
          <Sparkles size={20} color="#ff77bc" style={{ filter: 'drop-shadow(0 0 8px #ff2a8d)' }} />
        </div>

        {/* 3D-styled SVG Gift Box */}
        <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }}>
          <defs>
            <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5ca0" />
              <stop offset="50%" stopColor="#ff2a8d" />
              <stop offset="100%" stopColor="#b3004b" />
            </linearGradient>

            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3a1" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#d4a000" />
            </linearGradient>

            <filter id="giftGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Gift Box Main Body */}
          <rect x="35" y="75" width="130" height="95" rx="10" fill="url(#boxGrad)" stroke="#ffffff" strokeWidth="1.5" />

          {/* Vertical Ribbon Body */}
          <rect x="88" y="75" width="24" height="95" fill="url(#ribbonGrad)" />

          {/* Gift Box Lid (Separate Ref for Opening Animation) */}
          <g ref={giftLidRef}>
            <rect x="25" y="55" width="150" height="30" rx="6" fill="url(#boxGrad)" stroke="#ffffff" strokeWidth="1.5" filter="url(#giftGlow)" />
            <rect x="88" y="55" width="24" height="30" fill="url(#ribbonGrad)" />

            {/* Glowing Golden Bow Ribbon Loops */}
            <path d="M 100 55 C 75 25, 50 35, 88 55 Z" fill="url(#ribbonGrad)" stroke="#ffffff" strokeWidth="1" />
            <path d="M 100 55 C 125 25, 150 35, 112 55 Z" fill="url(#ribbonGrad)" stroke="#ffffff" strokeWidth="1" />
            <circle cx="100" cy="55" r="8" fill="#ffffff" filter="drop-shadow(0 0 6px #ffd700)" />
            <circle cx="100" cy="55" r="5" fill="#ffd700" />
          </g>
        </svg>
      </div>

      {/* Tap Hint Badge */}
      <div
        style={{
          marginTop: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: '#ffe0f0',
          opacity: 0.9,
          zIndex: 2,
        }}
      >
        <Heart size={14} fill="var(--neon-pink)" color="var(--neon-pink)" />
        <span>Sent with special love for Agaa</span>
        <Heart size={14} fill="var(--neon-pink)" color="var(--neon-pink)" />
      </div>
    </div>
  );
}
