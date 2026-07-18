import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Bot,
  FileText,
  Shield,
  Activity,
  Droplets,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { GradientMesh } from '../components/ui/GradientMesh';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { SectionHeading } from '../components/ui/SectionHeading';

const features = [
  {
    icon: Brain,
    title: 'AI Root Cause Engine',
    description:
      'Groups thousands of citizen complaints into a handful of root infrastructure failures using NLP clustering and causal inference.',
    gradient: 'from-primary-500/15 to-primary-600/5',
    iconColor: 'text-primary-300',
    glow: 'shadow-[0_0_24px_-6px_rgba(59,130,246,0.25)]',
  },
  {
    icon: Bot,
    title: 'Officer Copilot',
    description:
      'Every morning, AI generates a prioritized executive action plan with budget estimates, team suggestions, and confidence scores.',
    gradient: 'from-secondary-500/15 to-secondary-600/5',
    iconColor: 'text-secondary-300',
    glow: 'shadow-[0_0_24px_-6px_rgba(6,182,212,0.25)]',
  },
  {
    icon: FileText,
    title: 'AI Executive Brief',
    description:
      'Auto-generated daily, weekly, and monthly intelligence reports that summarize the civic health of your entire jurisdiction.',
    gradient: 'from-accent-500/15 to-accent-600/5',
    iconColor: 'text-accent-300',
    glow: 'shadow-[0_0_24px_-6px_rgba(245,158,11,0.20)]',
  },
  {
    icon: Shield,
    title: 'AI Civic Health Score',
    description:
      'Every ward gets a real-time score across infrastructure, roads, water, electricity, garbage, traffic, and citizen satisfaction.',
    gradient: 'from-success-500/15 to-success-600/5',
    iconColor: 'text-success-300',
    glow: 'shadow-[0_0_24px_-6px_rgba(34,197,94,0.20)]',
  },
  {
    icon: Activity,
    title: 'AI Infrastructure Intelligence',
    description:
      'Predictive models detect degrading infrastructure before it fails — from pipelines to transformers to road surfaces.',
    gradient: 'from-indigo-500/15 to-indigo-600/5',
    iconColor: 'text-indigo-300',
    glow: 'shadow-[0_0_24px_-6px_rgba(99,102,241,0.20)]',
  },
  {
    icon: TrendingUp,
    title: 'Department Performance Analytics',
    description:
      'Track resolution times, budget efficiency, and citizen satisfaction across every department with beautiful dashboards.',
    gradient: 'from-rose-500/15 to-rose-600/5',
    iconColor: 'text-rose-300',
    glow: 'shadow-[0_0_24px_-6px_rgba(251,113,133,0.20)]',
  },
];

