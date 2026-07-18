import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Users,
  Camera,
  MapPin,
  Sparkles,
  Brain,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Loader2,
  ArrowRight,
  Droplets,
  Zap,
  Car,
  Trash2,
  Building2,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const schema = z.object({
  title: z.string().min(5, 'Please provide a short title (min 5 characters)'),
  description: z.string().min(10, 'Please describe the issue (min 10 characters)'),
  address: z.string().min(3, 'Please provide an address or nearby landmark'),
});

type FormData = z.infer<typeof schema>;

function classifyComplaint(title: string, description: string) {
  const text = (title + ' ' + description).toLowerCase();
  let department = 'Public Works';
  let category = 'General';
  let icon = Building2;
  let priority = 'medium';
  let estimatedResolution = '24 hours';
  let requiredDocs = ['Site photos', 'Location details'];
  let confidence = 85;

  if (text.match(/water|leak|pipe|pressure|dirty water|supply/)) {
    department = 'Water Works';
    category = 'Pipeline / Water Supply';
    icon = Droplets;
    priority = text.match(/critical|emergency|flood|burst/) ? 'critical' : 'high';
    estimatedResolution = '5 hours';
    requiredDocs = ['Site photos', 'Water meter reading', 'Property ID'];
    confidence = 94;
  } else if (text.match(/road|pothole|street|asphalt|damage/)) {
    department = 'Roads & Transport';
    category = 'Road Damage';
    icon = Car;
    priority = 'high';
    estimatedResolution = '48 hours';
    requiredDocs = ['Site photos', 'Road name/number', 'GPS coordinates'];
    confidence = 89;
  } else if (text.match(/power|electric|transformer|voltage|outage|cut/)) {
    department = 'Electricity';
    category = 'Power Supply';
    icon = Zap;
    priority = 'high';
    estimatedResolution = '12 hours';
    requiredDocs = ['Site photos', 'Consumer number', 'Pole ID'];
    confidence = 91;
  } else if (text.match(/garbage|waste|trash|sanitation|smell/)) {
    department = 'Sanitation';
    category = 'Waste Management';
    icon = Trash2;
    priority = 'medium';
    estimatedResolution = '8 hours';
    requiredDocs = ['Site photos', 'Collection point ID'];
    confidence = 86;
  } else if (text.match(/traffic|signal|jam|congestion|junction/)) {
    department = 'Traffic';
    category = 'Traffic Management';
    icon = Car;
    priority = 'medium';
    estimatedResolution = '3 hours';
    requiredDocs = ['Junction name', 'Time of occurrence'];
    confidence = 82;
  }

  return { department, category, icon, priority, estimatedResolution, requiredDocs, confidence };
}

