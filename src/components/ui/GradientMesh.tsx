import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Animated gradient mesh background with floating particles
export function GradientMesh({ className = '' }: { className?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated mesh blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary-600/20 blur-[120px] animate-float-slow" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-secondary-500/15 blur-[140px] animate-float-medium" />
      <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[100px] animate-float-fast" />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
