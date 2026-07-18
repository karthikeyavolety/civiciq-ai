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
    accent: 'from-primary-500/20 to-primary-600/5',
    iconColor: 'text-primary-300',
  },
  {
    icon: Bot,
    title: 'Officer Copilot',
    description:
      'Every morning, AI generates a prioritized executive action plan with budget estimates, team suggestions, and confidence scores.',
    accent: 'from-secondary-500/20 to-secondary-600/5',
    iconColor: 'text-secondary-300',
  },
  {
    icon: FileText,
    title: 'AI Executive Brief',
    description:
      'Auto-generated daily, weekly, and monthly intelligence reports that summarize the civic health of your entire jurisdiction.',
    accent: 'from-accent-500/20 to-accent-600/5',
    iconColor: 'text-accent-300',
  },
  {
    icon: Shield,
    title: 'AI Civic Health Score',
    description:
      'Every ward gets a real-time score across infrastructure, roads, water, electricity, garbage, traffic, and citizen satisfaction.',
    accent: 'from-success-500/20 to-success-600/5',
    iconColor: 'text-success-300',
  },
  {
    icon: Activity,
    title: 'AI Infrastructure Intelligence',
    description:
      'Predictive models detect degrading infrastructure before it fails — from pipelines to transformers to road surfaces.',
    accent: 'from-indigo-500/20 to-indigo-600/5',
    iconColor: 'text-indigo-300',
  },
  {
    icon: TrendingUp,
    title: 'Department Performance Analytics',
    description:
      'Track resolution times, budget efficiency, and citizen satisfaction across every department with beautiful dashboards.',
    accent: 'from-rose-500/20 to-rose-600/5',
    iconColor: 'text-rose-300',
  },
];