const stats = [
  { value: 2847, label: 'Complaints Processed', suffix: '', icon: Users, color: 'text-primary-400' },
  { value: 18, label: 'Root Causes Identified', suffix: '', icon: Brain, color: 'text-secondary-400' },
  { value: 67, label: 'Resolution Rate', suffix: '%', icon: CheckCircle2, color: 'text-success-400' },
  { value: 1240, label: 'Est. Savings (₹K)', suffix: 'K', icon: TrendingUp, color: 'text-accent-400' },
];

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative min-h-screen bg-ink-950 noise-overlay">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between rounded-2xl glass-strong px-5 py-2.5"
          >
            <Link to="/" className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-glow">
                <Brain className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-white">CivicIQ</span>
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <a href="#features" className="text-sm text-ink-400 hover:text-white transition-colors duration-200">Features</a>
              <a href="#how" className="text-sm text-ink-400 hover:text-white transition-colors duration-200">How It Works</a>
              <a href="#stats" className="text-sm text-ink-400 hover:text-white transition-colors duration-200">Impact</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Link to="/app" className="btn-ghost text-sm">
                Sign In
              </Link>
              <Link to="/app" className="btn-primary text-sm">
                Launch Platform
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden aurora-bg-animated">
        <GradientMesh particleCount={20} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-7xl px-6 pt-36 pb-20"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-1.5 text-2xs font-semibold uppercase tracking-ultrawide text-secondary-300 mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              The AI Intelligence Layer for Modern Governance
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] text-balance"
            >
              Transform Citizen Complaints
              <br />
              into <span className="text-gradient">Government Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-ink-400 leading-relaxed text-pretty"
            >
              CivicIQ uses Artificial Intelligence to identify infrastructure failures,
              prioritize repairs, and help governments make smarter, data-driven decisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link to="/app" className="btn-primary">
                Explore the Platform
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/app/intelligence" className="btn-ghost">
                <Brain className="h-3.5 w-3.5" />
                See AI Root Cause Engine
              </Link>
            </motion.div>
          </div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mt-16"
          >
            <DashboardPreview />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                >
                  <GlassCard className="p-6 text-center" tilt>
                    <Icon className={`mx-auto h-5 w-5 ${stat.color} mb-3`} strokeWidth={2} />
                    <div className="font-display text-3xl font-bold tracking-tight text-white">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="mt-1 text-2xs font-medium uppercase tracking-ultrawide text-ink-500">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Platform Capabilities"
            title={<>One AI Operating System <br /> for <span className="text-gradient">Modern Governance</span></>}
            subtitle="Six intelligence modules that work together to transform how governments understand and respond to citizen needs."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                >
                  <GlassCard className="group h-full p-6" tilt>
                    <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 ${feature.glow}`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} strokeWidth={1.8} />
                    </div>
                    <h3 className="font-display text-base font-semibold tracking-tight text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-ink-400 leading-relaxed text-pretty">{feature.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Root Cause Engine"
            title={<>From <span className="text-gradient-warm">125 complaints</span> to <span className="text-gradient">3 root causes</span></>}
            subtitle="Instead of drowning in individual complaints, AI clusters them into actionable infrastructure failures."
          />
          <div className="mt-14">
            <RootCauseFlow />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-6">
          <GlassCard className="overflow-hidden p-10 text-center" glow>
            <GradientMesh className="opacity-40" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white text-balance">
                Ready to upgrade your city's intelligence?
              </h2>
              <p className="mt-4 text-ink-400 text-pretty">
                Join the next generation of data-driven governance.
              </p>
              <Link to="/app" className="btn-primary mt-8">
                Launch CivicIQ Platform
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
                <Brain className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <div>
                <span className="font-display text-sm font-bold tracking-tight text-white">CivicIQ</span>
                <p className="text-2xs text-ink-600">The AI Intelligence Layer for Modern Governance</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-2xs text-ink-600">
              <a href="#" className="hover:text-ink-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-ink-300 transition-colors">Security</a>
              <a href="#" className="hover:text-ink-300 transition-colors">Documentation</a>
              <a href="#" className="hover:text-ink-300 transition-colors">Contact</a>
            </div>
            <p className="text-2xs text-ink-700">© 2026 CivicIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/15 via-secondary-500/15 to-primary-500/15 blur-[80px] rounded-[2.5rem]" />

      <div className="relative rounded-[2rem] glass-premium p-2">
        <div className="rounded-[1.5rem] bg-ink-950/80 p-6 overflow-hidden">
          {/* Window bar */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
            </div>
            <div className="ml-3 flex items-center gap-1.5 text-2xs text-ink-600">
              <Sparkles className="h-3 w-3 text-secondary-400" strokeWidth={2} />
              civiciq.ai/intelligence
            </div>
          </div>

          {/* Mock dashboard */}
          <div className="grid grid-cols-12 gap-3">
            {/* Root cause card */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="col-span-12 md:col-span-7 rounded-2xl glass p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary-400" strokeWidth={2} />
                  <span className="text-xs font-medium text-ink-300">AI Root Cause Analysis</span>
                </div>
                <span className="rounded-full bg-success-500/12 border border-success-500/20 px-2 py-0.5 text-2xs font-semibold text-success-300">94% Confidence</span>
              </div>
              <h3 className="font-display text-lg font-bold tracking-tight text-white">Primary Pipeline Failure</h3>
              <p className="mt-1 text-xs text-ink-500">3,240 citizens affected across 3 wards</p>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Water Leakage', count: '52 complaints', icon: Droplets, color: 'text-secondary-400' },
                  { label: 'Low Water Pressure', count: '41 complaints', icon: TrendingUp, color: 'text-primary-400' },
                  { label: 'Dirty Water', count: '32 complaints', icon: AlertTriangle, color: 'text-accent-400' },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${c.color}`} strokeWidth={2} />
                        <span className="text-xs text-ink-200">{c.label}</span>
                      </div>
                      <span className="text-2xs text-ink-600">{c.count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="col-span-12 md:col-span-5 space-y-3">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="rounded-2xl glass p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-accent-400" strokeWidth={2} />
                  <span className="text-xs font-medium text-ink-300">Today's Critical Issue</span>
                </div>
                <p className="text-sm font-semibold text-white">Pipeline Repair</p>
                <p className="text-2xs text-ink-600 mt-1">Est. Budget: ₹45,000 · 5 hours</p>
                <div className="mt-2.5 h-1.5 rounded-full bg-white/[0.04]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '96%' }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="rounded-2xl glass p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-success-400" strokeWidth={2} />
                  <span className="text-xs font-medium text-ink-300">Civic Health Score</span>
                </div>
                <div className="flex items-center justify-between">
                  {[
                    { ward: 'W1', score: 89, color: 'text-success-400' },
                    { ward: 'W2', score: 64, color: 'text-warning-400' },
                    { ward: 'W3', score: 92, color: 'text-success-400' },
                  ].map((w) => (
                    <div key={w.ward} className="text-center">
                      <p className={`font-display text-lg font-bold tracking-tight ${w.color}`}>{w.score}</p>
                      <p className="text-2xs text-ink-600">{w.ward}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="rounded-2xl glass p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-accent-400" strokeWidth={2} />
                  <span className="text-xs font-medium text-ink-300">AI Recommendation</span>
                </div>
                <p className="text-xs text-ink-200">Inspect underground main pipeline at Junction 7</p>
                <div className="mt-2 flex items-center gap-1 text-2xs text-primary-400">
                  <MapPin className="h-3 w-3" strokeWidth={2} /> Ward 2 · Industrial Zone
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RootCauseFlow() {
  const steps = [
    {
      icon: Users,
      title: '125 Complaints',
      items: ['Water Leakage', 'Low Water Pressure', 'Dirty Water'],
      gradient: 'from-rose-500/15 to-rose-600/5',
      iconColor: 'text-rose-300',
      glow: 'shadow-[0_0_24px_-6px_rgba(251,113,133,0.20)]',
    },
    {
      icon: Brain,
      title: 'AI Clustering',
      items: ['NLP Analysis', 'Geospatial Grouping', 'Causal Inference'],
      gradient: 'from-primary-500/15 to-primary-600/5',
      iconColor: 'text-primary-300',
      glow: 'shadow-[0_0_24px_-6px_rgba(59,130,246,0.25)]',
    },
    {
      icon: Activity,
      title: '1 Root Cause',
      items: ['Primary Pipeline Failure', '94% Confidence', '3,240 Citizens Affected'],
      gradient: 'from-success-500/15 to-success-600/5',
      iconColor: 'text-success-300',
      glow: 'shadow-[0_0_24px_-6px_rgba(34,197,94,0.20)]',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
          >
            <GlassCard className="p-6" tilt>
              <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${step.gradient} p-3 ${step.glow}`}>
                <Icon className={`h-6 w-6 ${step.iconColor}`} strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-lg font-bold tracking-tight text-white">{step.title}</h3>
              <div className="mt-3 space-y-1.5">
                {step.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-ink-400">
                    <div className="h-1 w-1 rounded-full bg-current opacity-50" />
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