export function CitizenPage() {
  const { wards, complaints, loading } = useSupabaseData();
  const [aiResult, setAiResult] = useState<ReturnType<typeof classifyComplaint> | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const title = watch('title');
  const description = watch('description');

  const runAI = () => {
    if (!title || !description || title.length < 5 || description.length < 10) return;
    setAnalyzing(true);
    setAiResult(null);
    setTimeout(() => {
      setAiResult(classifyComplaint(title, description));
      setAnalyzing(false);
    }, 1800);
  };

  const onSubmit = async (data: FormData) => {
    if (!aiResult) return;
    setSubmitting(true);
    const ward = wards[Math.floor(Math.random() * wards.length)];
    await supabase.from('complaints').insert({
      title: data.title,
      description: data.description,
      address: data.address,
      department: aiResult.department,
      category: aiResult.category,
      priority: aiResult.priority,
      status: 'active',
      ward_id: ward?.id,
      ai_confidence: aiResult.confidence,
      ai_analysis: { root_cause: 'AI classified', sentiment: 'neutral', urgency: aiResult.priority },
      estimated_resolution: aiResult.estimatedResolution,
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAiResult(null);
    }, 4000);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Citizen Portal"
        subtitle="Submit a complaint — AI will automatically classify and route it"
        icon={<Users className="h-5 w-5" strokeWidth={1.8} />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6" delay={0.05}>
            <div className="mb-6">
              <h2 className="font-display text-lg font-bold tracking-tight text-white">Report an Issue</h2>
              <p className="mt-1 text-sm text-ink-500">Describe the problem in your own words. Our AI will handle the rest.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-2xs font-semibold uppercase tracking-ultrawide text-ink-500 mb-2 block">Title</label>
                <input
                  {...register('title')}
                  placeholder="e.g., Water leakage on 5th Main Street"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm text-white placeholder:text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 transition-all duration-200"
                />
                {errors.title && <p className="mt-1.5 text-2xs text-error-400">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="text-2xs font-semibold uppercase tracking-ultrawide text-ink-500 mb-2 block">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe the issue in detail. When did it start? How is it affecting you?"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm text-white placeholder:text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 transition-all duration-200 resize-none"
                />
                {errors.description && <p className="mt-1.5 text-2xs text-error-400">{errors.description.message}</p>}
              </div>

              {/* Photo / Video upload (mock) */}
              <div>
                <label className="text-2xs font-semibold uppercase tracking-ultrawide text-ink-500 mb-2 block">Photo / Video (Optional)</label>
                <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.08] px-4 py-6 hover:border-primary-500/25 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer">
                  <div className="text-center">
                    <Camera className="mx-auto h-7 w-7 text-ink-600 mb-2" strokeWidth={1.8} />
                    <p className="text-xs text-ink-400">Click to upload media</p>
                    <p className="text-2xs text-ink-700 mt-0.5">PNG, JPG, MP4 up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-2xs font-semibold uppercase tracking-ultrawide text-ink-500 mb-2 block">Location / Address</label>
                <input
                  {...register('address')}
                  placeholder="e.g., Near Community Hall, 5th Main Street"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm text-white placeholder:text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/30 transition-all duration-200"
                />
                {errors.address && <p className="mt-1.5 text-2xs text-error-400">{errors.address.message}</p>}
              </div>

              <button type="button" className="flex items-center gap-2 text-2xs font-medium text-secondary-400 hover:text-secondary-300 transition-colors">
                <MapPin className="h-3.5 w-3.5" strokeWidth={2} /> Use my current GPS location
              </button>

              {/* AI Analyze button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={runAI}
                  disabled={analyzing || (!title || title.length < 5 || !description || description.length < 10)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500/12 to-secondary-500/6 border border-primary-500/20 px-4 py-3 text-sm font-medium text-primary-200 hover:from-primary-500/20 hover:to-secondary-500/12 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> AI is analyzing your complaint...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" strokeWidth={2} /> Run AI Analysis
                    </>
                  )}
                </button>
              </div>

              {/* Submit */}
              <AnimatePresence>
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button type="submit" disabled={submitting} className="btn-primary w-full">
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> Submitting...</>
                      ) : submitted ? (
                        <><CheckCircle2 className="h-4 w-4" strokeWidth={2} /> Complaint Submitted!</>
                      ) : (
                        <>Submit Complaint <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} /></>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </GlassCard>
        </div>

        {/* AI Analysis panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-6" glow>
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-glow"
                    >
                      <Brain className="h-8 w-8 text-white" strokeWidth={1.8} />
                    </motion.div>
                    <p className="mt-4 text-sm font-medium text-white">AI is analyzing your complaint</p>
                    <p className="text-2xs text-ink-600 mt-1">Classifying department, category, and priority...</p>
                    <div className="mt-4 space-y-2 w-full">
                      {['NLP Analysis', 'Category Detection', 'Priority Assessment', 'Route Assignment'].map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center gap-2 text-2xs text-ink-400"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                            className="h-1.5 w-1.5 rounded-full bg-primary-400"
                          />
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : aiResult ? (
              <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <GlassCard className="p-6" glow tilt>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-secondary-400" strokeWidth={2} />
                    <h3 className="font-display text-base font-semibold tracking-tight text-white">AI Analysis Result</h3>
                  </div>

                  <div className="space-y-2.5">
                    <AIResultRow icon={aiResult.icon} label="Department" value={aiResult.department} />
                    <AIResultRow icon={FileText} label="Category" value={aiResult.category} />
                    <div className="flex items-center justify-between rounded-2xl glass p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning-400" strokeWidth={2} />
                        <span className="text-2xs text-ink-500 uppercase tracking-ultrawide">Priority</span>
                      </div>
                      <PriorityBadge priority={aiResult.priority} size="sm" />
                    </div>
                    <div className="rounded-2xl glass p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary-400" strokeWidth={2} />
                          <span className="text-2xs text-ink-500 uppercase tracking-ultrawide">AI Confidence</span>
                        </div>
                        <span className="text-sm font-bold text-white">{aiResult.confidence}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04]">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${aiResult.confidence}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
                      </div>
                    </div>
                    <AIResultRow icon={Clock} label="Est. Resolution" value={aiResult.estimatedResolution} />
                    <div className="rounded-2xl glass p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-accent-400" strokeWidth={2} />
                        <span className="text-2xs text-ink-500 uppercase tracking-ultrawide">Required Documents</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.requiredDocs.map((doc) => (
                          <span key={doc} className="rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-2xs text-ink-300">{doc}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-gradient-to-br from-success-500/8 to-transparent border border-success-500/15 p-3">
                    <p className="text-2xs text-success-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} /> Your complaint has been auto-routed to {aiResult.department}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl glass-strong">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/8 to-secondary-500/4" />
                      <Sparkles className="relative h-7 w-7 text-ink-600" strokeWidth={1.8} />
                    </div>
                    <p className="mt-4 text-sm font-medium text-ink-300">AI Analysis Ready</p>
                    <p className="mt-1.5 max-w-xs text-2xs text-ink-600 text-pretty leading-relaxed">
                      Fill in the complaint form and click "Run AI Analysis" to see automatic classification, routing, and priority assignment.
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent complaints */}
      <div className="mt-6">
        <GlassCard className="p-6" delay={0.1}>
          <h3 className="mb-4 font-display text-base font-semibold tracking-tight text-white">Recent Complaints</h3>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary-400" strokeWidth={2} /></div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {complaints.slice(0, 6).map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl glass p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-white">{c.title}</p>
                    <PriorityBadge priority={c.priority} size="sm" />
                  </div>
                  <p className="text-2xs text-ink-500 line-clamp-2 leading-relaxed">{c.description}</p>
                  <div className="mt-2.5 flex items-center gap-3 text-2xs text-ink-600">
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" strokeWidth={2} /> {c.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" strokeWidth={2} /> {c.address}</span>
                    <Badge variant={c.ai_confidence > 90 ? 'success' : 'info'} size="sm">{c.ai_confidence}% AI</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function AIResultRow({ icon: Icon, label, value }: { icon: typeof Droplets; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl glass p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-400" strokeWidth={2} />
        <span className="text-2xs text-ink-500 uppercase tracking-ultrawide">{label}</span>
      </div>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
