import { motion, useMotionValue, useSpring, useTransform, type MotionProps } from 'framer-motion';
import { useRef, type ReactNode, type PointerEvent } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  float?: boolean;
  glow?: boolean;
  tilt?: boolean;
  delay?: number;
} & Omit<MotionProps, 'children'>;

export function GlassCard({
  children,
  className = '',
  hover = true,
  float = false,
  glow = false,
  tilt = false,
  delay = 0,
  ...rest
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={
        hover
          ? { y: -4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
          : undefined
      }
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      className={`relative rounded-3xl glass ${float ? 'animate-float-slow' : ''} ${
        glow ? 'glow-ring' : ''
      } ${className}`}
      {...rest}
    >
      {/* Specular highlight */}
      {tilt && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.10), transparent 60%)',
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {children}
    </motion.div>
  );
}
