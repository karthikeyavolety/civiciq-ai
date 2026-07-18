import { motion, type MotionProps } from 'framer-motion';
import { type ReactNode, type HTMLAttributes } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  float?: boolean;
  glow?: boolean;
} & HTMLAttributes<HTMLDivElement> & MotionProps;

export function GlassCard({
  children,
  className = '',
  hover = true,
  float = false,
  glow = false,
  ...rest
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hover
          ? { y: -6, transition: { duration: 0.2, ease: 'easeOut' } }
          : undefined
      }
      className={`relative rounded-3xl glass ${float ? 'animate-float-slow' : ''} ${
        glow ? 'glow-ring' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