const stats = [
  { value: 2847, label: 'Complaints Processed', suffix: '', icon: Users },
  { value: 18, label: 'Root Causes Identified', suffix: '', icon: Brain },
  { value: 67, label: 'Resolution Rate', suffix: '%', icon: CheckCircle2 },
  { value: 1240, label: 'Estimated Savings (₹K)', suffix: 'K', icon: TrendingUp },
];

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative min-h-screen bg-ink-950">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between rounded-2xl glass px-5 py-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-glow">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">CivicIQ</span>
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <a href="#features" className="text-sm text-ink-300 hover:text-white transition-colors">Features</a>
              <a href="#how" className="text-sm text-ink-300 hover:text-white transition-colors">How It Works</a>
              <a href="#stats" className="text-sm text-ink-300 hover:text-white transition-colors">Impact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/app" className="btn-ghost text-sm">
                Sign In
              </Link>
              <Link to="/app" className="btn-primary text-sm">
                Launch Platform
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <GradientMesh />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-secondary-300 mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              The AI Intelligence Layer for Modern Governance
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]"
            >
              Transform Citizen Complaints
              <br />
              into <span className="text-gradient">Government Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-ink-400 leading-relaxed"
            >
              CivicIQ uses Artificial Intelligence to identify infrastructure failures,
              prioritize repairs, and help governments make smarter, data-driven decisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/app" className="btn-primary">
                Explore the Platform
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/app/intelligence" className="btn-ghost">
                <Brain className="h-4 w-4" />
                See AI Root Cause Engine
              </Link>
            </motion.div>
          </div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 text-center">
                    <Icon className="mx-auto h-6 w-6 text-primary-400 mb-3" />
                    <div className="font-display text-3xl font-bold text-white">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="mt-1 text-xs text-ink-400">{stat.label}</p>
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
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <GlassCard className="group h-full p-6">
                    <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${feature.accent} p-3`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-ink-400 leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
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
            <GradientMesh className="opacity-50" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                Ready to upgrade your city's intelligence?
              </h2>
              <p className="mt-4 text-ink-400">
                Join the next generation of data-driven governance.
              </p>
              <Link to="/app" className="btn-primary mt-8">
                Launch CivicIQ Platform
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-display text-sm font-bold text-white">CivicIQ</span>
                <p className="text-[10px] text-ink-500">The AI Intelligence Layer for Modern Governance</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-ink-500">
              <a href="#" className="hover:text-ink-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-ink-300 transition-colors">Security</a>
              <a href="#" className="hover:text-ink-300 transition-colors">Documentation</a>
              <a href="#" className="hover:text-ink-300 transition-colors">Contact</a>
            </div>
            <p className="text-xs text-ink-600">© 2026 CivicIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 blur-3xl rounded-3xl" />

      <div className="relative rounded-3xl glass-strong p-2">
        <div className="rounded-2xl bg-ink-950/80 p-6">
          {/* Window bar */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
            </div>
            <div className="ml-3 flex items-center gap-2 text-xs text-ink-500">
              <Sparkles className="h-3 w-3 text-secondary-400" />
              civiciq.ai/intelligence
            </div>
          </div>

          {/* Mock dashboard */}
          <div className="grid grid-cols-12 gap-3">
            {/* Root cause card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="col-span-12 md:col-span-7 rounded-2xl glass p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary-400" />
                  <span className="text-xs font-medium text-ink-300">AI Root Cause Analysis</span>
                </div>
                <span className="rounded-full bg-success-500/15 px-2 py-0.5 text-[10px] font-medium text-success-300">94% Confidence</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white">Primary Pipeline Failure</h3>
              <p className="mt-1 text-xs text-ink-400">3,240 citizens affected across 3 wards</p>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Water Leakage', count: '52 complaints' },
                  { label: 'Low Water Pressure', count: '41 complaints' },
                  { label: 'Dirty Water', count: '32 complaints' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3.5 w-3.5 text-secondary-400" />
                      <span className="text-xs text-ink-200">{c.label}</span>
                    </div>
                    <span className="text-[10px] text-ink-500">{c.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="col-span-12 md:col-span-5 space-y-3">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="rounded-2xl glass p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-accent-400" />
                  <span className="text-xs font-medium text-ink-300">Today's Critical Issue</span>
                </div>
                <p className="text-sm font-semibold text-white">Pipeline Repair</p>
                <p className="text-[10px] text-ink-500 mt-1">Est. Budget: ₹45,000 · 5 hours</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '96%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="rounded-2xl glass p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-success-400" />
                  <span className="text-xs font-medium text-ink-300">Civic Health Score</span>
                </div>
                <div className="flex items-center justify-between">
                  {[
                    { ward: 'W1', score: 89, color: 'text-success-400' },
                    { ward: 'W2', score: 64, color: 'text-warning-400' },
                    { ward: 'W3', score: 92, color: 'text-success-400' },
                  ].map((w) => (
                    <div key={w.ward} className="text-center">
                      <p className={`font-display text-lg font-bold ${w.color}`}>{w.score}</p>
                      <p className="text-[9px] text-ink-500">{w.ward}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="rounded-2xl glass p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-accent-400" />
                  <span className="text-xs font-medium text-ink-300">AI Recommendation</span>
                </div>
                <p className="text-xs text-ink-200">Inspect underground main pipeline at Junction 7</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-primary-400">
                  <MapPin className="h-3 w-3" /> Ward 2 · Industrial Zone
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
      color: 'from-rose-500/20 to-rose-600/5',
      iconColor: 'text-rose-300',
    },
    {
      icon: Brain,
      title: 'AI Clustering',
      items: ['NLP Analysis', 'Geospatial Grouping', 'Causal Inference'],
      color: 'from-primary-500/20 to-primary-600/5',
      iconColor: 'text-primary-300',
    },
    {
      icon: Activity,
      title: '1 Root Cause',
      items: ['Primary Pipeline Failure', '94% Confidence', '3,240 Citizens Affected'],
      color: 'from-success-500/20 to-success-600/5',
      iconColor: 'text-success-300',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <motion.div key={step.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
            <GlassCard className="p-6">
              <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${step.color} p-3`}>
                <Icon className={`h-6 w-6 ${step.iconColor}`} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">{step.title}</h3>
              <div className="mt-3 space-y-1.5">
                {step.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-ink-400">
                    <div className="h-1 w-1 rounded-full bg-current" />
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>
            {i < steps.length - 1 && (
              <div className="hidden md:flex absolute items-center justify-center">
                <ArrowRight className="h-5 w-5 text-ink-600" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
