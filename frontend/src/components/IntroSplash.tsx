import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface IntroSplashProps {
  onComplete: () => void;
}

// Staggered letter animation for "CreatorVerse"
const letters = 'CreatorVerse'.split('');

const containerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.10,
      delayChildren: 0.6,
    },
  },
};

const letterVariants: any = {
  hidden: { opacity: 0, y: 50, filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const subtitleVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut', delay: 2.4 },
  },
};

const taglineVariants: any = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 3.0 },
  },
};

const orbVariants: any = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 1.8, ease: 'easeOut', delay: i * 0.2 },
  }),
};

const exitVariants: any = {
  exit: {
    opacity: 0,
    scale: 1.04,
    filter: 'blur(20px)',
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
};

// Particles for the splash
const splashParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: Math.random() * 5 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 6 + Math.random() * 8,
  delay: Math.random() * 4,
  opacity: Math.random() * 0.5 + 0.1,
}));



export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Total intro time: ~5.2s of animation + 0.3s buffer
    timerRef.current = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: '#070B2A' }}
      variants={exitVariants}
      exit="exit"
    >
      {/* ── Deep background orbs ── */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        variants={orbVariants}
        custom={0}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)',
          top: '20%',
          left: '60%',
        }}
        variants={orbVariants}
        custom={1}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
          bottom: '10%',
          left: '10%',
        }}
        variants={orbVariants}
        custom={2}
        initial="hidden"
        animate="visible"
      />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Floating particles ── */}
      {splashParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            filter: 'blur(1.5px)',
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: p.opacity }}
          transition={{ duration: 1, delay: p.delay * 0.3 }}
        />
      ))}

      {/* ── Rotating ring ── */}
      <motion.div
        className="absolute rounded-full border border-white/10"
        style={{ width: 480, height: 480 }}
        initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 360, scale: 1 }}
        transition={{ opacity: { duration: 1 }, rotate: { duration: 18, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.2, ease: 'easeOut' } }}
      />
      <motion.div
        className="absolute rounded-full border border-purple-500/20"
        style={{ width: 640, height: 640 }}
        initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
        animate={{ opacity: 1, rotate: -360, scale: 1 }}
        transition={{ opacity: { duration: 1.2 }, rotate: { duration: 28, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.4, ease: 'easeOut' } }}
      />
      <motion.div
        className="absolute rounded-full border border-blue-400/10"
        style={{ width: 800, height: 800 }}
        initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 360, scale: 1 }}
        transition={{ opacity: { duration: 1.4 }, rotate: { duration: 40, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.6, ease: 'easeOut' } }}
      />

      {/* ── Center content ── */}
      <div className="relative z-10 flex flex-col items-center text-center select-none">
        {/* "AI" badge */}
        <motion.div
          className="mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40"
          style={{ background: 'rgba(139,92,246,0.12)' }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-400"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-purple-300 text-xs font-semibold tracking-widest uppercase">
            AI-Powered Creator Intelligence
          </span>
        </motion.div>

        {/* Logo wordmark — staggered letters */}
        <motion.div
          className="flex items-end"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {letters.map((char, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              className="font-extrabold leading-none"
              style={{
                fontSize: 'clamp(52px, 8vw, 90px)',
                background:
                  i < 7
                    ? 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 60%, #818cf8 100%)'
                    : 'linear-gradient(135deg, #a78bfa 0%, #ec4899 60%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* "AI" glowing suffix */}
        <motion.div
          className="mt-1"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="font-black tracking-[0.25em] text-2xl"
            style={{
              background: 'linear-gradient(90deg, #a855f7, #ec4899, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 14px rgba(168,85,247,0.6))',
            }}
          >
            AI
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-white/50 text-base font-light tracking-wider"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Don't Analyze the Past. Simulate the Future.
        </motion.p>

        {/* Tagline pill */}
        <motion.div
          className="mt-6 flex items-center gap-6 text-white/30 text-xs"
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
        >
          {['Audience Council', 'Creator Multiverse', 'Brand Oracle'].map((t, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-purple-400/50" />
              {t}
            </span>
          ))}
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="mt-10 w-48 h-px rounded-full overflow-hidden bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.3, duration: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #ec4899, #3b82f6)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 3.4, duration: 1.8, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.p
          className="mt-3 text-white/25 text-[10px] tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 0.5 }}
        >
          Loading Intelligence Engine...
        </motion.p>
      </div>

      {/* ── Corner glows ── */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
    </motion.div>
  );
}
