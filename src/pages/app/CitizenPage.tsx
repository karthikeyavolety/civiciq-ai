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

// Simulated AI classification engine
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
        icon={<Users className="h-5 w-5" />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6">
            <div className="mb-6">
              <h2 className="font-display text-lg font-semibold text-white">Report an Issue</h2>
              <p className="text-sm text-ink-400 mt-1">Describe the problem in your own words. Our AI will handle the rest.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-ink-300 uppercase tracking-wider mb-2 block">Title</label>
                <input
                  {...register('title')}
                  placeholder="e.g., Water leakage on 5th Main Street"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm text-white placeholder:text-ink-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
                {errors.title && <p className="mt-1 text-xs text-error-400">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-ink-300 uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe the issue in detail. When did it start? How is it affecting you?"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm text-white placeholder:text-ink-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none"
                />
                {errors.description && <p className="mt-1 text-xs text-error-400">{errors.description.message}</p>}
              </div>

              {/* Photo / Video upload (mock) */}
              <div>
                <label className="text-xs font-medium text-ink-300 uppercase tracking-wider mb-2 block">Photo / Video (Optional)</label>
                <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-white/10 px-4 py-6 hover:border-primary-500/30 transition-all cursor-pointer">
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-ink-500 mb-2" />
                    <p className="text-xs text-ink-400">Click to upload media</p>
                    <p className="text-[10px] text-ink-600 mt-0.5">PNG, JPG, MP4 up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-medium text-ink-300 uppercase tracking-wider mb-2 block">Location / Address</label>
                <input
                  {...register('address')}
                  placeholder="e.g., Near Community Hall, 5th Main Street"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm text-white placeholder:text-ink-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
                {errors.address && <p className="mt-1 text-xs text-error-400">{errors.address.message}</p>}
              </div>

              {/* GPS button (mock) */}
              <button type="button" className="flex items-center gap-2 text-xs text-secondary-400 hover:text-secondary-300 transition-colors">
                <MapPin className="h-3.5 w-3.5" /> Use my current GPS location
              </button>

              {/* AI Analyze button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={runAI}
                  disabled={analyzing || (!title || title.length < 5 || !description || description.length < 10)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/10 border border-primary-500/30 px-4 py-3 text-sm font-medium text-primary-200 hover:from-primary-500/30 hover:to-secondary-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> AI is analyzing your complaint...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Run AI Analysis
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
                  >
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full"
                    >
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                      ) : submitted ? (
                        <><CheckCircle2 className="h-4 w-4" /> Complaint Submitted!</>
                      ) : (
                        <>Submit Complaint <ArrowRight className="h-4 w-4" /></>
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
                <GlassCard className="p-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500"
                    >
                      <Brain className="h-8 w-8 text-white" />
                    </motion.div>
                    <p className="mt-4 text-sm font-medium text-white">AI is analyzing your complaint</p>
                    <p className="text-xs text-ink-500 mt-1">Classifying department, category, and priority...</p>
                    <div className="mt-4 space-y-2 w-full">
                      {['NLP Analysis', 'Category Detection', 'Priority Assessment', 'Route Assignment'].map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.4 }}
                          className="flex items-center gap-2 text-xs text-ink-400"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
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
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-6" glow>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-secondary-400" />
                    <h3 className="font-display text-lg font-semibold text-white">AI Analysis Result</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Department */}
                    <AIResultRow icon={aiResult.icon} label="Department" value={aiResult.department} />
                    {/* Category */}
                    <AIResultRow icon={FileText} label="Category" value={aiResult.category} />
                    {/* Priority */}
                    <div className="flex items-center justify-between rounded-2xl glass p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning-400" />
                        <span className="text-xs text-ink-400">Priority</span>
                      </div>
                      <PriorityBadge priority={aiResult.priority} />
                    </div>
                    {/* Confidence */}
                    <div className="rounded-2xl glass p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary-400" />
                          <span className="text-xs text-ink-400">AI Confidence</span>
                        </div>
                        <span className="text-sm font-bold text-white">{aiResult.confidence}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${aiResult.confidence}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
                      </div>
                    </div>
                    {/* Estimated Resolution */}
                    <AIResultRow icon={Clock} label="Est. Resolution" value={aiResult.estimatedResolution} />
                    {/* Required Documents */}
                    <div className="rounded-2xl glass p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-accent-400" />
                        <span className="text-xs text-ink-400">Required Documents</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.requiredDocs.map((doc) => (
                          <span key={doc} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-ink-300">{doc}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-gradient-to-br from-success-500/10 to-transparent border border-success-500/20 p-3">
                    <p className="text-xs text-success-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Your complaint has been auto-routed to {aiResult.department}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                      <Sparkles className="h-8 w-8 text-ink-600" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-ink-300">AI Analysis Ready</p>
                    <p className="text-xs text-ink-500 mt-1 max-w-xs">Fill in the complaint form and click "Run AI Analysis" to see automatic classification, routing, and priority assignment.</p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent complaints */}
      <div className="mt-6">
        <GlassCard className="p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-white">Recent Complaints</h3>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary-400" /></div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {complaints.slice(0, 6).map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl glass p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-white">{c.title}</p>
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <p className="text-xs text-ink-400 line-clamp-2">{c.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-ink-500">
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {c.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.address}</span>
                    <Badge variant={c.ai_confidence > 90 ? 'success' : 'info'}>{c.ai_confidence}% AI</Badge>
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
        <Icon className="h-4 w-4 text-primary-400" />
        <span className="text-xs text-ink-400">{label}</span>
      </div>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
