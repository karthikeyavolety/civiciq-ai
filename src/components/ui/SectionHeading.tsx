import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className = '',
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : 'text-left'} max-w-3xl ${className}`}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-2xs font-semibold uppercase tracking-ultrawide text-secondary-300 mb-5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-secondary-400 animate-pulse-glow" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] text-balance"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="mt-5 text-base md:text-lg text-ink-400 leading-relaxed text-pretty"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
